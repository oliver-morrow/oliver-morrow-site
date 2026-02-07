import type { Experience, Project, SiteConfig, Education, SkillCategory } from "../types";

export const siteConfig: SiteConfig = {
  profile: {
    name: "Oliver Morrow",
    title: "Computer & Data Engineering",
    bio: "Bridging hardware constraints with data scale. Specializing in Embedded Systems, Snowflake Architecture, and High-Performance ELT Pipelines.",
    socials: {
      github: "https://github.com/olivermorrow",
      linkedin: "https://linkedin.com/in/oliver-morrow",
      email: "oliver@olivermrw.site",
    },
  },
};

export const education: Education[] = [
  {
    school: "Queen's University",
    degree: "B.A.Sc. in Computer Engineering",
    year: "Expected 2026",
    courses: [
      "Data Structures & Algorithms",
      "Machine Learning",
      "Digital Systems",
      "Microprocessors & Embedded Systems",
      "Computer Architecture",
    ],
  },
];

export const experience: Experience[] = [
  {
    id: "sanofi-2025",
    role: "Data Engineer Co-op",
    company: "Sanofi",
    period: { start: "Sep 2025", end: "Present" },
    description: "Developing Semantic Models using Snowflake Cortex and bridging complex SQL logic with Python orchestration. Managing automated dbt pipelines and exploring Agentic workflows with AWS Bedrock.",
    technologies: ["Snowflake", "dbt", "Python", "Airflow", "Cortex Analyst", "SQL"],
    type: "work",
  },
  {
    id: "tilray-2025",
    role: "Data & Analytics Intern",
    company: "Tilray Brands",
    period: { start: "Jun 2025", end: "Aug 2025" },
    description: "Designed scalable ELT solutions using Python and SQL for large-scale operations datasets. Delivered actionable insights via automated Power BI dashboards.",
    technologies: ["Python", "SQL", "Power BI", "Data Analysis"],
    type: "work",
  },
  {
    id: "smith-2024",
    role: "Electronics I Course Developer",
    company: "Smith Engineering",
    period: { start: "May 2024", end: "Apr 2025" },
    description: "Engineered comprehensive lab content using LTSpice and LaTeX. Debugged circuit designs and supported over 200 electrical engineering students.",
    technologies: ["LTSpice", "LaTeX", "Circuit Design", "Pedagogy"],
    type: "work",
  },
  {
    id: "queens-its-2024",
    role: "Digital Classrooms Intern",
    company: "Queen's University ITS",
    period: { start: "May 2024", end: "Aug 2024" },
    description: "Optimized technological infrastructure through strategic hardware upgrades and process automation.",
    technologies: ["Hardware", "IT Infrastructure", "Automation"],
    type: "work",
  },
  {
    id: "lao-2023",
    role: "IT Analyst Intern",
    company: "Legal Aid Ontario",
    period: { start: "May 2023", end: "Sep 2023" },
    description: "Managed Azure Cloud and VMware infrastructure. Developed custom inventory management systems to improve organizational efficiency.",
    technologies: ["Azure", "VMware", "Distributed Systems", "IT Operations"],
    type: "work",
  },
];

export const projects: Project[] = [
  {
    id: "noteworthy",
    title: "Noteworthy Platform",
    tagline: "Distributed Collaboration",
    description: "A scalable collaborative note-taking app built with C++, Qt, and WebAssembly. Features real-time data persistence and Docker containerization.",
    technologies: ["C++", "Qt", "WebAssembly", "Docker", "Nginx"],
    links: { demo: "https://www.noteworthy.howdoesthiseven.work" },
    featured: true,
  },
  {
    id: "cyclicus",
    title: "Cyclicus Trading",
    tagline: "ML Signal Generator",
    description: "Trading signal generator integrating BERT-based NLP sentiment analysis and Random Forest models. Visualized via a FastAPI/Vue.js dashboard.",
    technologies: ["Python", "BERT", "Scikit-learn", "FastAPI", "Vue.js"],
    links: {},
    featured: true,
  },
  {
    id: "movement-predictor",
    title: "Movement Predictor",
    tagline: "Sensor Classification",
    description: "Machine learning classification model using linear regression to predict user activity types based on real-time smartphone sensor data.",
    technologies: ["Python", "Linear Regression", "Data Viz"],
    links: {},
    featured: false,
  },
  {
    id: "c-spreadsheet",
    title: "C-Based Spreadsheet",
    tagline: "Low-Level Computation",
    description: "Built a functional spreadsheet engine from scratch in C, implementing custom memory management and mathematical algorithms.",
    technologies: ["C", "Algorithms", "Memory Mgmt"],
    links: {},
    featured: false,
  },
];

export const skills: SkillCategory[] = [
  {
    label: "Languages",
    skills: [
      { name: "Python", level: "kernel", usedAt: ["Sanofi", "Tilray", "Cyclicus"] },
      { name: "C++", level: "kernel", usedAt: ["Noteworthy"] },
      { name: "SQL", level: "kernel", usedAt: ["Sanofi", "Tilray"] },
      { name: "Bash", level: "driver", usedAt: ["Sanofi", "Legal Aid Ontario"] },
    ],
  },
  {
    label: "Data Engineering",
    skills: [
      { name: "Snowflake", level: "kernel", usedAt: ["Sanofi"] },
      { name: "dbt", level: "kernel", usedAt: ["Sanofi"] },
      { name: "Airflow", level: "driver", usedAt: ["Sanofi"] },
      { name: "Pandas", level: "driver", usedAt: ["Tilray", "Cyclicus"] },
    ],
  },
  {
    label: "Infrastructure",
    skills: [
      { name: "Docker", level: "driver", usedAt: ["Noteworthy"] },
      { name: "Kubernetes", level: "userland", usedAt: [] },
      { name: "Terraform", level: "userland", usedAt: [] },
      { name: "Linux", level: "kernel", usedAt: ["Sanofi", "Legal Aid Ontario"] },
    ],
  },
  {
    label: "Web & Tools",
    skills: [
      { name: "Git", level: "kernel", usedAt: ["Sanofi", "Tilray", "Smith Engineering"] },
      { name: "Vim", level: "driver", usedAt: [] },
      { name: "Jira", level: "driver", usedAt: ["Sanofi", "Legal Aid Ontario"] },
    ],
  },
];
