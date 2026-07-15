import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const globalsCss = readFileSync(
  fileURLToPath(new URL("./globals.css", import.meta.url)),
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

  it("keeps the page as one continuous surface", () => {
    const shellRule = globalsCss.match(/\.site-shell\s*{([^}]*)}/s)?.[1] ?? "";

    expect(shellRule).toMatch(/width:\s*min\(/);
    expect(shellRule).toMatch(/margin-inline:\s*auto/);
    expect(shellRule).not.toMatch(/background\s*:/);
    expect(shellRule).not.toMatch(/border(?:-radius)?\s*:/);
    expect(shellRule).not.toMatch(/box-shadow\s*:/);
  });

  it("reserves amber for wayfinding and keyboard focus", () => {
    expect(globalsCss).toMatch(/--accent:\s*#[0-9a-f]{6}/i);
    expect(globalsCss).toMatch(/a:focus-visible\s*{[^}]*var\(--accent\)/s);
    expect(globalsCss).toMatch(/\.section h2\s*{[^}]*var\(--accent\)/s);
  });
});
