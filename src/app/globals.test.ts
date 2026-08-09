import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const globalsCss = readFileSync(
  fileURLToPath(new URL("./globals.css", import.meta.url)),
  "utf8",
);
const paperTexture = readFileSync(
  fileURLToPath(
    new URL("../../public/textures/charcoal-paper.svg", import.meta.url),
  ),
  "utf8",
);

describe("Quiet Ledger visual surface", () => {
  it("uses a local, pointer-inert paper texture", () => {
    expect(globalsCss).toMatch(/body::before\s*{/);
    expect(globalsCss).toMatch(/pointer-events:\s*none/);
    expect(globalsCss).toMatch(
      /background-image:\s*url\("\/textures\/charcoal-paper\.svg"\)/,
    );
    expect(globalsCss).not.toMatch(/https?:\/\//);
  });

  it("uses continuous tonal grain rather than discrete sprinkle marks", () => {
    expect(paperTexture).toMatch(/<feTurbulence\b/);
    expect(paperTexture).toMatch(/stitchTiles="stitch"/);
    expect(paperTexture).not.toMatch(/<(?:path|circle)\b/);
  });

  it("balances perceptible grain with a skimmable long-form rhythm", () => {
    expect(globalsCss).toMatch(/body::before\s*{[^}]*opacity:\s*0\.42/);
    expect(globalsCss).toMatch(
      /main\s*{[^}]*padding-block:\s*clamp\(4rem,\s*9vw,\s*8rem\)/,
    );
    expect(globalsCss).toMatch(
      /\.hero\s*{[^}]*padding-bottom:\s*clamp\(5rem,\s*10vw,\s*8rem\)/,
    );
    expect(globalsCss).toMatch(
      /\.section\s*{[^}]*margin-top:\s*clamp\(4\.5rem,\s*9vw,\s*7\.5rem\)/,
    );
    expect(globalsCss).toMatch(
      /@media \(max-width:\s*48rem\)[\s\S]*main\s*{[^}]*padding-block:\s*4\.5rem/,
    );
  });

  it("keeps the page as one continuous surface", () => {
    const shellRule = globalsCss.match(/\.site-shell\s*{([^}]*)}/)?.[1] ?? "";

    expect(shellRule).toMatch(/width:\s*min\(/);
    expect(shellRule).toMatch(/margin-inline:\s*auto/);
    expect(shellRule).not.toMatch(/background\s*:/);
    expect(shellRule).not.toMatch(/border(?:-radius)?\s*:/);
    expect(shellRule).not.toMatch(/box-shadow\s*:/);
  });

  it("reserves amber for wayfinding and keyboard focus", () => {
    expect(globalsCss).toMatch(/--accent:\s*#[0-9a-f]{6}/i);
    expect(globalsCss).toMatch(/a:focus-visible\s*{[^}]*var\(--accent\)/);
    expect(globalsCss).toMatch(/\.section h2\s*{[^}]*var\(--accent\)/);
  });

  it("uses restrained evidence-list markers", () => {
    expect(globalsCss).toMatch(/\.evidence-list\s*{[^}]*list-style:\s*disc/);
    expect(globalsCss).toMatch(/\.evidence-list li::marker\s*{/);
    expect(globalsCss).not.toContain("↳");
  });

  it("uses single list rules instead of stacked section framing", () => {
    const sectionRule = globalsCss.match(/\.section\s*{([^}]*)}/)?.[1] ?? "";

    expect(sectionRule).not.toMatch(/border-top/);
    expect(globalsCss).toMatch(/\.split-section\s*{[^}]*border-top:/);
    expect(globalsCss).toMatch(/\.work-list\s*{[^}]*border-top:/);
    expect(globalsCss).toMatch(/\.work-item \+ \.work-item\s*{[^}]*border-top:/);
    expect(globalsCss).toMatch(/\.experience-list\s*{[^}]*border-top:/);
    expect(globalsCss).not.toMatch(/\.experience-list li \+ li\s*{[^}]*border-top:/);
    expect(globalsCss).not.toContain("section-heading-row");
  });
});
