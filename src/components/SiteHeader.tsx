import { site } from "@/data/site";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <h1>{site.name}</h1>
      <nav aria-label="Primary">
        {site.links.map((link) => (
          <a key={link.label} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
