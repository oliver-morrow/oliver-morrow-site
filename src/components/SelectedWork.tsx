import { site } from "@/data/site";

export default function SelectedWork() {
  return (
    <section id="work" aria-labelledby="work-heading" className="section work-section">
      <div className="section-heading-row">
        <h2 id="work-heading">Selected work</h2>
        <p>What I built and how each system works.</p>
      </div>

      <div className="work-list">
        {site.selectedWork.map((item) => (
          <article className="work-item" key={item.title}>
            <header className="work-header">
              <div>
                <p className="metadata">{item.context}</p>
                <h3>{item.title}</h3>
                <p className="work-summary">{item.summary}</p>
              </div>
            </header>

            <div className="work-content">
              <div>
                <h4>Evidence</h4>
                <ul className="evidence-list">
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>

              {item.architecture ? (
                <div>
                  <h4>System boundary</h4>
                  <ol className="architecture-list">
                    {item.architecture.map((step) => (
                      <li key={step.label}>
                        <strong>{step.label}</strong>
                        <span>{step.description}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}

              <div className="work-footer">
                <ul className="technology-list" aria-label={`${item.title} technologies`}>
                  {item.technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>

                {item.links.length > 0 ? (
                  <div className="work-links">
                    {item.links.map((link) => (
                      <a href={link.href} key={link.href}>
                        {link.label} <span aria-hidden="true">↗</span>
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>

            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
