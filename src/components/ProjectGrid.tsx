"use client";

import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import SectionReveal from "./SectionReveal";
import SectionHeader from "./SectionHeader";
import ExpandableCard from "./ExpandableCard";

export default function ProjectGrid() {
  return (
    <SectionReveal>
      <section id="projects" className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <SectionHeader title="Projects" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ExpandableCard
              key={project.id}
              id={`proj-${project.id}`}
              className={cn(
                "group relative card-noise rounded-lg",
                "flex flex-col bg-card",
                "border border-border",
                "transition-colors duration-200",
                "hover:border-border-hover",
                project.featured && "md:col-span-2",
              )}
              collapsedContent={
                <div className="relative z-10 flex flex-col h-full p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">
                        {project.title}
                      </h3>
                      <p className="mt-0.5 font-mono text-xs uppercase tracking-widest text-text-muted">
                        {project.tagline}
                      </p>
                    </div>

                    {project.links.demo && (
                      <a
                        href={project.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${project.title}`}
                        className={cn(
                          "shrink-0 p-1 text-text-muted",
                          "transition-colors duration-200",
                          "group-hover:text-accent",
                        )}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    )}
                  </div>

                  <p className="mt-3 text-sm text-text-body leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  <div className="mt-auto pt-4">
                    <p className="font-mono text-xs uppercase tracking-widest text-text-muted leading-relaxed">
                      {project.technologies.join(" / ")}
                    </p>
                  </div>
                </div>
              }
              expandedContent={
                <div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">
                      {project.title}
                    </h3>
                    <p className="mt-0.5 font-mono text-xs uppercase tracking-widest text-text-muted">
                      {project.tagline}
                    </p>
                  </div>

                  {project.links.demo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${project.title}`}
                      className={cn(
                        "mt-3 inline-flex items-center gap-1.5 rounded border border-border px-2.5 py-1.5",
                        "font-mono text-[10px] uppercase tracking-widest text-text-muted",
                        "transition-colors duration-200 hover:border-border-hover hover:text-accent",
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Open Project
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}

                  <p className="mt-3 text-sm text-text-body leading-relaxed">
                    {project.description}
                  </p>

                  {project.detailedDescription && (
                    <ul className="mt-4 space-y-2">
                      {project.detailedDescription.map((point, i) => (
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
                    {project.technologies.join(" / ")}
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
