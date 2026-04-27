import type { Metadata } from "next";
import CoreStackBand from "@/components/CoreStackBand";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import ProjectGrid from "@/components/ProjectGrid";
import ExperienceSection from "@/components/ExperienceSection";
import TechStack from "@/components/TechStack";
import BackgroundSection from "@/components/BackgroundSection";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Portfolio, case studies, projects, and experience across data systems, internal AI tooling, and infrastructure work.",
};

export default function WorkPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="max-w-4xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-text-muted">Work</p>
          <h1 className="mt-3 text-5xl font-black tracking-tighter text-text-primary uppercase sm:text-6xl">
            Portfolio
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-text-body sm:text-lg">
            Case studies, projects, experience, and the tools behind the work.
          </p>
        </div>
      </section>

      <CoreStackBand />
      <CaseStudiesSection />
      <ProjectGrid />
      <ExperienceSection />
      <TechStack />
      <BackgroundSection />
    </>
  );
}
