"use client";

import { asset } from "@/lib/base-path";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, CarFront, CheckCircle2, Lock, LoaderCircle, Mail, MessageCircle, Phone, UserRound, UsersRound } from "lucide-react";
import { site, telLink, whatsappLink } from "@/lib/site-config";
import { enquirySummary, validateEnquiry, type EnquiryInput, type FieldErrors } from "@/lib/validation";
import { readAttribution, track } from "@/lib/analytics";

export const PREFILL_EVENT = "mba:prefill";
export type PrefillDetail = Partial<Pick<EnquiryInput, "service" | "pickup" | "drop" | "vehicle">>;

type Status = "idle" | "submitting" | "success" | "error";

const empty: EnquiryInput = { name: "", email: "", phone: "", passengers: "", service: "", pickup: "", drop: "", date: "", time: "", vehicle: "" };

/** The visible fields, in focus order for validation errors. */
const fieldOrder: (keyof EnquiryInput)[] = ["name", "email", "phone", "passengers"];

/**
 * Short enquiry form: name, email, phone and passengers only (owner's request).
 * Route / service / airport buttons elsewhere on the page still pass their trip
 * context (service, pickup, drop) along with the enquiry, without extra fields.
 */
export function BookingForm({ location, listenForPrefill = false }: { location: string; listenForPrefill?: boolean }) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useRef(0);
  const begun = useRef(false);

  const [values, setValues] = useState<EnquiryInput>(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (!listenForPrefill) return;
    const onPrefill = (e: Event) => {
      const detail = (e as CustomEvent<PrefillDetail>).detail ?? {};
      setStatus((s) => (s === "success" ? "idle" : s));
      setValues((v) => ({ ...v, service: "", pickup: "", drop: "", vehicle: "", ...detail }));
      setErrors({});
      requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLInputElement>("input[name=name]")?.focus({ preventScroll: true });
      });
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, [listenForPrefill]);

  const update = (name: keyof EnquiryInput, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const onFirstInteraction = () => {
    if (begun.current) return;
    begun.current = true;
    track("begin_enquiry", { location });
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const found = validateEnquiry(values);
    setErrors(found);
    const firstInvalid = fieldOrder.find((f) => found[f]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name=${firstInvalid}]`)?.focus();
      return;
    }

    setStatus("submitting");
    setErrorMessage("");
    const hp_field = (formRef.current?.elements.namedItem("hp_field") as HTMLInputElement | null)?.value ?? "";

    try {
      const res = await fetch(asset("/api/enquiry/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, hp_field, startedAt: startedAt.current, attribution: readAttribution() }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; leadId?: string; errors?: FieldErrors; message?: string };

      if (res.ok && data.ok && data.leadId) {
        setStatus("success");
        track("generate_lead", { lead_id: data.leadId, service_type: values.service || "unspecified", location });
        return;
      }
      if (res.status === 422 && data.errors) {
        setErrors(data.errors);
        setStatus("idle");
        return;
      }
      setErrorMessage(data.message ?? "We couldn’t send your enquiry just now.");
      setStatus("error");
    } catch {
      setErrorMessage("We couldn’t reach our server. Please check your connection.");
      setStatus("error");
    }
  }

  const waHandOff = whatsappLink(`Hi MBA Travels Goa, I'd like a taxi fare quote.\n\n${enquirySummary(values)}`);

  if (status === "success") {
    return (
      <div role="status" aria-live="polite" className="py-2 text-ink">
        <CheckCircle2 aria-hidden className="size-10 text-[#0e7c42]" strokeWidth={1.8} />
        <h3 className="display mt-3 text-2xl">Thank you, {values.name.split(" ")[0]}! We’ve received your enquiry.</h3>
        <p className="mt-2 text-muted">
          Our team will contact you on <strong className="text-ink">{values.phone}</strong> to confirm availability and your fare.
          For a faster reply, you can also message us on WhatsApp.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <a href={waHandOff} target="_blank" rel="noopener" className="btn btn-whatsapp" data-label="after-submit">
            <MessageCircle aria-hidden className="size-4" /> Continue on WhatsApp
          </a>
          <a href={telLink} className="btn btn-ghost" data-label="after-submit">
            <Phone aria-hidden className="size-4" /> {site.phone.display}
          </a>
        </div>
      </div>
    );
  }

  const inputProps = (name: keyof EnquiryInput) => ({
    id: id(name),
    name,
    value: values[name],
    onChange: (e: { target: { value: string } }) => update(name, e.target.value),
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? id(`${name}-error`) : undefined,
  });

  const field = (name: keyof EnquiryInput, label: ReactNode, icon: typeof Mail, control: ReactNode) => {
    const Icon = icon;
    return (
      <div className="min-w-0">
        <label htmlFor={id(name)} className="field-label">
          {label}
        </label>
        <div className="relative">
          <Icon aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-muted" strokeWidth={1.8} />
          {control}
        </div>
        {errors[name] && (
          <p id={id(`${name}-error`)} className="field-error">
            {errors[name]}
          </p>
        )}
      </div>
    );
  };

  return (
    <form
      ref={formRef}
      method="post"
      action={asset("/api/enquiry/")}
      noValidate
      onSubmit={onSubmit}
      onFocusCapture={onFirstInteraction}
      className="relative grid grid-cols-2 gap-x-3 gap-y-4"
      aria-label="Taxi fare enquiry"
      data-location={location}
    >
      {field(
        "name",
        "Your name",
        UserRound,
        <input {...inputProps("name")} className="field pl-10" autoComplete="name" required maxLength={80} />,
      )}
      {field(
        "email",
        "Email",
        Mail,
        <input {...inputProps("email")} className="field pl-10" type="email" inputMode="email" autoComplete="email" maxLength={120} />,
      )}
      {field(
        "phone",
        "Phone number",
        Phone,
        <input {...inputProps("phone")} className="field pl-10" type="tel" inputMode="tel" autoComplete="tel" required maxLength={20} />,
      )}
      {field(
        "passengers",
        "No. of passengers",
        UsersRound,
        <select {...inputProps("passengers")} className="field pl-10">
          <option value="">Select</option>
          {["1", "2", "3", "4", "5", "6", "7"].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
          <option value="8+">8 or more</option>
        </select>,
      )}

      {/* Trip context from route / service buttons travels with the enquiry (also without JavaScript). */}
      {(["service", "pickup", "drop", "vehicle"] as const).map((k) => (values[k] ? <input key={k} type="hidden" name={k} value={values[k]} /> : null))}

      {/* Honeypot: hidden from people and assistive tech, often filled by bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("hp_field")}>Leave this field empty</label>
        <input id={id("hp_field")} name="hp_field" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="col-span-2 pt-1">
        <button type="submit" className="btn btn-primary h-14 w-full text-[1.05rem]" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <LoaderCircle aria-hidden className="size-5 animate-spin" /> Sending…
            </>
          ) : (
            <>
              <CarFront aria-hidden className="size-5" /> Get My Fare Quote <ArrowRight aria-hidden className="size-5" />
            </>
          )}
        </button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-muted">
          <Lock aria-hidden className="size-3.5" /> No payment needed to enquire
        </p>
      </div>

      {status === "error" && (
        <div role="alert" className="col-span-2 rounded-xl border border-[#f4c7c3] bg-[#fdf3f2] p-4 text-sm text-ink">
          <p className="font-semibold">{errorMessage}</p>
          <p className="mt-1 text-muted">Your details are still here. You can send them to us on WhatsApp or call instead.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href={waHandOff} target="_blank" rel="noopener" className="btn btn-whatsapp h-10 min-h-0 px-4 text-sm" data-label="form-fallback">
              <MessageCircle aria-hidden className="size-4" /> Send on WhatsApp
            </a>
            <a href={telLink} className="btn btn-ghost h-10 min-h-0 px-4 text-sm" data-label="form-fallback">
              <Phone aria-hidden className="size-4" /> Call us
            </a>
          </div>
        </div>
      )}
    </form>
  );
}
