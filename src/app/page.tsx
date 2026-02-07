import HeroSection from "@/components/HeroSection";
import TechStack from "@/components/TechStack";
import ExperienceSection from "@/components/ExperienceSection";
import EducationSection from "@/components/EducationSection";
import ProjectGrid from "@/components/ProjectGrid";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TechStack />
      <ExperienceSection />
      <EducationSection />
      <ProjectGrid />
      <ContactSection />
    </>
  );
}
