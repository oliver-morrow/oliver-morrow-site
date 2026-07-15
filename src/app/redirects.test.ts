import { describe, expect, it } from "vitest";
import nextConfig from "../../next.config";

describe("legacy redirects", () => {
  it("permanently redirects every removed content route", async () => {
    const redirects = await nextConfig.redirects?.();
    expect(redirects).toEqual([
      { source: "/work", destination: "/#work", permanent: true },
      { source: "/case-studies", destination: "/#work", permanent: true },
      { source: "/about", destination: "/", permanent: true },
    ]);
  });
});
