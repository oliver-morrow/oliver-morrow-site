export type SiteLink = {
  label: string;
  href: `https://${string}` | `mailto:${string}` | `/${string}`;
};

export type WorkLink = SiteLink & {
  kind: "Repository" | "Demo" | "Case study" | "Documentation" | "Release";
};

export type ArchitectureStep = {
  label: string;
  description: string;
};

export type WorkItem = {
  context: string;
  title: string;
  summary: string;
  highlights: string[];
  architecture?: ArchitectureStep[];
  technologies: string[];
  links: WorkLink[];
};

export type ExperienceItem = {
  period: string;
  organization: string;
  role: string;
  description: string;
  highlights?: string[];
  technologies?: string[];
};

export const site = {
  name: "Oliver Morrow",
  headline: "I build data tools, compilers, and infrastructure.",
  introduction:
    "Computer Engineering student at Queen’s (April 2027). Data & AI Engineering co-op at Sanofi in Toronto.",
  availability:
    "Available for full-time roles starting May 2027 (Toronto / GTA or remote), focused on data engineering, analytics engineering, and platform-adjacent software engineering.",
  education:
    "B.A.Sc. Computer Engineering, Queen’s University · Graduating April 2027",
  links: [
    { label: "GitHub", href: "https://github.com/oliver-morrow" },
    { label: "LinkedIn", href: "https://linkedin.com/in/oliver-morrow" },
    { label: "Blog", href: "https://blog.olivermorrow.com" },
    { label: "Email", href: "mailto:me@olivermorrow.com" },
    { label: "Resume", href: "/Oliver-Morrow-Resume.pdf" },
  ],
  whatIBuild:
    "At work: Snowflake, Cortex, SQL, Python, dbt, and Airflow for internal data foundations and production LLM agents. Outside work: PageScript (a Rust compile pipeline for .page to HTML), a Proxmox HA home lab, and systems experiments.",
  selectedWork: [
    {
      context: "Personal project · 2026",
      title: "PageScript",
      summary:
        "Designed a compact .page language and compile pipeline from parsing to typed IR to safe HTML, with no source-authored inline JavaScript. The Rust CLI aims to keep authored source smaller than hand-written pages.",
      highlights: [
        "Designed the architecture, language, and compiler boundaries; implementation was AI-assisted.",
        "The compile path separates parsing, validation, typed intermediate representation, and safe HTML rendering.",
        "Source files declare the page while the compiler owns the browser output and runtime.",
      ],
      architecture: [
        {
          label: "Authoring",
          description:
            "Compact .page source describes the document with typed primitives and reusable recipes.",
        },
        {
          label: "Typed IR",
          description:
            "Parsing and validation normalize accepted source behind a typed compiler boundary.",
        },
        {
          label: "Safe HTML",
          description:
            "The renderer emits standalone HTML without accepting source-authored inline JavaScript.",
        },
      ],
      technologies: ["Rust", "HTML", "CSS", "GitHub Actions"],
      links: [
        {
          label: "Read the case study",
          kind: "Case study",
          href: "https://blog.olivermorrow.com/posts/building-pagescript/",
        },
        {
          label: "View source",
          kind: "Repository",
          href: "https://github.com/oliver-morrow/pagescript",
        },
      ],
    },
    {
      context: "Homelab · Apr 2026",
      title: "Proxmox High-Availability Cluster",
      summary:
        "A three-node Proxmox HA lab for home automation, DNS, and virtualized workloads.",
      highlights: [
        "HomeKit Secure Video and Pi-hole containers fail over on node loss with a measured recovery of about 118 seconds.",
        "A three-node quorum keeps the cluster available through one node loss.",
        "Docker and Linux services run behind a reverse proxy.",
      ],
      architecture: [
        {
          label: "Cluster",
          description:
            "Three Proxmox nodes coordinate membership, quorum, and workload recovery.",
        },
        {
          label: "Services",
          description:
            "HomeKit Secure Video, Pi-hole, and other home services run in isolated containers.",
        },
        {
          label: "Failover",
          description:
            "Replicated services restart on a surviving node after a node failure.",
        },
      ],
      technologies: [
        "Proxmox",
        "Docker",
        "Linux",
        "High availability",
        "Reverse proxy",
        "Pi-hole",
      ],
      links: [
        {
          label: "Read the case study",
          kind: "Case study",
          href: "https://blog.olivermorrow.com/posts/home-server/",
        },
      ],
    },
    {
      context: "Team project · Sep–Dec 2024",
      title: "Noteworthy",
      summary:
        "A collaborative note-taking app built with C++ and Qt, then compiled to WebAssembly for the browser.",
      highlights: [
        "The live demo supported about 30 concurrent users.",
        "WebAssembly integration was the hardest completed piece; durable persistence remains an explicit constraint.",
        "Room and canvas state currently live in memory and are lost when the server restarts.",
        "Docker and Nginx package and serve the browser client and collaboration service.",
      ],
      architecture: [
        {
          label: "Client",
          description: "A C++ and Qt interface compiled to WebAssembly.",
        },
        {
          label: "Collaboration",
          description:
            "JSON events synchronize room and note changes between connected users.",
        },
        {
          label: "State",
          description:
            "Room, page, user, and canvas state currently live in the server process.",
        },
        {
          label: "Delivery",
          description:
            "Docker packages the services and Nginx serves the WebAssembly client.",
        },
      ],
      technologies: ["C++", "Qt", "WebAssembly", "Docker", "Nginx"],
      links: [
        {
          label: "Open live demo",
          kind: "Demo",
          href: "https://noteworthy.howdoesthiseven.work/",
        },
        {
          label: "View source",
          kind: "Repository",
          href: "https://github.com/oliver-morrow/Noteworthy",
        },
      ],
    },
  ],
  experience: [
    {
      period: "Sep 2025–present",
      organization: "Sanofi",
      role: "Data & AI Engineer Co-op",
      description:
        "Builds semantic models, LLM agents, and automated pipelines on Snowflake for internal planning and operations data.",
      highlights: [
        "Led an internal LLM writeback agent end to end, with architecture reviewed by senior engineering: containerized Python services post structured updates into ServiceNow under deterministic and LLM relevance guardrails.",
        "Built the majority of Snowflake Cortex semantic models on a shared portfolio data foundation; ran knowledge-transfer sessions for full-time engineers; production agent traffic averages about 1,500 queries per week.",
        "Built dbt pipelines and Streamlit-in-Snowflake tooling for a company license-optimization platform covering a roughly 100,000-person workforce; led a workstream tracking application cost-center migrations for inactive-license cleanup.",
        "Cut data-foundation refresh from 45 to 30 minutes; dbt and Airflow pipelines keep ServiceNow context at 30-minute freshness and Jira at 45 minutes.",
        "Shipped internal tooling so the team updates agent skills through an issue-to-automated-PR workflow, plus CI on tagged dbt model diffs.",
      ],
      technologies: [
        "Python",
        "SQL",
        "Snowflake Cortex",
        "Snowpark",
        "Streamlit",
        "Snowflake Tasks",
        "dbt",
        "Airflow",
        "ServiceNow APIs",
        "GitHub Actions",
      ],
    },
    {
      period: "Jun–Aug 2025",
      organization: "Tilray Brands",
      role: "Data & Analytics Intern",
      description: "Built demand-planning analytics for the forecast team.",
      highlights: [
        "Built demand-planning dashboards under cannabis shelf-life rules, with planning horizons from months to years.",
        "Surfaced seasonal demand patterns from historical sales that the forecast team still uses.",
      ],
      technologies: ["SQL", "Python", "Power BI"],
    },
    {
      period: "May 2024–Apr 2025",
      organization: "Smith Engineering, Queen’s University",
      role: "Electronics I Course Developer",
      description:
        "Authored new BJT and MOSFET labs and improved the transformer lab with Dr. Brian Frank using LTSpice and LaTeX for more than 200 ECE students.",
    },
    {
      period: "May–Sep 2023",
      organization: "Legal Aid Ontario",
      role: "IT Analyst Intern",
      description: "Modernized internal IT inventory and support workflows.",
      highlights: [
        "Replaced a legacy on-premises inventory system from around 1999 with a modern workflow for laptops and peripherals.",
        "Shipped a support knowledge base and training content for common fixes.",
      ],
      technologies: ["Azure", "VMware", "Citrix"],
    },
  ],
  leadership: [
    {
      period: "Apr 2023–Apr 2024",
      organization: "Engineering Society of Queen’s University",
      role: "IT Operations Team Manager",
      description:
        "Owned Azure accounts, WordPress, and the EngSoc shop backend for real-money sales; hired and delegated a team after starting at about 10 tickets per week.",
    },
    {
      period: "Jan 2023–Jan 2024",
      organization: "Ontario Engineering Competition 2024",
      role: "VP Communications",
      description:
        "Led communications for more than 300 competitors, coordinated live logistics when buses failed for about 150 students, and chaired the formal process for a cheating investigation.",
    },
  ],
  technicalFocus: [
    {
      label: "Languages",
      items: ["Python", "SQL", "C", "C++", "Bash", "Java"],
    },
    {
      label: "Data and platforms",
      items: [
        "Snowflake (Cortex, Snowpark, Streamlit, Tasks)",
        "dbt",
        "Airflow",
        "Docker",
        "Linux",
        "Git",
        "ServiceNow APIs",
        "Power BI",
        "Proxmox",
      ],
    },
    {
      label: "Additional experience",
      items: ["Azure", "VMware", "Citrix", "Nginx", "LTSpice", "AV-over-IP"],
    },
  ],
  currentlyExploring:
    "I’m continuing PageScript’s deterministic extraction work and using the Proxmox lab for systems and infrastructure experiments.",
  lookingFor: [
    "Full-time role starting May 2027, Toronto / GTA or remote",
    "Primary: data engineering, analytics engineering, and data platform work",
    "Also: platform-adjacent software engineering and internal tools with real ownership",
    "Longer-term interest in systems and infrastructure, learning in public without claiming production Rust experience",
  ],
} satisfies {
  name: string;
  headline: string;
  introduction: string;
  availability: string;
  education: string;
  links: SiteLink[];
  whatIBuild: string;
  selectedWork: WorkItem[];
  experience: ExperienceItem[];
  leadership: ExperienceItem[];
  technicalFocus: { label: string; items: string[] }[];
  currentlyExploring: string;
  lookingFor: string[];
};
