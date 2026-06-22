import { site } from "@/data/site";

export default function Previously() {
  return (
    <section aria-labelledby="previously-heading" className="section">
      <h2 id="previously-heading">Previously</h2>
      <ol className="previous-list">
        {site.previously.map((item) => (
          <li key={`${item.organization}-${item.period}`}>
            <span className="metadata">{item.period}</span>
            <span>
              <strong>{item.organization}</strong> — {item.role}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
