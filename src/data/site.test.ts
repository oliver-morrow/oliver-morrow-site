import { describe, expect, it } from "vitest";
import { site } from "./site";

describe("site content", () => {
  it("uses the recommended positioning and accurate availability copy", () => {
    expect(site.headline).toBe(
      "I build data tools, compilers, and infrastructure.",
    );
    expect(site.introduction).toBe(
      "Computer Engineering student at Queen’s (April 2027). Data & AI Engineering co-op at Sanofi in Toronto.",
    );
    expect(site.availability).toContain("May 2027 (Toronto / GTA or remote)");
    expect(site.availability).toContain("data engineering");
    expect(site.education).toContain("April 2027");
    expect(site.whatIBuild).toContain("PageScript");
    expect(site.whatIBuild).toContain("Proxmox HA home lab");
    expect(site.whatIBuild).not.toMatch(/market data|Cyclicus/i);
    expect(`${site.introduction} ${site.whatIBuild}`).not.toMatch(
      /\bintersection\b|\bstreamline\b|\bpassionate\b|\binnovative\b|survives contact|trade-offs behind/i,
    );
  });

  it("presents projects in the recommended order and positions PageScript honestly", () => {
    expect(site.selectedWork.map((item) => item.title)).toEqual([
      "PageScript",
      "Proxmox High-Availability Cluster",
      "Noteworthy",
    ]);
    expect(JSON.stringify(site.selectedWork)).not.toMatch(
      /annualized return|backtest return|uptime percentage/i,
    );
    expect(JSON.stringify(site.selectedWork)).not.toContain('"todos"');

    const pageScript = site.selectedWork.find(
      (item) => item.title === "PageScript",
    );
    expect(pageScript?.summary).toMatch(/^Designed/);
    expect(pageScript?.summary).toContain("no source-authored inline JavaScript");
    expect(pageScript?.highlights.join(" ")).toContain("AI-assisted");
    expect(pageScript?.links.map((link) => link.href)).toContain(
      "https://blog.olivermorrow.com/posts/building-pagescript/",
    );

    const proxmox = site.selectedWork.find((item) =>
      item.title.startsWith("Proxmox"),
    );
    expect(proxmox?.highlights.join(" ")).toContain("118 seconds");

    const noteworthy = site.selectedWork.find(
      (item) => item.title === "Noteworthy",
    );
    expect(noteworthy?.highlights.join(" ")).toContain("30 concurrent users");
    expect(noteworthy?.highlights.join(" ")).toContain(
      "durable persistence remains an explicit constraint",
    );
    expect(noteworthy?.highlights.join(" ")).toContain("lost when the server restarts");
  });

  it("publishes the sanitized experience evidence without internal names", () => {
    const sanofi = site.experience.find((item) => item.organization === "Sanofi");

    expect(sanofi?.highlights).toHaveLength(5);
    expect(sanofi?.highlights?.join(" ")).toContain("1,500 queries per week");
    expect(sanofi?.highlights?.join(" ")).toContain("45 to 30 minutes");
    expect(site.experience.map((item) => item.organization)).not.toContain(
      "Queen’s University Digital Classrooms",
    );
    expect(site.leadership.map((item) => item.role)).toEqual([
      "IT Operations Team Manager",
      "VP Communications",
    ]);
    expect(JSON.stringify(site)).not.toMatch(/License Patrol|Digital Portfolio/i);
  });

  it("leads skills with the resume-backed stack and keeps Rust project-scoped", () => {
    expect(site.technicalFocus[0]).toEqual({
      label: "Languages",
      items: ["Python", "SQL", "C", "C++", "Bash", "Java"],
    });
    expect(site.technicalFocus[1].items).toContain(
      "Snowflake (Cortex, Snowpark, Streamlit, Tasks)",
    );
    expect(JSON.stringify(site.technicalFocus)).not.toMatch(
      /\bRust\b|\bGo\b|BERT|Machine learning/i,
    );
    expect(site.lookingFor).toHaveLength(4);
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
