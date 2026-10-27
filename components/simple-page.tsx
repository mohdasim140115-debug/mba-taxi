import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/lib/site-config";

/** Minimal shell for secondary pages (privacy, no-JS form results). */
export function SimplePage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-paper">
      <header className="border-b border-line">
        <div className="container-x flex h-16 items-center">
          <Link href="/" aria-label={`${site.name} home`}>
            <Image src={site.logo.src} alt={site.logo.alt} width={site.logo.width} height={site.logo.height} className="h-10 w-auto" sizes="70px" loading="eager" />
          </Link>
        </div>
      </header>
      <main className="container-x max-w-3xl py-16 sm:py-20">
        <h1 className="display text-4xl text-ink sm:text-5xl">{title}</h1>
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted [&_a]:font-semibold [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink">
          {children}
        </div>
      </main>
    </div>
  );
}
