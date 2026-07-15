import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const icon = readFileSync(
  fileURLToPath(new URL("./icon.svg", import.meta.url)),
  "utf8",
);

describe("site favicon", () => {
  it("uses the restrained charcoal-and-amber geometric mark", () => {
    expect(icon).toMatch(/<svg[^>]*width="32"[^>]*height="32"/);
    expect(icon).toContain('fill="#1b1c19"');
    expect(icon).toContain('stroke="#c6a663"');
    expect(icon).toMatch(/<circle\b/);
    expect(icon).not.toMatch(/#06b6d4/i);
    expect(icon).not.toMatch(/<text\b|\brx=|<linearGradient\b|<filter\b/i);
  });
});
