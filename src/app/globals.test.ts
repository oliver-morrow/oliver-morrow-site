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

  it("balances perceptible grain with compact vertical rhythm", () => {
    expect(globalsCss).toMatch(/body::before\s*{[^}]*opacity:\s*0\.42/);
    expect(globalsCss).toMatch(
      /main\s*{[^}]*padding-block:\s*clamp\(3\.5rem,\s*7vw,\s*5rem\)/,
    );
    expect(globalsCss).toMatch(
      /\.introduction\s*{[^}]*margin:\s*0 0 clamp\(3\.75rem,\s*8vw,\s*5\.5rem\)/,
    );
    expect(globalsCss).toMatch(
      /\.section\s*{[^}]*margin-top:\s*3\.25rem/,
    );
    expect(globalsCss).toMatch(
      /@media \(max-width:\s*36rem\)[\s\S]*main\s*{[^}]*padding-block:\s*3\.25rem 3\.75rem/,
    );
    expect(globalsCss).toMatch(
      /@media \(max-width:\s*36rem\)[\s\S]*\.introduction\s*{[^}]*margin-bottom:\s*3\.75rem/,
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
});
