import { describe, expect, it } from "vitest";
import { site } from "./site";

describe("site content", () => {
  it("uses direct positioning and accurate availability copy", () => {
    expect(site.headline).toBe(
      "I build data tools, compilers, and infrastructure.",
    );
    expect(site.introduction).toContain("Sanofi as a Data & AI Engineer Co-op");
    expect(site.availability).toContain("May 2027");
    expect(site.education).toContain("April 2027");
    expect(`${site.introduction} ${site.whatIBuild}`).not.toMatch(
      /\bintersection\b|\bstreamline\b|\bpassionate\b|\binnovative\b|survives contact|trade-offs behind/i,
    );
  });

  it("presents the selected systems without unsupported performance claims", () => {
    expect(site.selectedWork.map((item) => item.title)).toEqual([
      "Planning data and Cortex workflows",
      "PageScript",
      "Noteworthy",
      "Proxmox High-Availability Cluster",
    ]);
    expect(JSON.stringify(site.selectedWork)).not.toMatch(
      /annualized return|backtest return|uptime percentage/i,
    );
    expect(JSON.stringify(site.selectedWork)).not.toContain('"todos"');
    expect(
      site.selectedWork.find((item) => item.title === "PageScript")?.highlights.join(" "),
    ).toContain("checked-in revenue-map fixture");
    expect(
      site.selectedWork.find((item) => item.title === "PageScript")?.highlights.join(" "),
    ).toContain("64.08% fewer authored-artifact tokens");
  });

  it("contains no empty or malformed configured links", () => {
    const hrefs = [
      ...site.links.map((link) => link.href),
      ...site.selectedWork.flatMap((item) =>
        item.links.map((link) => link.href),
      ),
    ];

    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(href).toMatch(/^(https:\/\/|mailto:|\/)/);
      expect(href).not.toContain("#");
    }
  });
});
