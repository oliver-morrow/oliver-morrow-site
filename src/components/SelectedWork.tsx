import { site } from "@/data/site";

export default function SelectedWork() {
  return (
    <section id="work" aria-labelledby="work-heading" className="section">
      <h2 id="work-heading">Selected work</h2>
      <div className="work-list">
        {site.selectedWork.map((item) => (
          <article className="work-item" key={item.title}>
            <p className="metadata">{item.context}</p>
            <div>
              <h3>
                {item.href ? <a href={item.href}>{item.title}</a> : item.title}
              </h3>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
