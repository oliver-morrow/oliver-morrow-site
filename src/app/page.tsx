import HeroSection from "@/components/HeroSection";
import CoreStackBand from "@/components/CoreStackBand";
import TechStack from "@/components/TechStack";
import ExperienceSection from "@/components/ExperienceSection";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import BackgroundSection from "@/components/BackgroundSection";
import ProjectGrid from "@/components/ProjectGrid";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CoreStackBand />
      <CaseStudiesSection />
      <ProjectGrid />
      <ExperienceSection />
      <TechStack />
      <BackgroundSection />
      <ContactSection />
    </>
  );
}
