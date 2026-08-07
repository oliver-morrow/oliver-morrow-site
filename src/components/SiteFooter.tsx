import { site } from "@/data/site";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>Toronto, Ontario</span>
      <span>
        © {new Date().getFullYear()} {site.name}
      </span>
      <a href="#top">Back to top ↑</a>
    </footer>
  );
}
