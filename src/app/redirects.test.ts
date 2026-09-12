import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import nextConfig from "../../next.config";

describe("Cloudflare Pages deployment", () => {
  it("exports static HTML with platform-native legacy redirects", () => {
    expect(nextConfig.output).toBe("export");
    expect(nextConfig.redirects).toBeUndefined();

    const redirects = readFileSync(
      fileURLToPath(new URL("../../public/_redirects", import.meta.url)),
      "utf8",
    );
    expect(redirects.trim().split("\n")).toEqual([
      "/work /#work 301",
      "/case-studies /#work 301",
      "/about /#about 301",
      "/cyclicus /cyclicus/ 301",
    ]);
  });
});
