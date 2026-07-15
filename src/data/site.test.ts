import { describe, expect, it } from "vitest";
import { site } from "./site";

describe("site content", () => {
  it("keeps the homepage deliberately small", () => {
    expect(site.introduction).toBe(
      "I'm a computer engineering student at Queen's University, currently working on data and AI systems at Sanofi.",
    );
    expect(site.selectedWork).toHaveLength(3);
    expect(site.selectedWork.map((item) => item.title)).toEqual([
      "Data and AI systems",
      "Noteworthy",
      "Proxmox HA Cluster",
    ]);
  });

  it("contains no empty or malformed configured links", () => {
    const hrefs = [
      ...site.links.map((link) => link.href),
      ...site.selectedWork.flatMap((item) => (item.href ? [item.href] : [])),
    ];
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(href).toMatch(/^(https:\/\/|mailto:)/);
      expect(href).not.toContain("#");
    }
  });
});
