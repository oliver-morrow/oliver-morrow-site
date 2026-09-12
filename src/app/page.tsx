function Links() {
  return (
    <nav className="links" aria-label="Find me">
      <a href="mailto:oliver@olivermorrow.com">Email</a>
      <a href="/Oliver-Morrow-Resume.pdf">Résumé</a>
      <a href="https://github.com/oliver-morrow">GitHub</a>
      <a href="https://linkedin.com/in/oliver-morrow">LinkedIn</a>
      <a href="https://blog.olivermorrow.com">Writing</a>
    </nav>
  );
}

function Projects() {
  return (
    <ul className="projects">
      <li>
        <a href="https://blog.olivermorrow.com/posts/home-server/">My home server</a>
        {" — "}a three-node Proxmox cluster for home automation and DNS.
        In a node-failure test, HomeKit Secure Video and Pi-hole recovered in
        about two minutes.
      </li>
      <li>
        <a href="https://blog.olivermorrow.com/posts/building-pagescript/">PageScript</a>
        {" — "}a language that compiles to standalone HTML. I designed the
        language and compiler architecture; the Rust implementation was
        AI-assisted.
      </li>
      <li>
        <a href="https://github.com/oliver-morrow/Noteworthy">Noteworthy</a>
        {" — "}a collaborative note-taking app built with C++ and Qt and
        compiled to WebAssembly to run in the browser.
      </li>
    </ul>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <main id="main-content" tabIndex={-1} className="site-shell">
        <header id="about">
          <h1 id="hero-heading">Oliver Morrow</h1>
          <p className="intro">
            I study Computer Engineering at Queen’s University and work as a
            Data &amp; AI Engineering co-op at Sanofi. I graduate in April 2027.
          </p>
          <Links />
        </header>
        <section id="experience" aria-labelledby="experience-heading">
          <h2 id="experience-heading">At work</h2>
          <p>
            At Sanofi, I build data pipelines and internal tools with Python, SQL,
            and Snowflake. I led development of an LLM agent that checks proposed
            updates before writing them to ServiceNow. I also built most of the
            semantic models used by our agents, which handle around 1,500 queries
            a week.
          </p>
          <p>
            Before that, I worked on demand planning at Tilray, developed electronics
            labs at Queen’s, and worked in IT at Legal Aid Ontario. I’ve also managed
            the Engineering Society’s IT team.
          </p>
        </section>
        <section id="work" aria-labelledby="work-heading">
          <h2 id="work-heading">Outside work</h2>
          <p>
            I also build tools for my own use and sometimes write about what I’m
            making. Here are a few projects:
          </p>
          <Projects />
        </section>
        <footer id="contact" className="closing">
          I’m looking for full-time roles in data or software engineering starting
          in May 2027, in Toronto or remotely. <a href="mailto:oliver@olivermorrow.com">Get in touch.</a>
        </footer>
      </main>
    </>
  );
}
