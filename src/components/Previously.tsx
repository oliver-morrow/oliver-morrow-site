import { site } from "@/data/site";

export default function Previously() {
  return (
    <>
      <section id="experience" aria-labelledby="experience-heading" className="section">
        <div className="section-heading-row">
          <h2 id="experience-heading">Experience</h2>
          <p>{site.education}</p>
        </div>
        <ol className="experience-list">
          {site.experience.map((item) => (
            <li key={`${item.organization}-${item.period}`}>
              <span className="metadata">{item.period}</span>
              <div>
                <h3>{item.role}</h3>
                <p className="organization">{item.organization}</p>
                <p>{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="focus" aria-labelledby="focus-heading" className="section">
        <div className="section-heading-row">
          <h2 id="focus-heading">Technical focus</h2>
          <p>Tools grouped by the problems I use them to solve.</p>
        </div>
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
          <p>{site.lookingFor}</p>
          <a className="text-action" href="mailto:me@olivermorrow.com">
            Email me <span aria-hidden="true">↗</span>
          </a>
        </section>
      </div>
    </>
  );
}
