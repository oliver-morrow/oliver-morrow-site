import { site } from "@/data/site";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>{site.location}</span>
      <span>
        © {new Date().getFullYear()} {site.name}
      </span>
      <a href="https://blog.olivermorrow.com">Writing</a>
    </footer>
  );
}
