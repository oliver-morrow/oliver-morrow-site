export type SiteLink = {
  label: string;
  href: `https://${string}` | `mailto:${string}`;
};

export type WorkItem = {
  context: string;
  title: string;
  description: string;
  href?: `https://${string}`;
};

export type PreviousItem = {
  period: string;
  organization: string;
  role: string;
};

export const site = {
  name: "Oliver Morrow",
  introduction:
    "I'm a computer engineering student at Queen's University, currently working on data and AI systems at Sanofi.",
  location: "Toronto / Kingston, Canada",
  links: [
    { label: "Writing", href: "https://blog.olivermorrow.com" },
    { label: "GitHub", href: "https://github.com/oliver-morrow" },
    { label: "LinkedIn", href: "https://linkedin.com/in/oliver-morrow" },
    { label: "Email", href: "mailto:me@olivermorrow.ca" },
  ],
  selectedWork: [
    {
      context: "Sanofi · 2025—",
      title: "Data and AI systems",
      description:
        "I work on semantic models and agent workflows that make governed internal data easier to use. Much of the work is in the reliability, business logic, and data access behind the interface.",
    },
    {
      context: "Personal project",
      title: "Noteworthy",
      description:
        "A collaborative note-taking platform built across C++, Qt, WebAssembly, Docker, and Nginx.",
      href: "https://www.noteworthy.howdoesthiseven.work",
    },
    {
      context: "Homelab",
      title: "Proxmox HA Cluster",
      description:
        "A three-node cluster for home automation, DNS, and virtual machines, built to explore practical service placement and redundancy.",
      href: "https://blog.olivermorrow.com/posts/home-server",
    },
  ],
  previously: [
    {
      period: "2025",
      organization: "Tilray Brands",
      role: "Data & Analytics Intern",
    },
    {
      period: "2024—2025",
      organization: "Smith Engineering",
      role: "Electronics I Course Developer",
    },
    {
      period: "2024",
      organization: "Queen's University ITS",
      role: "Digital Classrooms Intern",
    },
    {
      period: "2023",
      organization: "Legal Aid Ontario",
      role: "Information Technology Analyst Intern",
    },
    {
      period: "Expected 2026",
      organization: "Queen's University",
      role: "B.A.Sc. Computer Engineering",
    },
  ],
} satisfies {
  name: string;
  introduction: string;
  location: string;
  links: SiteLink[];
  selectedWork: WorkItem[];
  previously: PreviousItem[];
};
