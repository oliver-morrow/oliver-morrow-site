"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { skills } from "@/data/portfolio";
import type { Skill } from "@/types";
import SectionReveal from "./SectionReveal";
import SectionHeader from "./SectionHeader";

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
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Position tooltip imperatively — no re-renders on mousemove
  const moveTooltip = useCallback((e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    const el = tooltipRef.current;
    if (!rect || !el) return;
    el.style.left = `${e.clientX - rect.left + 12}px`;
    el.style.top = `${e.clientY - rect.top - 8}px`;
  }, []);

  const handleMouseEnter = useCallback((e: React.MouseEvent, skill: Skill) => {
    setActiveSkill(skill);
    moveTooltip(e);
  }, [moveTooltip]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    moveTooltip(e);
  }, [moveTooltip]);

  const handleMouseLeave = useCallback(() => {
    setActiveSkill(null);
  }, []);

  // Sync tooltip visibility
  useEffect(() => {
    const el = tooltipRef.current;
    if (!el) return;
    el.style.display = activeSkill ? "block" : "none";
  }, [activeSkill]);

  return (
    <SectionReveal>
      <section
        ref={sectionRef}
        id="skills"
        className="relative mx-auto max-w-6xl px-4 sm:px-6 py-20"
      >
        <SectionHeader title="Technologies" />
        <p className="-mt-4 mb-10 max-w-3xl text-sm leading-relaxed text-text-body sm:text-base">
          The broader toolchain behind the work above, spanning data engineering, infrastructure,
          automation, and systems work.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {skills.map((category) => (
            <div key={category.label}>
              <p className="text-zinc-400 font-mono text-sm uppercase mb-4">
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

        {/* Inspection tooltip — positioned imperatively to avoid re-renders */}
        <div
          ref={tooltipRef}
          className="pointer-events-none absolute z-50 bg-black border border-cyan-500/50 rounded px-3 py-2 shadow-2xl shadow-cyan-900/20"
          style={{ display: "none" }}
        >
          {activeSkill && (
            <>
              <p className="text-[10px] font-mono text-cyan-500">
                {levelLabel[activeSkill.level]} {levelBar[activeSkill.level]}
              </p>
              {activeSkill.usedAt.length > 0 && (
                <p className="text-[10px] font-mono text-zinc-400 mt-1">
                  Used at: {activeSkill.usedAt.join(", ")}
                </p>
              )}
            </>
          )}
        </div>
      </section>
    </SectionReveal>
  );
}
