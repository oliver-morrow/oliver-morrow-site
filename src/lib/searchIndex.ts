import {
  experience,
  volunteer,
  projects,
  education,
  skills,
} from "@/data/portfolio";

export type SearchCategory =
  | "experience"
  | "volunteer"
  | "project"
  | "education"
  | "skill"
  | "navigation";

export interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: SearchCategory;
  href: string;
  keywords: string;
}

function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  for (const exp of experience) {
    items.push({
      id: `exp-${exp.id}`,
      title: exp.role,
      subtitle: exp.company,
      category: "experience",
      href: "#experience",
      keywords: [
        exp.role,
        exp.company,
        exp.description,
        ...exp.technologies,
        ...(exp.detailedDescription ?? []),
      ]
        .join(" ")
        .toLowerCase(),
    });
  }

  for (const vol of volunteer) {
    items.push({
      id: `vol-${vol.id}`,
      title: vol.role,
      subtitle: vol.company,
      category: "volunteer",
      href: "#volunteer",
      keywords: [
        vol.role,
        vol.company,
        vol.description,
        ...vol.technologies,
        ...(vol.detailedDescription ?? []),
      ]
        .join(" ")
        .toLowerCase(),
    });
  }

  for (const proj of projects) {
    items.push({
      id: `proj-${proj.id}`,
      title: proj.title,
      subtitle: proj.tagline,
      category: "project",
      href: "#projects",
      keywords: [
        proj.title,
        proj.tagline,
        proj.description,
        ...proj.technologies,
        ...(proj.detailedDescription ?? []),
      ]
        .join(" ")
        .toLowerCase(),
    });
  }

  for (const edu of education) {
    items.push({
      id: `edu-${edu.school}`,
      title: edu.degree,
      subtitle: edu.school,
      category: "education",
      href: "#education",
      keywords: [edu.degree, edu.school, edu.year, ...edu.courses]
        .join(" ")
        .toLowerCase(),
    });
  }

  for (const cat of skills) {
    for (const skill of cat.skills) {
      items.push({
        id: `skill-${skill.name}`,
        title: skill.name,
        subtitle: cat.label,
        category: "skill",
        href: "#skills",
        keywords: [skill.name, cat.label, ...skill.usedAt]
          .join(" ")
          .toLowerCase(),
      });
    }
  }

  const navSections = [
    { title: "Experience", href: "#experience" },
    { title: "Education", href: "#education" },
    { title: "Volunteer", href: "#volunteer" },
    { title: "Projects", href: "#projects" },
    { title: "Contact", href: "#contact" },
    { title: "Technologies", href: "#skills" },
  ];
  for (const nav of navSections) {
    items.push({
      id: `nav-${nav.title}`,
      title: nav.title,
      subtitle: "Go to section",
      category: "navigation",
      href: nav.href,
      keywords: nav.title.toLowerCase(),
    });
  }

  return items;
}

export const searchIndex = buildSearchIndex();

export function search(query: string): SearchItem[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  return searchIndex.filter((item) => item.keywords.includes(q));
}
