"use client";

import { experience } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import SectionReveal from "./SectionReveal";
import SectionHeader from "./SectionHeader";
import ExpandableCard from "./ExpandableCard";

export default function ExperienceSection() {
  return (
    <SectionReveal>
      <section id="experience" className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <SectionHeader title="Experience" />

        <div className="space-y-4">
          {experience.map((exp) => (
            <ExpandableCard
              key={exp.id}
              id={`exp-${exp.id}`}
              className={cn(
                "relative card-noise rounded-lg p-5",
                "bg-card border border-border",
                "transition-colors duration-200",
                "hover:border-border-hover",
              )}
              collapsedContent={
                <div className="relative z-10">
                  <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
                    {exp.period.start} &ndash; {exp.period.end}
                  </span>

                  <p className="mt-2 text-lg font-bold text-text-primary">
                    {exp.role}
                    <span className="font-mono text-sm font-normal text-text-muted">
                      {" "}@ {exp.company}
                    </span>
                  </p>

                  <p className="mt-2 text-sm text-text-body leading-relaxed max-w-2xl">
                    {exp.description}
                  </p>

                  <p className="mt-3 font-mono text-xs uppercase tracking-widest text-text-muted">
                    {exp.technologies.join(" / ")}
                  </p>
                </div>
              }
              expandedContent={
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
                    {exp.period.start} &ndash; {exp.period.end}
                  </span>

                  <p className="mt-2 text-lg font-bold text-text-primary">
                    {exp.role}
                    <span className="font-mono text-sm font-normal text-text-muted">
                      {" "}@ {exp.company}
                    </span>
                  </p>

                  <p className="mt-3 text-sm text-text-body leading-relaxed">
                    {exp.description}
                  </p>

                  {exp.detailedDescription && (
                    <ul className="mt-4 space-y-2">
                      {exp.detailedDescription.map((point, i) => (
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
                    {exp.technologies.join(" / ")}
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
