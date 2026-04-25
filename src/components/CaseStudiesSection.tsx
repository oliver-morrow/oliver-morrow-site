import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { caseStudies } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import SectionReveal from "./SectionReveal";
import SectionHeader from "./SectionHeader";

const featuredCaseStudies = caseStudies.filter((study) => study.featured).slice(0, 3);

export default function CaseStudiesSection() {
  return (
    <SectionReveal>
      <section id="case-studies" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-3xl">
          <SectionHeader title="Case Studies" />
          <p className="-mt-4 text-sm leading-relaxed text-text-body sm:text-base">
            Selected production systems, internal tooling, and platform work from Sanofi&apos;s AI
            CoE. This is the clearest view of what I actually built and owned.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {featuredCaseStudies.map((study) => (
            <Link
              key={study.id}
              href={`/case-studies#${study.id}`}
              className="group block"
            >
              <article
                className={cn(
                  "card-noise rounded-lg border border-border bg-card p-5",
                  "transition-colors duration-200 group-hover:border-border-hover",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
                      {study.organization}{" // "}{study.period.start} - {study.period.end}
                    </p>
                    <h3 className="mt-2 text-xl font-black tracking-tight text-text-primary">
                      {study.title}
                    </h3>
                  </div>
                  <span className="rounded-full border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                    {study.tags[0]}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-text-body">
                  {study.summary}
                </p>

                <div className="mt-5 space-y-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                      What I Owned
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-text-primary">
                      {study.ownership[0]}
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                      Why It Mattered
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-text-primary">
                      {study.impact[0]}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="font-mono text-xs uppercase tracking-widest text-text-muted leading-relaxed">
                    {study.tech.join(" / ")}
                  </p>
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-text-muted transition-colors duration-200 group-hover:text-accent">
                    Read Study
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </SectionReveal>
  );
}
