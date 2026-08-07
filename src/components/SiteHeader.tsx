import { site } from "@/data/site";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <a className="site-name" href="#top" aria-label="Oliver Morrow, back to top">
        Oliver Morrow <span>/ Engineering portfolio</span>
      </a>
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
