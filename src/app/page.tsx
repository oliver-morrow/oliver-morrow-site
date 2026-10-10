const blogUrl = "https://blog.olivermorrow.com";

const projects = [
  {
    name: "PageScript",
    href: `${blogUrl}/posts/building-pagescript/`,
    description:
      "A language that compiles compact source files to standalone HTML. I designed the language and compiler architecture; the Rust implementation was AI-assisted.",
    links: [
      { label: "How the compiler works", href: `${blogUrl}/posts/building-pagescript/` },
      { label: "Source", href: "https://github.com/oliver-morrow/pagescript" },
    ],
  },
  {
    name: "My home server",
    href: `${blogUrl}/posts/home-server/`,
    description:
      "Three Proxmox nodes running home automation and DNS. In a node-loss test, HomeKit Secure Video and Pi-hole recovered in 118 seconds.",
    links: [
      { label: "The setup and failure test", href: `${blogUrl}/posts/home-server/` },
    ],
  },
  {
    name: "Noteworthy",
    href: "https://github.com/oliver-morrow/Noteworthy",
    description:
      "A collaborative notes app built with C++ and Qt, compiled to WebAssembly for the browser. The live demo supported about 30 concurrent users.",
    links: [
      {
        label: "Source and current limitations",
        href: "https://github.com/oliver-morrow/Noteworthy",
      },
    ],
  },
];

const posts = [
  { title: "How PageScript compiles .page files to HTML", slug: "building-pagescript", date: "2026-08-09", label: "August 2026" },
  { title: "What MCP changed in my Cursor setup", slug: "agents-to-mcp", date: "2026-04-25", label: "April 2026" },
  { title: "My three-node Proxmox cluster", slug: "home-server", date: "2026-04-04", label: "April 2026" },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <main id="main-content" tabIndex={-1} className="site-shell">
        <header id="about" className="site-header">
          <h1>Oliver Morrow</h1>
          <nav className="main-nav" aria-label="Primary">
            <a href="#about" aria-current="page">About</a>
            <a href={blogUrl}>Writing</a>
            <a href="/Oliver-Morrow-Resume.pdf">Résumé</a>
          </nav>
        </header>
        <div className="introduction">
          <p className="intro">
            I study Computer Engineering at Queen’s University and work as a
            Data &amp; AI Engineering co-op at Sanofi. I graduate in April 2027.
          </p>
          <p className="availability">
            I’m looking for data and software roles from May 2027.{" "}
            <a href="mailto:oliver@olivermorrow.com">Get in touch.</a>
          </p>
        </div>
        <section id="experience" className="section-row" aria-labelledby="experience-heading">
          <h2 id="experience-heading">At work</h2>
          <div className="section-content">
            <h3>Data and AI engineering at Sanofi</h3>
            <p>
              I build Python services, internal web tools, and data pipelines.
              I led an LLM agent that checks proposed updates before writing
              them to ServiceNow, with architecture reviewed by a senior engineer.
            </p>
            <p>
              I also shipped Streamlit apps and dbt pipelines for license
              optimization, and reduced our data-foundation refresh time from
              45 to 30 minutes.
            </p>
          </div>
        </section>
        <section id="work" className="section-row" aria-labelledby="work-heading">
          <h2 id="work-heading">Projects</h2>
          <div className="section-content project-list">
            {projects.map((project) => (
              <article key={project.name}>
                <h3><a href={project.href}>{project.name}</a></h3>
                <p>{project.description}</p>
                <div className="project-links">
                  {project.links.map((link) => (
                    <a key={link.label} href={link.href}>{link.label}</a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="section-row earlier-work" aria-labelledby="earlier-heading">
          <h2 id="earlier-heading">Earlier work</h2>
          <div className="section-content">
            <p>
              I worked on demand planning at Tilray and developed electronics
              labs for more than 200 students at Queen’s. I’ve also led the
              Engineering Society’s IT team.
            </p>
          </div>
        </section>
        <section className="section-row" aria-labelledby="writing-heading">
          <h2 id="writing-heading">Writing</h2>
          <ul className="section-content writing-list">
            {posts.map((post) => (
              <li key={post.slug}>
                <a href={`${blogUrl}/posts/${post.slug}/`}>{post.title}</a>
                <time dateTime={post.date}>{post.label}</time>
              </li>
            ))}
          </ul>
        </section>
        <footer id="contact" className="site-footer">
          <a href="mailto:oliver@olivermorrow.com">oliver@olivermorrow.com</a>
          <div>
            <a href="https://github.com/oliver-morrow">GitHub</a>
            <a href="https://linkedin.com/in/oliver-morrow">LinkedIn</a>
          </div>
        </footer>
      </main>
    </>
  );
}
