"use client";

import { education } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import SectionReveal from "./SectionReveal";

export default function EducationSection() {
  return (
    <SectionReveal>
      <section id="education" className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <div className="mb-12">
          <h2 className="text-5xl sm:text-6xl font-black tracking-tighter text-text-primary uppercase">
            Education
          </h2>
          <div className="mt-4 h-px w-16 bg-border" />
        </div>

        <div className="space-y-4">
          {education.map((edu) => (
            <div
              key={edu.school}
              className={cn(
                "relative card-noise rounded-lg p-5",
                "bg-card border border-border",
                "transition-colors duration-200",
                "hover:border-border-hover",
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

                <p className="mt-3 font-mono text-xs uppercase tracking-widest text-text-muted">
                  {edu.courses.join(" / ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SectionReveal>
  );
}
