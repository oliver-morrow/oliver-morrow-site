"use client";

import { education, volunteer } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import SectionReveal from "./SectionReveal";
import SectionHeader from "./SectionHeader";
import ExpandableCard from "./ExpandableCard";

export default function BackgroundSection() {
  return (
    <SectionReveal>
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeader title="Background" />

        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div id="education">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-text-muted">
              Education
            </p>
            <div className="mt-4 space-y-4">
              {education.map((edu) => (
                <div
                  key={edu.school}
                  className={cn(
                    "card-noise rounded-lg border border-border bg-card p-5",
                    "transition-colors duration-200 hover:border-border-hover",
                  )}
                >
                  <div className="relative z-10">
                    <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
                      {edu.year}
                    </span>

                    <p className="mt-2 text-lg font-bold text-text-primary">
                      {edu.degree}
                      <span className="font-mono text-sm font-normal text-text-muted">
                        {" "}@ {edu.school}
                      </span>
                    </p>

                    <p className="mt-3 font-mono text-xs uppercase tracking-widest text-text-muted leading-relaxed">
                      {edu.courses.join(" / ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="volunteer">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-text-muted">
              Leadership & Volunteer
            </p>
            <div className="mt-4 space-y-4">
              {volunteer.map((vol) => (
                <ExpandableCard
                  key={vol.id}
                  id={`vol-${vol.id}`}
                  className={cn(
                    "card-noise rounded-lg border border-border bg-card p-5",
                    "transition-colors duration-200 hover:border-border-hover",
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

                      <p className="mt-2 text-sm leading-relaxed text-text-body max-w-2xl">
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

                      <p className="mt-3 text-sm leading-relaxed text-text-body">
                        {vol.description}
                      </p>

                      {vol.detailedDescription && (
                        <ul className="mt-4 space-y-2">
                          {vol.detailedDescription.map((point, i) => (
                            <li
                              key={i}
                              className="flex gap-2 text-sm leading-relaxed text-text-body"
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
          </div>
        </div>
      </section>
    </SectionReveal>
  );
}
