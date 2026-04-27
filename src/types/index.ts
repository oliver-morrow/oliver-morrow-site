export interface SiteConfig {
  profile: {
    name: string;
    title: string;
    bio: string;
    location: string;
    status: string;
    coreStack: string[];
    socials: {
      github: string;
      linkedin: string;
      email: string;
      blog: string;
    };
  };
  frontDoor: {
    intro: string;
    signalLinks: SignalLink[];
    currentFocus: FocusArea[];
    principles: string[];
  };
}

export interface SignalLink {
  label: string;
  title: string;
  description: string;
  href: string;
  external?: boolean;
}

export interface FocusArea {
  label: string;
  title: string;
  description: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: { start: string; end: string };
  description: string;
  detailedDescription?: string[];
  technologies: string[];
  type: "work" | "volunteer";
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  detailedDescription?: string[];
  technologies: string[];
  links: {
    demo?: string;
  };
  featured: boolean;
}

export interface CaseStudy {
  id: string;
  title: string;
  organization: string;
  period: { start: string; end: string };
  summary: string;
  problem: string;
  ownership: string[];
  approach: string[];
  impact: string[];
  tech: string[];
  tags: string[];
  featured: boolean;
  confidentialityNote?: string;
}

export interface Education {
  school: string;
  degree: string;
  year: string;
  courses: string[];
}

export interface Skill {
  name: string;
  level: "kernel" | "driver" | "userland";
  usedAt: string[];
}

export interface SkillCategory {
  label: string;
  skills: Skill[];
}
