export type SiteLink = {
  label: string;
  href: `https://${string}` | `mailto:${string}` | `/${string}`;
};

export type WorkLink = SiteLink & {
  kind: "Repository" | "Demo" | "Case study";
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
  todos: string[];
};

export type ExperienceItem = {
  period: string;
  organization: string;
  role: string;
  description: string;
};

export const site = {
  name: "Oliver Morrow",
  headline:
    "Computer engineering student building production data and AI systems.",
  introduction:
    "I build data and AI systems from the semantic model and business logic through orchestration and deployment. I’m a Data & AI Engineer Co-op at Sanofi, where I’m building Snowflake Cortex agent workflows and governed data pipelines for internal planning products.",
  availability:
    "Toronto, Ontario · Available for full-time roles from May 2027",
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
    "With Snowflake Cortex, semantic models, SQL, Python, dbt, and Airflow, I make governed internal data easier to query and turn business rules into repeatable workflows.",
  selectedWork: [
    {
      context: "Sanofi · Data & AI Engineering · Sep 2025–present",
      title: "Enterprise data access and agent workflows",
      summary:
        "I build semantic models, pipelines, and agent workflows for internal planning products.",
      highlights: [
        "I engineer semantic models and agent workflows using Snowflake Cortex.",
        "I connect complex SQL business logic to Python workflows for internal portfolio data access.",
        "I build and manage automated dbt pipelines for internal planning products.",
        "I work on business-logic automation and CI/CD reliability.",
      ],
      technologies: [
        "Snowflake Cortex",
        "Snowflake",
        "SQL",
        "Python",
        "dbt",
        "Airflow",
      ],
      links: [],
      todos: [],
    },
    {
      context: "Personal project · Sep 2024–present",
      title: "Cyclicus",
      summary:
        "I rebuilt Cyclicus as a point-in-time market-sentiment research workbench. It tests whether sentiment known at a fixed decision time adds information beyond technical features.",
      highlights: [
        "I enforce publication, availability, decision, and label timestamps when building datasets so later information cannot leak into historical forecasts.",
        "I compare majority, technical-only, sentiment-only, combined logistic, and seeded Random Forest models on the same chronological folds.",
        "I serialize model results, folds, predictions, timestamps, and lineage into deterministic evidence bundles.",
        "The same evidence bundle drives a static deployment, a read-only FastAPI API, and a Vue dashboard with model comparison and forecast replay.",
        "CI runs Python and frontend tests, strict type checks, root and subpath builds, and byte-for-byte evidence regeneration.",
      ],
      architecture: [
        {
          label: "Data",
          description:
            "A deterministic synthetic fixture powers the public demo; the dataset builder enforces source, decision, and label timestamps. Live provider ingestion is intentionally outside the demo’s scope.",
        },
        {
          label: "NLP",
          description:
            "An optional FinBERT adapter handles financial text. The checked-in demo uses a deterministic lexicon scorer.",
        },
        {
          label: "Models",
          description:
            "Technical and sentiment ablations, logistic regression, and a seeded Random Forest run on matched chronological folds.",
        },
        {
          label: "API",
          description:
            "FastAPI exposes immutable evidence bundles through read-only showcase and run-detail endpoints.",
        },
        {
          label: "Frontend",
          description:
            "Vue, TypeScript, Tailwind CSS, and ECharts present comparisons, integrity checks, lineage, and forecast replay.",
        },
      ],
      technologies: [
        "Python",
        "pandas",
        "scikit-learn",
        "FinBERT",
        "FastAPI",
        "Vue.js",
        "TypeScript",
        "Tailwind CSS",
        "ECharts",
        "Docker",
      ],
      links: [
        {
          label: "View source",
          kind: "Repository",
          href: "https://github.com/oliver-morrow/trading-sentiment",
        },
        {
          label: "Open demo",
          kind: "Demo",
          href: "/cyclicus/",
        },
      ],
      todos: [],
    },
    {
      context: "Team project · Sep–Dec 2024",
      title: "Noteworthy",
      summary:
        "I worked on a collaborative note-taking application built in C++ and Qt, compiled to WebAssembly for the browser, and deployed with Docker and Nginx. It supports multiple pages, drawing objects, stickers, icons, and bounding-box selection.",
      highlights: [
        "The Qt client sends JSON events over WebSockets; the C++ server applies them to room, page, and canvas-object state, then forwards changes to connected collaborators.",
        "The browser build keeps the C++ and Qt interaction model, but adds WebAssembly payload, browser interop, MIME-type, and cache-control concerns.",
        "The client and server ship separately: Nginx serves the WebAssembly artifacts, while a containerized C++ service handles HTTP and WebSocket traffic.",
        "Room and canvas state currently live in server memory during a running session; the source does not document durable recovery after a server restart.",
      ],
      architecture: [
        {
          label: "Client",
          description: "Qt widgets and graphics-scene code compiled to WebAssembly.",
        },
        {
          label: "Collaboration",
          description:
            "Event-based room updates over Qt WebSockets and a C++ WebSocket server.",
        },
        {
          label: "State",
          description:
            "In-memory room, page, user, and canvas-object maps with JSON serialization.",
        },
        {
          label: "Deployment",
          description:
            "Separate Docker images for the C++ service and Nginx-hosted WebAssembly client.",
        },
      ],
      technologies: ["C++", "Qt", "WebAssembly", "Docker", "Nginx", "WebSockets"],
      links: [
        {
          label: "View source",
          kind: "Repository",
          href: "https://github.com/oliver-morrow/Noteworthy",
        },
        {
          label: "Open live demo",
          kind: "Demo",
          href: "https://noteworthy.howdoesthiseven.work/",
        },
      ],
      todos: [
        "Make the repository public so website visitors can open the source link.",
        "Document the original Qt/WebAssembly decision and the intended durable-persistence model.",
      ],
    },
    {
      context: "Homelab · Apr 2026",
      title: "Proxmox High-Availability Cluster",
      summary:
        "I built a three-node Proxmox VE cluster from power-efficient hardware for home automation, DNS, and virtual machines, with a separate Ubuntu GPU host for local inference.",
      highlights: [
        "I place broadcast-sensitive home automation services in LXC containers on Node 1, DNS services on Node 2, and virtual machines on Node 3.",
        "I use three nodes for 2-of-3 quorum, and apply ZFS replication selectively because redundancy costs I/O and usable storage.",
        "I keep a legacy Windows VM node-bound while configuring critical containers for HA, separating workloads by their actual recovery needs.",
        "A separate Ubuntu server with an RTX 3070 runs Ollama, keeping GPU work outside the primary hypervisor cluster.",
      ],
      architecture: [
        {
          label: "Node 1",
          description: "LXC containers for Homebridge, Scrypted, and Sonos services.",
        },
        {
          label: "Node 2",
          description: "Pi-hole DNS with configuration replicated to a secondary instance.",
        },
        {
          label: "Node 3",
          description: "Virtual machines, including a node-bound Windows workload.",
        },
        {
          label: "GPU host",
          description: "Bare-metal Ubuntu and Ollama for local LLM inference.",
        },
      ],
      technologies: [
        "Proxmox VE",
        "Debian",
        "Ubuntu",
        "LXC",
        "ZFS",
        "Corosync",
        "Pi-hole",
        "Ollama",
      ],
      links: [
        {
          label: "Read the architecture notes",
          kind: "Case study",
          href: "https://blog.olivermorrow.com/posts/home-server",
        },
      ],
      todos: [
        "Add repeatable failover test results, recovery times, and a current network diagram.",
      ],
    },
  ],
  experience: [
    {
      period: "Sep 2025–present",
      organization: "Sanofi",
      role: "Data & AI Engineer Co-op",
      description:
        "I build semantic models, agent workflows, and automated data pipelines for internal planning products.",
    },
    {
      period: "Jun–Aug 2025",
      organization: "Tilray Brands",
      role: "Data & Analytics Intern",
      description:
        "I analyzed sales and operations data with SQL and Python, then built Power BI dashboards and automated reporting tools.",
    },
    {
      period: "May 2024–Apr 2025",
      organization: "Queen’s University",
      role: "Electronics I Course Developer",
      description:
        "I created LTSpice and LaTeX lab content, supported 200+ students, and documented circuit-debugging procedures.",
    },
    {
      period: "May–Aug 2024",
      organization: "Queen’s University Digital Classrooms",
      role: "Digital Classrooms Intern",
      description:
        "I improved classroom hardware and software infrastructure and the processes used to support it.",
    },
    {
      period: "May–Sep 2023",
      organization: "Legal Aid Ontario",
      role: "IT Analyst Intern",
      description:
        "I worked with Azure, VMware, and Citrix, and built a knowledge base, employee training videos, and an inventory management system.",
    },
    {
      period: "Apr 2023–Apr 2024",
      organization: "Engineering Society of Queen’s University",
      role: "IT Operations Team Manager",
      description:
        "I directed IT operations across Azure maintenance, ticket response, and user management.",
    },
    {
      period: "Jan 2023–Jan 2024",
      organization: "Ontario Engineering Competition 2024",
      role: "VP Communications",
      description:
        "I led stakeholder communications and logistics for 300+ competitors.",
    },
  ],
  technicalFocus: [
    {
      label: "Languages",
      items: ["Python", "C", "C++", "Java", "SQL", "Bash", "Rust", "Go"],
    },
    {
      label: "Data and AI",
      items: [
        "Snowflake",
        "Snowflake Cortex",
        "dbt",
        "Airflow",
        "Power BI",
        "BERT-based NLP",
        "Machine learning",
      ],
    },
    {
      label: "Systems and infrastructure",
      items: [
        "Linux",
        "Docker",
        "Git",
        "Proxmox",
        "Azure",
        "VMware",
        "Citrix",
        "Nginx",
      ],
    },
    {
      label: "Embedded and hardware",
      items: [
        "ROS",
        "LTSpice",
        "Computer architecture",
        "AV-over-IP",
        "Networking",
      ],
    },
  ],
  currentlyExploring:
    "I’m testing how agent systems recover when tools, state, or model output fail, and where local inference is worth the operational cost. I use AI-assisted coding for speed, then verify the data model, interfaces, failure modes, and deployment myself.",
  lookingFor:
    "I’m looking for a team that ships and operates real systems. I’m open to data, AI, software, backend, architecture, and infrastructure roles starting in May 2027, in Toronto or remote.",
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
  technicalFocus: { label: string; items: string[] }[];
  currentlyExploring: string;
  lookingFor: string;
};
