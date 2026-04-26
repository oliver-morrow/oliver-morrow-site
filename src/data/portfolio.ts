import type {
  Experience,
  Project,
  SiteConfig,
  Education,
  SkillCategory,
  CaseStudy,
} from "../types";

export const siteConfig: SiteConfig = {
  profile: {
    name: "Oliver Morrow",
    title: "Data, AI & Systems Engineering",
    bio: "I build production data platforms, agent workflows, and systems tooling with a focus on reliable internal products and infrastructure.",
    coreStack: ["Snowflake", "dbt", "Airflow", "Python", "SQL", "MCP"],
    socials: {
      github: "https://github.com/oliver-morrow",
      linkedin: "https://linkedin.com/in/oliver-morrow",
      email: "me@olivermorrow.ca",
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
      "Digital Systems",
      "Circuits I",
      "Microprocessors & Embedded Systems",
      "Computer Architecture",
    ],
  },
];

export const experience: Experience[] = [
  {
    id: "sanofi-2025",
    role: "Data & AI Engineer Co-op",
    company: "Sanofi",
    period: { start: "Sep 2025", end: "Present" },
    description: "Engineered semantic models and agent workflows using Snowflake Cortex, bridging complex SQL logic with Python to streamline internal portfolio data access.",
    detailedDescription: [
      "Build and maintain Snowflake Cortex semantic models for natural-language querying of enterprise portfolio and planning data",
      "Bridge complex SQL business logic with Python orchestration to support internal agent workflows and governed data access",
      "Develop and manage automated dbt pipelines focused on business-logic automation and delivery reliability",
      "Contribute to production data products used by internal teams rather than isolated prototypes or demos",
    ],
    technologies: ["Snowflake", "dbt", "Python", "Airflow", "Cortex Analyst", "SQL"],
    type: "work",
  },
  {
    id: "tilray-2025",
    role: "Data & Analytics Intern",
    company: "Tilray Brands",
    period: { start: "Jun 2025", end: "Aug 2025" },
    description: "Used SQL and Python to analyze large-scale sales and operations data, uncovering trends and delivering actionable insights across departments.",
    detailedDescription: [
      "Analyzed sales and operations data with SQL and Python to surface trends that informed cross-functional decision-making",
      "Built interactive Power BI dashboards and automated reporting workflows for business stakeholders",
      "Improved data accessibility for non-technical teams by packaging recurring analyses into reusable reports",
    ],
    technologies: ["Python", "SQL", "Power BI", "Data Analysis"],
    type: "work",
  },
  {
    id: "smith-2024",
    role: "Electronics I Course Developer",
    company: "Smith Engineering",
    period: { start: "May 2024", end: "Apr 2025" },
    description: "Engineered comprehensive lab content using LTSpice and LaTeX. Debugged circuit designs and supported over 200 electrical engineering students.",
    detailedDescription: [
      "Authored lab manuals and simulation exercises in LTSpice covering analog and digital circuit fundamentals",
      "Typeset professional-grade documentation using LaTeX with custom macros for circuit schematics",
      "Debugged and validated circuit designs prior to student lab deployment",
      "Supported 200+ students through office hours and hands-on troubleshooting sessions",
    ],
    technologies: ["LTSpice", "LaTeX", "Circuit Design", "Pedagogy"],
    type: "work",
  },
  {
    id: "queens-its-2024",
    role: "Digital Classrooms Intern",
    company: "Queen's University ITS",
    period: { start: "May 2024", end: "Aug 2024" },
    description: "Optimized technological infrastructure through strategic hardware upgrades and process automation.",
    detailedDescription: [
      "Deployed and configured AV equipment across 70+ lecture halls and seminar rooms",
      "Automated recurring maintenance tasks with scripted workflows, reducing manual intervention",
      "Coordinated hardware lifecycle upgrades for campus-wide classroom technology",
    ],
    technologies: ["Hardware", "IT Infrastructure", "Automation"],
    type: "work",
  },
  {
    id: "lao-2023",
    role: "Information Technology Analyst Intern",
    company: "Legal Aid Ontario",
    period: { start: "May 2023", end: "Sep 2023" },
    description: "Used Azure Cloud, VMware, and Citrix tooling to support IT operations and independently delivered internal knowledge and inventory projects.",
    detailedDescription: [
      "Supported Azure Cloud resources, VMware infrastructure, and Citrix environments used in day-to-day IT operations",
      "Built and maintained an internal inventory management system to improve asset tracking and operational visibility",
      "Created help knowledge base documentation and employee training materials for recurring support workflows",
      "Handled operational support work across endpoint, server, and user-facing issues",
    ],
    technologies: ["Azure", "VMware", "Citrix", "IT Operations"],
    type: "work",
  },
];

export const volunteer: Experience[] = [
  {
    id: "oec-vp-comms-2023",
    role: "Vice President of Communications",
    company: "The Ontario Engineering Competition 2024",
    period: { start: "Jan 2023", end: "Jan 2024" },
    description: "Led communications team managing stakeholder relationships and coordinating logistics for 300+ competitors across Ontario.",
    detailedDescription: [
      "Led communications team managing stakeholder relationships and coordinating complex logistics for 300+ competitors",
      "Developed comprehensive project documentation and communication systems",
      "Met sprint goals and delivered results to stakeholders on schedule",
    ],
    technologies: ["Project Management", "Stakeholder Relations", "Documentation"],
    type: "volunteer",
  },
  {
    id: "engsoc-it-2023",
    role: "IT Operations Team Manager",
    company: "Engineering Society of Queen's University",
    period: { start: "Apr 2023", end: "Apr 2024" },
    description: "Directed IT Operations team managing server infrastructure and system maintenance using Microsoft Azure.",
    detailedDescription: [
      "Directed IT Operations team managing server infrastructure and system maintenance",
      "Implemented process improvements using Microsoft Azure for enhanced operational effectiveness",
    ],
    technologies: ["Azure", "IT Infrastructure", "Team Leadership"],
    type: "volunteer",
  },
];

export const projects: Project[] = [
  {
    id: "noteworthy",
    title: "Noteworthy Platform",
    tagline: "Distributed Collaboration",
    description: "A scalable collaborative note-taking app built with C++, Qt, and WebAssembly. Features real-time data persistence and Docker containerization.",
    detailedDescription: [
      "Architected a client-server note-taking platform with C++ backend and Qt-based desktop UI",
      "Compiled core logic to WebAssembly for browser-based access without rewriting business logic",
      "Implemented real-time data persistence with file-backed storage and automatic conflict resolution",
      "Containerized the full stack with Docker and served via Nginx reverse proxy",
    ],
    technologies: ["C++", "Qt", "WebAssembly", "Docker", "Nginx"],
    links: { demo: "https://www.noteworthy.howdoesthiseven.work" },
    featured: true,
  },
  {
    id: "cyclicus",
    title: "Cyclicus Trading",
    tagline: "ML Signal Generator",
    description: "Trading signal generator integrating BERT-based NLP sentiment analysis and Random Forest models. Visualized via a FastAPI/Vue.js dashboard.",
    detailedDescription: [
      "Fine-tuned a BERT model on financial news corpus for sentiment classification",
      "Engineered a Random Forest ensemble combining sentiment scores with technical indicators",
      "Built a FastAPI backend serving real-time predictions to a Vue.js dashboard",
      "Backtested signal accuracy against historical market data across multiple asset classes",
    ],
    technologies: ["Python", "BERT", "Scikit-learn", "FastAPI", "Vue.js"],
    links: {},
    featured: true,
  },
  {
    id: "proxmox-ha-cluster",
    title: "Proxmox HA Cluster",
    tagline: "Homelab Infrastructure",
    description: "Architected a 3-node Proxmox high-availability cluster for home automation, DNS, and virtual machines using power-efficient hardware and redundancy strategies.",
    detailedDescription: [
      "Designed a 3-node Proxmox cluster to provide failover capacity for self-hosted services and VM workloads",
      "Balanced power efficiency, service placement, and redundancy across compact hardware rather than overbuilding the environment",
      "Hosted core home-lab services including automation, DNS, and general-purpose virtual machines on shared infrastructure",
      "Used the cluster as a practical platform for learning operations, resiliency, and self-hosted systems design",
    ],
    technologies: ["Proxmox", "Linux", "Virtualization", "Networking"],
    links: {},
    featured: false,
  },
  {
    id: "c-spreadsheet",
    title: "C-Based Spreadsheet",
    tagline: "Low-Level Computation",
    description: "Built a functional spreadsheet engine from scratch in C, implementing custom memory management and mathematical algorithms.",
    detailedDescription: [
      "Implemented a cell-based computation engine with dependency graph for formula evaluation",
      "Wrote custom memory allocator for efficient cell storage and garbage collection",
      "Supported arithmetic, string, and referential formulas with circular dependency detection",
    ],
    technologies: ["C", "Algorithms", "Memory Management"],
    links: {},
    featured: false,
  },
];

export const caseStudies: CaseStudy[] = [
  {
    id: "sanofi-snowflake-agents",
    title: "Snowflake Cortex Agent Architecture",
    organization: "Sanofi",
    period: { start: "Fall 2025", end: "Present" },
    summary:
      "Built and owned core parts of a production internal agent experience that helped users access project, portfolio, and application information without manually assembling reports.",
    problem:
      "Important portfolio and product information lived across financial and project/portfolio management systems, which meant employees often had to build reports manually just to understand project status or take action.",
    ownership: [
      "Owned agent integrations with internal systems and helped design and implement the main agent experience.",
      "Built core agent infrastructure, retrieval workflows, and supporting data models.",
      "Worked across data modeling, reliability, and production-readiness concerns rather than stopping at prototype-level functionality.",
    ],
    approach: [
      "Used Snowflake Cortex, dbt, and Airflow to connect governed enterprise data with agent workflows that could answer questions and support operational workflows.",
      "Optimized queries and recovery behavior so the main agent could handle prompts touching years of data while remaining fast and resilient to unexpected inputs.",
      "Tuned guardrails for governed updates to balance safety, accuracy, and responsiveness without making the experience unusably slow.",
    ],
    impact: [
      "Moved from prototype work into a production internal environment rather than staying as a demo or sandbox workflow.",
      "Reduced the need for manual report-building across enterprise systems just to get insight into project and product information.",
      "Established a foundation for further agent work by turning semantic views and agent patterns into something repeatable and operationally usable.",
      "Showed that the team could iterate quickly while working within enterprise constraints.",
    ],
    tech: ["Snowflake", "Cortex", "dbt", "Airflow", "SQL", "Enterprise Integrations"],
    tags: ["Agents", "Production", "Semantic Layer", "Writeback"],
    featured: true,
    confidentialityNote:
      "Internal product names, system details, and rollout specifics are intentionally abstracted.",
  },
  {
    id: "sanofi-dbt-forecasting",
    title: "dbt Pipeline Automation for Budgeting & Forecasting",
    organization: "Sanofi",
    period: { start: "Fall 2025", end: "Present" },
    summary:
      "Worked on a dbt-driven data pipeline powering an internal planning workflow, with a strong emphasis on CI/CD, testing, and business-logic automation.",
    problem:
      "Forecasting workflows are high-stakes and organization-wide, and they become painful quickly when business logic changes are slow to intake, hard to test, or messy to deploy.",
    ownership: [
      "Worked as a data engineer on the pipeline and surrounding engineering workflow for the forecasting product.",
      "Contributed directly to the dbt-based transformation layer and the delivery discipline around testing and deploying changes through GitHub.",
      "Helped improve how new business logic was ingested, structured, and turned into implementation work.",
    ],
    approach: [
      "Used dbt and orchestration workflows to support a product where stakeholders maintained planning inputs and projected spend during key planning cycles.",
      "Relied heavily on GitHub CI/CD, branch protection, testing in pull requests, and structured deployment workflows to keep changes safe and reviewable.",
      "Used automation and subagents to accelerate business-logic intake, implementation, and code review workflows once the process was mature enough to standardize.",
    ],
    impact: [
      "Supported an internal forecasting workflow that mattered across the organization, not just to a single team.",
      "Made it easier to incorporate changing business logic without relying entirely on manual engineering intake.",
      "Improved repository structure and delivery hygiene, making the codebase cleaner and the workflow easier to maintain.",
      "Helped sustain a fast shipping cadence around a business-critical quarter-end workflow.",
    ],
    tech: ["dbt", "Airflow", "GitHub Actions", "SQL", "Automation", "Subagents"],
    tags: ["dbt", "Forecasting", "CI/CD", "Automation"],
    featured: true,
    confidentialityNote:
      "Product details, financial context, and internal workflow specifics are intentionally abstracted.",
  },
];

export const skills: SkillCategory[] = [
  {
    label: "Languages",
    skills: [
      { name: "Python", level: "kernel", usedAt: ["Sanofi", "Tilray", "Cyclicus"] },
      { name: "C++", level: "kernel", usedAt: ["Noteworthy"] },
      { name: "Java", level: "driver", usedAt: [] },
      { name: "C", level: "driver", usedAt: [] },
      { name: "SQL", level: "kernel", usedAt: ["Sanofi", "Tilray"] },
      { name: "Bash", level: "driver", usedAt: ["Sanofi"] },
      { name: "Go", level: "userland", usedAt: [] },
    ],
  },
  {
    label: "Data Engineering",
    skills: [
      { name: "Snowflake", level: "kernel", usedAt: ["Sanofi"] },
      { name: "dbt", level: "kernel", usedAt: ["Sanofi"] },
      { name: "Airflow", level: "driver", usedAt: ["Sanofi"] },
      { name: "Pandas", level: "driver", usedAt: ["Tilray", "Cyclicus", "Sanofi"] },
    ],
  },
  {
    label: "Infrastructure",
    skills: [
      { name: "Docker", level: "driver", usedAt: ["Noteworthy"] },
      { name: "Linux", level: "kernel", usedAt: ["Sanofi"] },
      { name: "Azure", level: "driver", usedAt: ["Legal Aid Ontario", "Engineering Society"] },
      { name: "Proxmox", level: "driver", usedAt: ["Proxmox HA Cluster"] },
    ],
  },
  {
    label: "Web & Tools",
    skills: [
      { name: "Git", level: "kernel", usedAt: ["Sanofi", "Tilray"] },
      { name: "Jira", level: "driver", usedAt: ["Sanofi"] },
      { name: "Power BI", level: "driver", usedAt: ["Tilray"] },
      { name: "MCP", level: "driver", usedAt: ["Sanofi"] },
    ],
  },
];
