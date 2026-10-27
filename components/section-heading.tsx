import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
  tone = "light",
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  id?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={`max-w-2xl ${className}`}>
      <p className={`eyebrow ${dark ? "text-marigold" : ""}`}>{eyebrow}</p>
      <h2 id={id} className={`display mt-4 text-[2.1rem] leading-[1.08] sm:text-5xl ${dark ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
      {intro && <p className={`mt-5 text-lg leading-relaxed ${dark ? "text-ivory/80" : "text-muted"}`}>{intro}</p>}
    </div>
  );
}
