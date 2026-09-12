import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("home page", () => {
  const html = renderToStaticMarkup(<Home />);

  it("keeps the introduction and work visible without prototype controls", () => {
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain('id="main-content" tabindex="-1"');
    const headings = [...html.matchAll(/<h2[^>]*>([^<]+)<\/h2>/g)].map(
      (match) => match[1],
    );
    expect(headings).toEqual(["At work", "Outside work"]);
    expect(html).not.toMatch(/<details|Compare homepage drafts|variant=/);
    expect(html.indexOf("Sanofi")).toBeLessThan(html.indexOf("PageScript"));
  });

  it("preserves legacy section targets and resolves local links", () => {
    for (const target of ["work", "about", "experience", "contact"]) {
      expect(html).toContain(`id="${target}"`);
    }
    for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
      if (href.startsWith("#")) {
        expect(html).toContain(`id="${href.slice(1)}"`);
      } else if (href.startsWith("/")) {
        expect(existsSync(resolve("public", href.slice(1)))).toBe(true);
      }
    }
  });

  it("links to the résumé and public project sources without the retired demo", () => {
    expect(html).toContain('href="/Oliver-Morrow-Resume.pdf"');
    expect(html).toContain('href="mailto:me@olivermorrow.com"');
    expect(html).toContain('href="https://github.com/oliver-morrow/Noteworthy"');
    expect(html).toContain("AI-assisted");
    expect(html).not.toContain("noteworthy.howdoesthiseven.work");
  });
});
