export interface SiteConfig {
  profile: {
    name: string;
    title: string;
    bio: string;
    socials: {
      github: string;
      linkedin: string;
      email: string;
    };
  };
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: { start: string; end: string };
  description: string;
  technologies: string[];
  type: "work" | "volunteer";
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  technologies: string[];
  links: {
    demo?: string;
  };
  featured: boolean;
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
