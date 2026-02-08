"use client";

import { volunteer } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import SectionReveal from "./SectionReveal";
import SectionHeader from "./SectionHeader";
import ExpandableCard from "./ExpandableCard";

export default function VolunteerSection() {
  return (
    <SectionReveal>
      <section id="volunteer" className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <SectionHeader title="Volunteer" />

        <div className="space-y-4">
          {volunteer.map((vol) => (
            <ExpandableCard
              key={vol.id}
              id={`vol-${vol.id}`}
              className={cn(
                "relative card-noise rounded-lg p-5",
                "glass glass-specular",
                "transition-colors duration-200",
              )}
              collapsedContent={
                <div className="relative z-10">
                  <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
                    {vol.period.start} &ndash; {vol.period.end}
                  </span>

                  <p className="mt-2 text-lg font-bold text-text-primary">
                    {vol.role}
                    <span className="font-mono text-sm font-normal text-text-muted">
                      {" "}@ {vol.company}
                    </span>
                  </p>

                  <p className="mt-2 text-sm text-text-body leading-relaxed max-w-2xl">
                    {vol.description}
                  </p>

                  <p className="mt-3 font-mono text-xs uppercase tracking-widest text-text-muted">
                    {vol.technologies.join(" / ")}
                  </p>
                </div>
              }
              expandedContent={
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
                    {vol.period.start} &ndash; {vol.period.end}
                  </span>

                  <p className="mt-2 text-lg font-bold text-text-primary">
                    {vol.role}
                    <span className="font-mono text-sm font-normal text-text-muted">
                      {" "}@ {vol.company}
                    </span>
                  </p>

                  <p className="mt-3 text-sm text-text-body leading-relaxed">
                    {vol.description}
                  </p>

                  {vol.detailedDescription && (
                    <ul className="mt-4 space-y-2">
                      {vol.detailedDescription.map((point, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-sm text-text-body leading-relaxed"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}

                  <p className="mt-4 font-mono text-xs uppercase tracking-widest text-text-muted">
                    {vol.technologies.join(" / ")}
                  </p>
                </div>
              }
            />
          ))}
        </div>
      </section>
    </SectionReveal>
  );
}
