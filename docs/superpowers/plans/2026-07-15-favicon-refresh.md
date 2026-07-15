# Favicon Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the obsolete cyan favicon with a crisp charcoal-and-amber geometric O that remains legible at browser-tab sizes.

**Architecture:** Keep Next.js's existing file-based icon route and replace only the SVG asset. Add a focused asset contract test so the approved palette and geometry cannot regress to the old promotional mark.

**Tech Stack:** Next.js 16 App Router, SVG, TypeScript, Vitest

## Global Constraints

- The source asset remains a 32 by 32 SVG at `src/app/icon.svg`.
- The background color is exactly `#1b1c19`.
- The geometric O color is exactly `#c6a663`.
- The icon contains no text glyph, rounded card, decorative frame, texture, gradient, shadow, or additional lettering.
- The existing `/icon.svg` metadata route remains unchanged.

---

## File Map

- Create `src/app/icon.test.ts`: asset-level regression contract for palette and geometry.
- Modify `src/app/icon.svg`: full-bleed charcoal background and geometric amber O.

### Task 1: Replace the legacy favicon

**Files:**
- Create: `src/app/icon.test.ts`
- Modify: `src/app/icon.svg`

**Interfaces:**
- Consumes: Next.js App Router file-based icon metadata convention.
- Produces: `/icon.svg`, a static 32 by 32 SVG favicon.

- [ ] **Step 1: Write the failing asset contract**

Create `src/app/icon.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the focused test and verify the intended failure**

Run:

```bash
npm test -- src/app/icon.test.ts
```

Expected: FAIL because the current SVG uses `#000000`, `#06b6d4`, rounded rectangles, and a text glyph instead of the approved mark.

- [ ] **Step 3: Replace the icon with the approved geometry**

Replace `src/app/icon.svg` with:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#1b1c19"/>
  <circle cx="16" cy="16" r="9" fill="none" stroke="#c6a663" stroke-width="3"/>
</svg>
```

The 3-pixel source stroke renders as 1.5 pixels at 16 by 16, keeping the O distinct without becoming heavy.

- [ ] **Step 4: Run the focused test and verify it passes**

Run:

```bash
npm test -- src/app/icon.test.ts
```

Expected: PASS, one test file and one test.

- [ ] **Step 5: Run the complete automated verification suite**

Run each command independently:

```bash
npm run lint
npx tsc --noEmit --pretty false
npm test
npm run build
```

Expected: all commands exit 0; the build output includes the static `/icon.svg` route.

- [ ] **Step 6: Verify the served asset at favicon sizes**

Run the development server and open `http://127.0.0.1:3000/icon.svg`. Inspect the SVG at 32 by 32 and 16 by 16 pixels.

Expected: a centered amber ring remains distinct on the charcoal square at both sizes, with no cyan, rounded frame, or text-rendering variation.

- [ ] **Step 7: Commit the implementation**

```bash
git add src/app/icon.svg src/app/icon.test.ts
git commit -m "style: align favicon with quiet ledger theme"
```
