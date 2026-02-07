"use client";

import { useState, useRef, useCallback } from "react";
import { skills } from "@/data/portfolio";
import type { Skill } from "@/types";
import SectionReveal from "./SectionReveal";

const levelLabel: Record<Skill["level"], string> = {
  kernel: "Advanced",
  driver: "Proficient",
  userland: "Familiar",
};

const levelBar: Record<Skill["level"], string> = {
  kernel: "[||||||||..]",
  driver: "[||||||....]",
  userland: "[||||......]",
};

export default function TechStack() {
  const [tooltip, setTooltip] = useState<{ skill: Skill; x: number; y: number } | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const handleMouseEnter = useCallback((e: React.MouseEvent, skill: Skill) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({
      skill,
      x: e.clientX - rect.left + 12,
      y: e.clientY - rect.top - 8,
    });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!tooltip) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip((prev) =>
      prev ? { ...prev, x: e.clientX - rect.left + 12, y: e.clientY - rect.top - 8 } : null
    );
  }, [tooltip]);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  return (
    <SectionReveal>
      <section
        ref={sectionRef}
        id="skills"
        className="relative mx-auto max-w-6xl px-4 sm:px-6 py-20"
      >
        <div className="mb-12">
          <h2 className="text-5xl sm:text-6xl font-black tracking-tighter text-text-primary uppercase">
            Technologies
          </h2>
          <div className="mt-4 h-px w-16 bg-border" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {skills.map((category) => (
            <div key={category.label}>
              <p className="text-zinc-500 font-mono text-sm uppercase mb-4">
                {category.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill.name}
                    className="text-zinc-300 text-sm font-mono px-3 py-1 rounded-full border border-zinc-800 hover:border-cyan-500 hover:text-cyan-500 cursor-help transition-all duration-200"
                    onMouseEnter={(e) => handleMouseEnter(e, skill)}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Inspection tooltip */}
        {tooltip && (
          <div
            className="pointer-events-none absolute z-50 bg-black border border-cyan-500/50 rounded px-3 py-2 shadow-2xl shadow-cyan-900/20"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            <p className="text-[10px] font-mono text-cyan-500">
              {levelLabel[tooltip.skill.level]} {levelBar[tooltip.skill.level]}
            </p>
            {tooltip.skill.usedAt.length > 0 && (
              <p className="text-[10px] font-mono text-zinc-500 mt-1">
                Used at: {tooltip.skill.usedAt.join(", ")}
              </p>
            )}
          </div>
        )}
      </section>
    </SectionReveal>
  );
}
