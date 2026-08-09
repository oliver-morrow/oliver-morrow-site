import { site } from "@/data/site";

export default function Introduction() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <h1 id="hero-heading">{site.name}</h1>
        <p className="hero-headline">{site.headline}</p>
        <p className="hero-introduction">{site.introduction}</p>
        <p className="availability">{site.availability}</p>
        <div className="hero-actions">
          <a className="primary-action" href="#work">
            View selected work <span aria-hidden="true">↓</span>
          </a>
          <span className="education">{site.education}</span>
        </div>
      </section>

      <section className="section split-section" aria-labelledby="build-heading">
        <h2 id="build-heading">What I build</h2>
        <p className="section-lead">{site.whatIBuild}</p>
      </section>
    </>
  );
}
