# Quiet Ledger Density Calibration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the continuous paper texture perceptible and reduce the four oversized vertical gaps to the approved measurements.

**Architecture:** Keep the existing texture asset, page markup, components, typography, and grid unchanged. Extend the CSS contract test with exact calibration values, then change only six spacing/opacity declarations in `src/app/globals.css`.

**Tech Stack:** CSS, Vitest, Next.js 16 production rendering

## Global Constraints

- Texture opacity is `0.42` and retains `soft-light` blending.
- Desktop gaps target 80px, 88px, 52px, and 80px at a 1440px viewport.
- Mobile main padding is 52px above and 60px below; mobile introduction bottom margin is 60px.
- Do not change content, components, typography, colours, texture construction, grids, links, focus, dependencies, or blog files.
- Preserve the existing unrelated `.gitignore` change and untracked `.superpowers/` directory.

---

### Task 1: Calibrate texture strength and vertical rhythm

**Files:**
- Modify: `src/app/globals.test.ts`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: the current `body::before`, `main`, `.introduction`, `.section`, and mobile media-query rules
- Produces: exact source contracts that render to the approved desktop and mobile measurements

- [ ] **Step 1: Add the failing calibration contract**

Add this test inside `describe("Quiet Ledger visual surface", ...)` in `src/app/globals.test.ts`:

```ts
it("balances perceptible grain with compact vertical rhythm", () => {
  expect(globalsCss).toMatch(/body::before\s*{[^}]*opacity:\s*0\.42/s);
  expect(globalsCss).toMatch(
    /main\s*{[^}]*padding-block:\s*clamp\(3\.5rem,\s*7vw,\s*5rem\)/s,
  );
  expect(globalsCss).toMatch(
    /\.introduction\s*{[^}]*margin:\s*0 0 clamp\(3\.75rem,\s*8vw,\s*5\.5rem\)/s,
  );
  expect(globalsCss).toMatch(/\.section\s*{[^}]*margin-top:\s*3\.25rem/s);
  expect(globalsCss).toMatch(
    /@media \(max-width:\s*36rem\)[\s\S]*main\s*{[^}]*padding-block:\s*3\.25rem 3\.75rem/s,
  );
  expect(globalsCss).toMatch(
    /@media \(max-width:\s*36rem\)[\s\S]*\.introduction\s*{[^}]*margin-bottom:\s*3\.75rem/s,
  );
});
```

- [ ] **Step 2: Run the focused test and verify the approved calibration is absent**

Run: `npm test -- src/app/globals.test.ts`

Expected: FAIL because the CSS still contains opacity `0.28`, desktop main padding `clamp(4.5rem, 10vw, 7rem)`, introduction margin `clamp(4.5rem, 12vw, 7.5rem)`, section margin `4rem`, and larger mobile values.

- [ ] **Step 3: Apply only the approved CSS substitutions**

In `src/app/globals.css`, apply this exact diff:

```diff
-  opacity: 0.28;
+  opacity: 0.42;

 main {
-  padding-block: clamp(4.5rem, 10vw, 7rem);
+  padding-block: clamp(3.5rem, 7vw, 5rem);
 }

 .introduction {
-  margin: 0 0 clamp(4.5rem, 12vw, 7.5rem);
+  margin: 0 0 clamp(3.75rem, 8vw, 5.5rem);
 }

 .section {
-  margin-top: 4rem;
+  margin-top: 3.25rem;
 }

 @media (max-width: 36rem) {
   main {
-    padding-block: 3.75rem 4.5rem;
+    padding-block: 3.25rem 3.75rem;
   }

   .introduction {
-    margin-bottom: 4.5rem;
+    margin-bottom: 3.75rem;
   }
 }
```

- [ ] **Step 4: Run the focused and complete automated checks**

Run: `npm test -- src/app/globals.test.ts`

Expected: PASS, 5 tests.

Run: `npm test && npm run lint && npm run build`

Expected: 12 tests pass, lint exits 0, and the Next.js production build succeeds.

- [ ] **Step 5: Verify the actual rendered measurements**

Run the production server and inspect `/` at 1440×1000. Read the relevant bounding rectangles and verify:

```text
header → introduction: 80px
introduction → Selected Work: 88px
Selected Work → Previously: 52px
Previously → footer: 80px
```

Inspect at 390×844 and verify `document.documentElement.scrollWidth === 390`.

- [ ] **Step 6: Commit only the calibration files**

```bash
git add src/app/globals.css src/app/globals.test.ts
git commit -m "style: rebalance quiet ledger texture and spacing"
```
