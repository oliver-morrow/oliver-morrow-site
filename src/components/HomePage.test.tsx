import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("home page", () => {
  const html = renderToStaticMarkup(<Home />);

  it("renders the technical portfolio structure", () => {
    expect(html).toContain("<header");
    expect(html).toContain("<main");
    expect(html).toContain('<h1 id="hero-heading">Oliver Morrow</h1>');
    expect(html).toContain('id="work"');
    expect(html).toContain('id="experience"');
    expect(html).toContain('id="focus"');
    expect(html).toContain("What I build");
    expect(html).toContain("Currently exploring");
    expect(html).toContain("What I’m looking for");
    expect(html).toContain("<footer");
  });

  it("includes the requested links and primary CTA", () => {
    expect(html).toContain(">GitHub</a>");
    expect(html).toContain(">LinkedIn</a>");
    expect(html).toContain(">Blog</a>");
    expect(html).toContain(">Email</a>");
    expect(html).toContain(">Resume</a>");
    expect(html).toContain("View selected work");
  });

  it("shows evidence and system boundaries without drafting scaffolding", () => {
    expect(html).toContain("System boundary");
    expect(html).toContain("Snowflake Cortex");
    expect(html).toContain("PageScript");
    expect(html).toContain("typed intermediate representation");
    expect(html).toContain("WebSockets");
    expect(html).toContain("2-of-3 quorum");
    expect(html).not.toContain("TODO");
    expect(html).not.toContain("what is still missing");
    expect(html).not.toContain("work-number");
  });

  it("uses the corrected graduation date and approved dash typography", () => {
    const emDash = String.fromCodePoint(0x2014);

    expect(html).toContain("April 2027");
    expect(html).not.toMatch(/Expected\s+2026/);
    expect(html).not.toContain(emDash);
  });
});
