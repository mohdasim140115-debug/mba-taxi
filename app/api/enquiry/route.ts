import { site } from "@/lib/site-config";
import { basePath } from "@/lib/base-path";
import {
  enquirySummary,
  normalisePhone,
  serviceLabel,
  validateEnquiry,
  type EnquiryInput,
  type EnquiryPayload,
  type FieldErrors,
} from "@/lib/validation";

/**
 * POST /taxi-services/api/enquiry/
 *
 * Delivery channels (configure at least one, see README):
 *  - ENQUIRY_WEBHOOK_URL   : JSON POST (Google Apps Script → Sheet, Zapier, Make, n8n, CRM…)
 *  - RESEND_API_KEY + ENQUIRY_EMAIL_TO (+ ENQUIRY_EMAIL_FROM) : notification e-mail via Resend
 *
 * Success ({ ok: true, leadId }) is returned only when at least one channel
 * accepted the enquiry, so the browser never shows (or tracks) a false success.
 *
 * Accepts JSON (normal, JavaScript path) and form posts (before hydration or
 * without JavaScript), which are redirected to a confirmation/failure page.
 */

const MIN_FILL_MS = 2500;
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 };
// Best-effort, per server instance. Use a shared store (e.g. Upstash) if abuse appears.
const hits = new Map<string, number[]>();

type Result =
  | { ok: true; leadId: string }
  | { ok: false; status: number; message?: string; errors?: FieldErrors };

const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT.max;
}

async function handle(body: EnquiryPayload, request: Request, isJson: boolean): Promise<Result> {
  // Spam checks. Never fake a success here: a real person (e.g. one using
  // autofill) must see the error and the WhatsApp / call fallback instead.
  const tooFast = isJson && (typeof body.startedAt !== "number" || Date.now() - body.startedAt < MIN_FILL_MS);
  if (clip(body.hp_field, 200) || tooFast) {
    return { ok: false, status: 400, message: "Please check your details and press send again." };
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) {
    return { ok: false, status: 429, message: "Too many enquiries from this connection. Please call or WhatsApp us instead." };
  }

  const input: EnquiryInput = {
    name: clip(body.name, 80),
    email: clip(body.email, 120),
    phone: clip(body.phone, 20),
    service: clip(body.service, 40) as EnquiryInput["service"],
    pickup: clip(body.pickup, 120),
    drop: clip(body.drop, 120),
    date: clip(body.date, 10),
    time: clip(body.time, 5),
    passengers: clip(body.passengers, 3),
    vehicle: clip(body.vehicle, 30),
  };

  const errors = validateEnquiry(input);
  if (Object.keys(errors).length > 0) return { ok: false, status: 422, errors };

  const attribution = Object.fromEntries(
    Object.entries(body.attribution ?? {})
      .filter(([k]) => /^(gclid|gbraid|wbraid|utm_[a-z]+|landing_page)$/.test(k))
      .map(([k, v]) => [k, clip(v, 300)]),
  );

  const leadId = `MBA-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
  const lead = {
    leadId,
    receivedAt: new Date().toISOString(),
    ...input,
    phone: normalisePhone(input.phone) ?? input.phone,
    serviceLabel: input.service ? serviceLabel(input.service) : "",
    attribution,
    userAgent: clip(request.headers.get("user-agent"), 300),
  };

  const deliveries: Promise<boolean>[] = [];

  const webhook = process.env.ENQUIRY_WEBHOOK_URL;
  if (webhook) {
    deliveries.push(
      fetch(webhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.ENQUIRY_WEBHOOK_SECRET ? { "X-Webhook-Secret": process.env.ENQUIRY_WEBHOOK_SECRET } : {}),
        },
        body: JSON.stringify(lead),
        signal: AbortSignal.timeout(8000),
      })
        .then((r) => r.ok)
        .catch(() => false),
    );
  }

  const resendKey = process.env.RESEND_API_KEY;
  const emailTo = process.env.ENQUIRY_EMAIL_TO;
  if (resendKey && emailTo) {
    const attributionText = Object.entries(attribution)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
    const text = `${enquirySummary({ ...input, phone: lead.phone })}\n\nLead ID: ${leadId}\nReceived: ${lead.receivedAt}${
      attributionText ? `\n\nAttribution:\n${attributionText}` : ""
    }`;
    deliveries.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.ENQUIRY_EMAIL_FROM ?? `${site.name} <onboarding@resend.dev>`,
          to: emailTo.split(",").map((s) => s.trim()),
          subject: `New taxi enquiry from ${input.name}${lead.serviceLabel ? ` – ${lead.serviceLabel}` : ""}`,
          text,
        }),
        signal: AbortSignal.timeout(8000),
      })
        .then((r) => r.ok)
        .catch(() => false),
    );
  }

  if (deliveries.length === 0) {
    console.error("[enquiry] No delivery channel configured. Set ENQUIRY_WEBHOOK_URL or RESEND_API_KEY + ENQUIRY_EMAIL_TO.");
    return { ok: false, status: 503, message: "Online enquiries are temporarily unavailable." };
  }

  const results = await Promise.all(deliveries);
  if (!results.some(Boolean)) {
    console.error(`[enquiry] All delivery channels failed for ${leadId}`);
    return { ok: false, status: 502, message: "We couldn’t send your enquiry just now." };
  }

  return { ok: true, leadId };
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return Response.json({ ok: false, message: "Invalid request origin." }, { status: 403 });
  }

  const isJson = (request.headers.get("content-type") ?? "").includes("application/json");
  let body: EnquiryPayload;
  try {
    body = isJson
      ? ((await request.json()) as EnquiryPayload)
      : (Object.fromEntries((await request.formData()).entries()) as unknown as EnquiryPayload);
  } catch {
    return Response.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const result = await handle(body, request, isJson);

  if (!isJson) {
    const target = `${basePath}${result.ok ? "/enquiry-received/" : "/enquiry-not-sent/"}`;
    return Response.redirect(new URL(target, request.url), 303);
  }

  const { status, ...rest } = result.ok ? { status: 200, ...result } : result;
  return Response.json(rest, { status, headers: { "Cache-Control": "no-store" } });
}
