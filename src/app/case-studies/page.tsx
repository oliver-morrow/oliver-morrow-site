import type { Metadata } from "next";
import { caseStudies } from "@/data/portfolio";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Selected production work across agents, internal platforms, MCP tooling, and automation delivered at Sanofi.",
};

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-4xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-text-muted">
            Selected Work
          </p>
          <h1 className="mt-3 text-5xl font-black tracking-tighter text-text-primary sm:text-6xl">
            Case Studies
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-text-body sm:text-lg">
            Production work I&apos;ve owned at Sanofi&apos;s AI CoE, spanning agents, internal
            tooling, and platform delivery. The common thread is moving quickly in small pods
            while building for real users inside enterprise constraints.
          </p>
        </div>

        <div className="mt-12 space-y-6">
          {caseStudies.map((study) => (
            <article
              key={study.id}
              id={study.id}
              className={cn(
                "card-noise scroll-mt-20 rounded-lg border border-border bg-card p-6 sm:p-8",
                "transition-colors duration-200 hover:border-border-hover",
              )}
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
                    {study.organization}{" // "}{study.period.start} - {study.period.end}
                  </p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight text-text-primary sm:text-4xl">
                    {study.title}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-text-body">
                    {study.summary}
                  </p>
                </div>

                <div className="lg:max-w-xs">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                    Tech
                  </p>
                  <p className="mt-2 font-mono text-xs uppercase leading-relaxed tracking-widest text-text-primary">
                    {study.tech.join(" / ")}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {study.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_1fr_1fr]">
                <section className="rounded-lg border border-border bg-black/30 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                    The Problem
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-text-body">
                    {study.problem}
                  </p>
                </section>

                <section className="rounded-lg border border-border bg-black/30 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                    What I Owned
                  </p>
                  <ul className="mt-3 space-y-2">
                    {study.ownership.map((item) => (
                      <li key={item} className="flex gap-2 text-sm leading-relaxed text-text-body">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-lg border border-border bg-black/30 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                    What I Built
                  </p>
                  <ul className="mt-3 space-y-2">
                    {study.approach.map((item) => (
                      <li key={item} className="flex gap-2 text-sm leading-relaxed text-text-body">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
                <section className="rounded-lg border border-border bg-black/30 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                    Why It Mattered
                  </p>
                  <ul className="mt-3 space-y-2">
                    {study.impact.map((item) => (
                      <li key={item} className="flex gap-2 text-sm leading-relaxed text-text-body">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                {study.confidentialityNote && (
                  <section className="rounded-lg border border-border bg-black/30 p-4">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                      Confidentiality
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-text-body">
                      {study.confidentialityNote}
                    </p>
                  </section>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
