"use client";

import { siteConfig } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import SectionHeader from "./SectionHeader";
import SectionReveal from "./SectionReveal";

const { frontDoor } = siteConfig;

export default function CurrentFocusSection() {
  return (
    <SectionReveal>
      <section id="now" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeader title="Now" />

        <div className="max-w-3xl">
          <p className="-mt-4 text-base leading-relaxed text-text-body sm:text-lg">
            A few things I spend a lot of time on.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {frontDoor.currentFocus.map((focus) => (
            <article
              key={focus.title}
              className={cn(
                "card-noise rounded-lg border border-border bg-card p-5",
                "transition-colors duration-200 hover:border-border-hover",
              )}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
                {focus.label}
              </p>
              <h3 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
                {focus.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-body">
                {focus.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </SectionReveal>
  );
}
