# Quiet Ledger Visual Repair Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic rounded-sheet experiment with the approved edge-to-edge Quiet Ledger visual system while preserving the homepage's factual content and server-rendered structure.

**Architecture:** Keep the existing React component tree and typed content module unchanged. Define the visual contract in the existing Vitest CSS test, use one local SVG asset for deterministic paper fibres, and implement the complete surface, typography, grid, interaction, and responsive behaviour in `src/app/globals.css`.

**Tech Stack:** Next.js 16, React 19 server components, TypeScript, CSS, local SVG asset, Vitest

## Global Constraints

- Preserve the current factual copy and content order.
- Do not introduce a client component, runtime dependency, remote texture, animation, card, badge, project image, or marketing call to action.
- Use one continuous warm-charcoal surface with no floating outer sheet, rounded outer container, outer border, or drop shadow.
- Use amber only for section wayfinding and keyboard focus.
- Keep the separate blog out of scope.
- Preserve unrelated worktree changes, including the existing `.gitignore` edit.

---

## File Map

- Modify `src/app/globals.test.ts`: encode stable Quiet Ledger surface and layout invariants without snapshotting incidental pixel values.
- Create `public/textures/charcoal-paper.svg`: provide a small, deterministic, pointer-inert local fibre texture with no remote request.
- Modify `src/app/globals.css`: implement the approved palette, continuous surface, typography, metadata grid, links, focus, and responsive behaviour.
- Do not modify `src/app/page.tsx`, `src/components/*.tsx`, or `src/data/site.ts`; their current structure and content already satisfy the design.

### Task 1: Replace the rounded-sheet test contract

**Files:**
- Modify: `src/app/globals.test.ts`

**Interfaces:**
- Consumes: raw CSS text from `src/app/globals.css`
- Produces: a stable visual contract for the local texture, continuous surface, amber wayfinding, and non-card shell

- [ ] **Step 1: Replace the current elevated-document test with the Quiet Ledger contract**

Use this complete test file:

```ts
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
```

- [ ] **Step 2: Run the focused test and verify it fails for the old direction**

Run: `npm test -- src/app/globals.test.ts`

Expected: FAIL because the current CSS uses an embedded dot image, defines a `--sheet` surface, gives `.site-shell` a background, border, radius, and shadow, and does not define `--accent`.

- [ ] **Step 3: Commit the red test only if the file was already tracked; otherwise keep it with Task 2**

`src/app/globals.test.ts` is currently untracked, so do not create a test-only commit that would separate it from the implementation history. Continue directly to Task 2.

### Task 2: Implement the Quiet Ledger surface and layout

**Files:**
- Create: `public/textures/charcoal-paper.svg`
- Modify: `src/app/globals.css`
- Test: `src/app/globals.test.ts`

**Interfaces:**
- Consumes: the existing class names `.site-shell`, `.site-header`, `.introduction`, `.section`, `.work-list`, `.work-item`, `.metadata`, `.previous-list`, and `.site-footer`
- Produces: `/textures/charcoal-paper.svg` and the complete Quiet Ledger CSS contract

- [ ] **Step 1: Create the local texture asset**

Create `public/textures/charcoal-paper.svg` as the following 192-by-192 transparent tile:

- Three groups of short, irregular path strokes at opacities between `0.025` and `0.075`
- Warm light fibres using `#f3ead8`
- Dark fibres using `#090a08`
- Stroke widths between `0.35` and `0.8`
- No circles, blur, filter, embedded raster, script, or external reference
- At least 40 non-parallel strokes with varied lengths and positions so the result does not read as dots or ruled lines

The file begins with:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <g fill="none" stroke="#f3ead8" stroke-linecap="round" stroke-width=".55" opacity=".055">
    <path d="M7 18l8-1M31 9l5 2M55 24l11-2M89 13l7 1M118 29l9-3M151 11l13 2"/>
    <path d="M18 48l6 1M43 39l10-2M72 57l5-1M101 43l12 2M137 52l8-3M169 35l6 1"/>
    <path d="M9 79l11 2M37 70l7-3M64 91l9 1M96 74l6-2M126 88l13 2M161 71l8-1"/>
    <path d="M22 113l9-2M51 103l5 2M78 122l12-1M111 108l7 3M143 119l10-2M174 101l5 1"/>
    <path d="M8 148l7-2M35 137l12 1M69 156l6-3M99 141l9 2M131 160l8-1M159 143l14 3"/>
    <path d="M20 181l10-1M53 172l8 2M86 185l5-2M116 174l11 1M148 187l7-3M177 169l6 2"/>
  </g>
  <g fill="none" stroke="#f3ead8" stroke-linecap="round" stroke-width=".35" opacity=".028">
    <path d="M12 31l3 5M28 22l2-4M48 15l4 6M75 32l2-5M104 19l3 4M132 34l2-6M176 20l3 5"/>
    <path d="M5 61l4 3M30 54l2 5M58 45l3-4M83 63l2 6M115 55l4-5M148 63l2 4M183 49l3-3"/>
    <path d="M18 96l2 5M46 85l4 3M74 102l3-6M106 91l2 4M139 99l4-3M174 88l2 6"/>
    <path d="M6 126l3-5M33 117l2 4M62 133l4-6M92 119l3 5M122 131l2-4M153 128l4 6M184 116l2-3"/>
    <path d="M17 160l2 6M47 149l3-4M79 169l2 5M108 155l4-6M141 171l2 4M171 156l3-5"/>
  </g>
  <g fill="none" stroke="#090a08" stroke-linecap="round" stroke-width=".8" opacity=".07">
    <path d="M17 6l9 2M68 7l6-1M111 6l12 3M160 6l8-2"/>
    <path d="M3 42l10-2M38 31l7 2M79 40l11-3M123 39l6 1M157 45l12-2"/>
    <path d="M23 67l5-2M52 77l13 3M91 66l8 1M134 73l10-3M178 65l7 2"/>
    <path d="M4 105l8 2M40 96l11-1M82 109l7-3M119 98l12 2M164 110l9-1"/>
    <path d="M15 136l12 3M57 128l6-2M94 134l10 1M138 140l7-3M181 132l5 2"/>
    <path d="M4 176l9-3M39 183l12 2M72 176l8-1M126 183l11-3M164 178l9 2"/>
  </g>
</svg>
```

- [ ] **Step 2: Replace the surface tokens and full-page treatment**

In `src/app/globals.css`:

- Remove `--sheet`.
- Set `--surface` to the warm charcoal `#1b1c19`.
- Keep warm off-white primary text and warm-grey secondary text.
- Add `--accent: #c6a663`.
- Keep `html` and `body` on the same `--surface` colour.
- Give `body` a minimum viewport height and no visible outer object.
- Use `body::before` as a fixed, full-viewport, `pointer-events: none` texture layer with `background-image: url("/textures/charcoal-paper.svg")`, a 192px tile size, and opacity low enough that text regions remain calm.
- Keep content above the texture with an isolated stacking context and a positive layer on `.site-shell`.

- [ ] **Step 3: Replace the floating shell with the document column**

Set `.site-shell` to:

```css
.site-shell {
  position: relative;
  z-index: 1;
  width: min(calc(100% - 3rem), var(--content-width));
  margin-inline: auto;
  padding-block: clamp(2rem, 5vw, 3.5rem);
}
```

Do not add a shell background, border, radius, or shadow.

- [ ] **Step 4: Tune typography, hierarchy, and vertical rhythm**

- Keep Geist and the existing sans-serif fallback stack.
- Use a `1rem` base size and `1.65` body line height.
- Keep the header name at `1rem` with a stronger weight than navigation.
- Give the introduction a `38rem` maximum measure, `clamp(1.25rem, 3vw, 1.5rem)` size, and `clamp(4.5rem, 12vw, 7.5rem)` bottom margin.
- Render section headings in the amber accent at `0.75rem`, weight `650`, uppercase, with `0.11em` tracking.
- Keep work titles at `1rem`, weight `650`, and descriptions in `--muted`.
- Use consistent hairline rules on the header, sections, and footer.

- [ ] **Step 5: Preserve and refine the shared metadata grid**

- Keep `.work-item` and `.previous-list li` on the same `8rem minmax(0, 1fr)` desktop grid.
- Keep a consistent `1.5rem` gap.
- Align metadata optically with the title rather than centring it vertically.
- Increase row rhythm enough to distinguish records without cards or backgrounds.
- At the existing `36rem` breakpoint, collapse both grids to one column with the metadata immediately above its record.

- [ ] **Step 6: Implement restrained links and focus**

- Keep links underlined by default with a muted underline colour.
- On hover, strengthen the underline and use a subtle warm colour shift without transforms.
- Use `--accent` for the two-pixel `:focus-visible` outline.
- Do not add animation; any transition should be omitted because the effect is not necessary.

- [ ] **Step 7: Run the focused test and make the contract green**

Run: `npm test -- src/app/globals.test.ts`

Expected: PASS, 3 tests.

- [ ] **Step 8: Run the complete automated suite**

Run: `npm test`

Expected: PASS for all existing content, redirect, markup, data, and CSS tests.

Run: `npm run lint`

Expected: exit code 0 with no lint errors.

Run: `npm run build`

Expected: exit code 0 and a successful Next.js production build.

- [ ] **Step 9: Commit the visual implementation without unrelated files**

```bash
git add src/app/globals.css src/app/globals.test.ts public/textures/charcoal-paper.svg
git commit -m "style: implement quiet ledger visual system"
```

Do not stage `.gitignore`, `.superpowers/`, or any other unrelated file.

### Task 3: Verify the rendered result and make bounded visual adjustments

**Files:**
- Modify if needed: `src/app/globals.css`
- Modify if the texture itself is the issue: `public/textures/charcoal-paper.svg`
- Test: `src/app/globals.test.ts`

**Interfaces:**
- Consumes: the built homepage at `/`
- Produces: verified desktop, mobile, zoom, focus, and overflow behaviour matching the approved Quiet Ledger mockup

- [ ] **Step 1: Inspect the standard desktop layout**

Start the development server with `npm run dev`. Open `/` at 1440-by-1000 and verify:

- No visible outer card or sheet boundary
- The page reads as one warm-charcoal field
- The grain is perceptible on inspection but subordinate to text
- The introduction has presence without reading as a marketing hero
- Selected Work and Previously share one precise metadata grid
- Section labels use restrained amber without becoming decorative

- [ ] **Step 2: Inspect the narrow layout**

Use a viewport at 390-by-844 and verify:

- Header links wrap without overlap or a menu
- Metadata sits immediately above its associated content
- No horizontal scrollbar appears
- Footer items wrap or stack cleanly
- Texture does not become more prominent on the smaller surface

- [ ] **Step 3: Inspect accessibility states**

- Navigate every link using the keyboard and confirm the amber focus outline remains visible and unclipped.
- Verify the page at 200% zoom without horizontal scrolling.
- Verify reduced-motion mode introduces no behaviour change because the design contains no animation.
- Check that the browser console has no application errors.

- [ ] **Step 4: Make only bounded token or spacing adjustments**

If review identifies an issue, adjust only the responsible surface token, texture opacity, measure, spacing value, or breakpoint rule. Do not add new components, layout regions, decorative devices, or content.

After any change, rerun:

```bash
npm test -- src/app/globals.test.ts
npm run lint
npm run build
```

Expected: all commands exit successfully.

- [ ] **Step 5: Commit any verified polish separately**

If Task 3 required changes:

```bash
git add src/app/globals.css public/textures/charcoal-paper.svg
git commit -m "style: refine quiet ledger rendering"
```

If no changes were required, do not create an empty commit.
