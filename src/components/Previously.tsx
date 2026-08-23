import { site } from "@/data/site";
import type { ExperienceItem } from "@/data/site";

function ExperienceList({ items }: { items: ExperienceItem[] }) {
  return (
    <ol className="experience-list">
      {items.map((item) => (
        <li key={`${item.organization}-${item.period}`}>
          <span className="metadata">{item.period}</span>
          <div>
            <h3>{item.role}</h3>
            <p className="organization">{item.organization}</p>
            <p className="experience-description">{item.description}</p>

            {item.highlights ? (
              <ul className="experience-highlights">
                {item.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            ) : null}

            {item.technologies ? (
              <ul
                className="technology-list experience-technologies"
                aria-label={`${item.role} technologies`}
              >
                {item.technologies.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function Previously() {
  return (
    <>
      <section id="experience" aria-labelledby="experience-heading" className="section">
        <h2 id="experience-heading" className="section-title">Experience</h2>
        <ExperienceList items={site.experience} />
      </section>

      <section id="leadership" aria-labelledby="leadership-heading" className="section">
        <h2 id="leadership-heading" className="section-title">Leadership</h2>
        <ExperienceList items={site.leadership} />
      </section>

      <section id="focus" aria-labelledby="focus-heading" className="section">
        <h2 id="focus-heading" className="section-title">Technical focus</h2>
        <div className="focus-grid">
          {site.technicalFocus.map((group) => (
            <div className="focus-group" key={group.label}>
              <h3>{group.label}</h3>
              <p>{group.items.join(" · ")}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="closing-grid">
        <section aria-labelledby="exploring-heading" className="section closing-section">
          <h2 id="exploring-heading">Currently exploring</h2>
          <p>{site.currentlyExploring}</p>
        </section>

        <section aria-labelledby="looking-heading" className="section closing-section">
          <h2 id="looking-heading">What I’m looking for</h2>
          <ul className="looking-list">
            {site.lookingFor.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <a className="text-action" href="mailto:me@olivermorrow.com">
            Email me <span aria-hidden="true">↗</span>
          </a>
        </section>
      </div>
    </>
  );
}
