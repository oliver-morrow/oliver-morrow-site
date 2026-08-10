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
};

export const site = {
  name: "Oliver Morrow",
  headline:
    "I build data tools, compilers, and infrastructure.",
  introduction:
    "I’m studying computer engineering at Queen’s and currently working at Sanofi as a Data & AI Engineer Co-op.",
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
    "At work I use Snowflake Cortex, SQL, Python, dbt, and Airflow. Outside work I’m building PageScript, experimenting with market data, and running a small Proxmox cluster at home.",
  selectedWork: [
    {
      context: "Sanofi · Data & AI Engineering · Sep 2025–present",
      title: "Planning data and Cortex workflows",
      summary:
        "I build semantic models, data pipelines, and Cortex workflows for internal planning tools.",
      highlights: [
        "I connect SQL business logic to Python workflows for internal portfolio data.",
        "I build and maintain automated dbt pipelines.",
        "I work on workflow automation and CI/CD reliability.",
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
    },
    {
      context: "Open source · v1.1.0-alpha.1 · Aug 2026",
      title: "PageScript",
      summary:
        "PageScript is a Rust compiler and CLI that turns compact .page files into standalone HTML. The alpha also renders source-cited system and lineage diagrams from reviewed JSON.",
      highlights: [
        "The Rust implementation includes the parser, validator, resolver, typed intermediate representation, HTML renderer, and native CLI.",
        "On the checked-in revenue-map fixture, 1,787 tokens of PageScript compile to 4,975 tokens of standalone HTML: 64.08% fewer authored-artifact tokens under o200k_base.",
        "The validator rejects executable URLs, style-tag termination, out-of-root imports, and recursive recipes before rendering.",
        "The alpha ships checksummed binaries for macOS, Linux, and Windows.",
      ],
      architecture: [
        {
          label: "Authoring",
          description:
            "Compact .page source composes typed primitives and reusable standard-library recipes without source-authored JavaScript.",
        },
        {
          label: "Compiler",
          description:
            "The Rust parser, resolver, and validator normalize accepted source into a typed intermediate representation.",
        },
        {
          label: "Renderer",
          description:
            "The IR compiler emits standalone HTML, CSS, SVG, and a small compiler-generated browser runtime.",
        },
        {
          label: "Evidence",
          description:
            "A reviewed Evidence Bundle and digest-bound Explainer Spec produce source-cited architecture or lineage HTML. Repository and dbt extraction are outside the current alpha.",
        },
        {
          label: "Delivery",
          description:
            "GitHub Actions test three operating systems, publish the PageScript-authored docs, and attach checksummed binaries to tagged releases.",
        },
      ],
      technologies: [
        "Rust",
        "Serde",
        "JSON Schema",
        "SHA-256",
        "HTML",
        "CSS",
        "SVG",
        "GitHub Actions",
        "GitHub Pages",
      ],
      links: [
        {
          label: "Read docs",
          kind: "Documentation",
          href: "https://oliver-morrow.github.io/pagescript/",
        },
        {
          label: "View source",
          kind: "Repository",
          href: "https://github.com/oliver-morrow/pagescript",
        },
        {
          label: "View alpha release",
          kind: "Release",
          href: "https://github.com/oliver-morrow/pagescript/releases/tag/v1.1.0-alpha.1",
        },
      ],
    },
    {
      context: "Team project · Sep–Dec 2024",
      title: "Noteworthy",
      summary:
        "A collaborative whiteboard and note-taking app built with C++ and Qt, compiled to WebAssembly for the browser.",
      highlights: [
        "The client sends JSON events over WebSockets; the C++ server updates room, page, and canvas state, then forwards the change to everyone connected.",
        "Nginx serves the WebAssembly client while a separate container runs the C++ HTTP and WebSocket service.",
        "Room and canvas state live in memory, so a server restart currently clears the session.",
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
    },
    {
      context: "Homelab · Apr 2026",
      title: "Proxmox High-Availability Cluster",
      summary:
        "Three OptiPlex Micro nodes run home automation, DNS, and VMs. A separate Ubuntu machine with an RTX 3070 handles local models.",
      highlights: [
        "Home automation runs in LXC containers on Node 1, DNS on Node 2, and virtual machines on Node 3.",
        "The cluster uses 2-of-3 quorum. I only enable ZFS replication where the recovery time is worth the I/O and storage cost.",
        "The Windows VM stays on one node; the containers I actually need at home are configured for HA.",
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
    "I’m working on deterministic repository and dbt extraction for PageScript, and testing when local models are worth running at home.",
  lookingFor:
    "I’m looking for a full-time role starting in May 2027, in Toronto or remote. I’m most interested in data, backend, and infrastructure work where I can own what I ship.",
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
