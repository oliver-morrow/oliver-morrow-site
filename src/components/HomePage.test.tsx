import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("home page", () => {
  const html = renderToStaticMarkup(<Home />);

  it("renders the approved semantic structure", () => {
    expect(html).toContain("<header");
    expect(html).toContain("<main");
    expect(html).toContain("<h1>Oliver Morrow</h1>");
    expect(html).toContain('id="work"');
    expect(html).toContain("Selected work");
    expect(html).toContain("Previously");
    expect(html).toContain("<footer");
  });

  it("does not render interactive portfolio machinery", () => {
    expect(html).not.toMatch(/<button|<form|<canvas|dialog/i);
    expect(html).not.toMatch(
      /available for|system status|telemetry|command search/i,
    );
  });

  it("uses descriptive text links", () => {
    expect(html).toContain(">Writing</a>");
    expect(html).toContain(">GitHub</a>");
    expect(html).toContain(">LinkedIn</a>");
    expect(html).toContain(">Email</a>");
  });
});
