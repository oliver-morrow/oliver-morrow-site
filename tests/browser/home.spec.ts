import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const viewports = [
  { name: "320", width: 320, height: 568 },
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1440", width: 1440, height: 1000 },
];

for (const viewport of viewports) {
  test(`portfolio reflows cleanly at ${viewport.name}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h2")).toHaveText([
      "At work",
      "Projects",
      "Earlier work",
      "Writing",
    ]);
    await expect(page.locator("main")).toHaveAttribute("id", "main-content");

    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth ===
          document.documentElement.clientWidth,
      ),
    ).toBe(true);

    const headingLevels = await page.locator("h1, h2, h3").evaluateAll((nodes) =>
      nodes.map((node) => Number(node.tagName.slice(1))),
    );
    expect(
      headingLevels.every(
        (level, index) => index === 0 || level <= headingLevels[index - 1] + 1,
      ),
    ).toBe(true);

    const h1LineCount = await page.locator("h1").evaluate((heading) => {
      const styles = getComputedStyle(heading);
      return heading.getBoundingClientRect().height / Number.parseFloat(styles.lineHeight);
    });
    expect(h1LineCount).toBeLessThanOrEqual(2.05);

    const navigationRows = await page
      .getByRole("navigation", { name: "Primary" })
      .locator("a")
      .evaluateAll((links) => new Set(links.map((link) => link.getBoundingClientRect().top)).size);
    expect(navigationRows).toBeLessThanOrEqual(2);

    if (viewport.width === 390) {
      expect(await page.locator("header").evaluate((section) => section.getBoundingClientRect().bottom)).toBeLessThanOrEqual(viewport.height);
      expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThanOrEqual(7200);
    }

    if (viewport.width === 1440) {
      expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThanOrEqual(5500);
    }

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

test("portfolio skip link and Noteworthy scope are preserved", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();

  const html = await page.content();
  expect(html).toContain("https://github.com/oliver-morrow/Noteworthy");
  expect(html).not.toContain("noteworthy.howdoesthiseven.work");
});
