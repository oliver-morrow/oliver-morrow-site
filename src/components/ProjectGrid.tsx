"use client";

import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import SectionReveal from "./SectionReveal";

export default function ProjectGrid() {
  return (
    <SectionReveal>
      <section id="projects" className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <div className="mb-12">
          <h2 className="text-5xl sm:text-6xl font-black tracking-tighter text-text-primary uppercase">
            Projects
          </h2>
          <div className="mt-4 h-px w-16 bg-border" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className={cn(
                "group relative card-noise rounded-lg",
                "flex flex-col bg-card",
                "border border-border",
                "transition-colors duration-200",
                "hover:border-border-hover",
                project.featured && "md:col-span-2"
              )}
            >
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
                        "group-hover:text-accent"
                      )}
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
            </div>
          ))}
        </div>
      </section>
    </SectionReveal>
  );
}
