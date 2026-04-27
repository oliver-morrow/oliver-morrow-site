"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { siteConfig } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import SectionReveal from "./SectionReveal";

const { frontDoor } = siteConfig;

export default function FrontDoorSection() {
  return (
    <SectionReveal>
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-text-muted">Links</p>
          <h2 className="mt-4 text-4xl font-black tracking-tighter text-text-primary uppercase sm:text-5xl">
            Work, about, and writing.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-text-body sm:text-lg">
            {frontDoor.intro}
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {frontDoor.signalLinks.map((link) => {
            const content = (
              <article
                className={cn(
                  "card-noise h-full rounded-lg border border-border bg-card p-5",
                  "transition-colors duration-200 hover:border-border-hover",
                )}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
                  {link.label}
                </p>
                <h3 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
                  {link.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-body">
                  {link.description}
                </p>

                <div className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
                  Go
                  {link.external ? (
                    <ExternalLink className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowRight className="h-3.5 w-3.5" />
                  )}
                </div>
              </article>
            );

            if (link.external) {
              return (
                <a
                  key={link.title}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  {content}
                </a>
              );
            }

            return (
              <Link key={link.title} href={link.href} className="group block">
                {content}
              </Link>
            );
          })}
        </div>
      </section>
    </SectionReveal>
  );
}
