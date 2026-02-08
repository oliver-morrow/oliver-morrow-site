"use client";

import { education } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import SectionReveal from "./SectionReveal";
import SectionHeader from "./SectionHeader";

export default function EducationSection() {
  return (
    <SectionReveal>
      <section id="education" className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <SectionHeader title="Education" />

        <div className="space-y-4">
          {education.map((edu) => (
            <div
              key={edu.school}
              className={cn(
                "relative card-noise rounded-lg p-5",
                "glass glass-specular",
                "transition-colors duration-200",
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
