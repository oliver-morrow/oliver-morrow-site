# Restrained Main Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the feature-heavy portfolio with a single server-rendered, factual professional page that works without client-side JavaScript.

**Architecture:** Keep Next.js App Router, but reduce the application to five small server components fed by one typed data module. Global CSS owns the charcoal document surface, typography, grain, responsive behavior, and interaction states; `next.config.ts` owns redirects for removed routes.

**Tech Stack:** Next.js 16, React 19 server components, TypeScript, Tailwind CSS 4, Vitest for focused content/markup contracts

---

## File Map

- Create `oliver-morrow-site/src/data/site.ts`: minimal typed content and optional-link model.
- Create `oliver-morrow-site/src/components/SiteHeader.tsx`: name and configured navigation links.
- Create `oliver-morrow-site/src/components/Introduction.tsx`: factual biography.
- Create `oliver-morrow-site/src/components/SelectedWork.tsx`: three semantic work rows.
- Create `oliver-morrow-site/src/components/Previously.tsx`: compact chronology.
- Create `oliver-morrow-site/src/components/SiteFooter.tsx`: location, year, Writing link.
- Create `oliver-morrow-site/src/components/HomePage.test.tsx`: server-markup contract.
- Create `oliver-morrow-site/src/data/site.test.ts`: content invariants and URL validation.
- Create `oliver-morrow-site/vitest.config.ts`: focused test configuration.
- Replace `oliver-morrow-site/src/app/page.tsx`: compose the five server components.
- Replace `oliver-morrow-site/src/app/layout.tsx`: metadata, local Geist Sans, simplified shell.
- Replace `oliver-morrow-site/src/app/globals.css`: shared document tokens and responsive design.
- Modify `oliver-morrow-site/src/app/sitemap.ts`: root URL only.
- Modify `oliver-morrow-site/next.config.ts`: permanent legacy redirects; remove telemetry env.
- Modify `oliver-morrow-site/package.json` and lockfile: test script; remove unused runtime dependencies and texture hooks.
- Delete obsolete routes, API, components, hooks, search helpers, types, hero data/assets, and manifest script after replacement is green.

### Task 1: Establish the typed content contract

**Files:**
- Create: `oliver-morrow-site/vitest.config.ts`
- Create: `oliver-morrow-site/src/data/site.test.ts`
- Create: `oliver-morrow-site/src/data/site.ts`
- Modify: `oliver-morrow-site/package.json`
- Modify: `oliver-morrow-site/package-lock.json`

- [ ] **Step 1: Install the test runner and add the test script**

Run:

```bash
cd oliver-morrow-site
npm install --save-dev vitest
npm pkg set scripts.test="vitest run"
```

Expected: `vitest` is added to `devDependencies`; the lockfile changes; `npm test` is available.

- [ ] **Step 2: Add the focused Vitest configuration**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: { "@": new URL("./src", import.meta.url).pathname },
  },
});
```

- [ ] **Step 3: Write the failing content-contract test**

Create `src/data/site.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { site } from "./site";

describe("site content", () => {
  it("keeps the homepage deliberately small", () => {
    expect(site.introduction).toBe(
      "Oliver Morrow is a computer engineering student at Queen's University, currently working on data and AI systems at Sanofi.",
    );
    expect(site.selectedWork).toHaveLength(3);
    expect(site.selectedWork.map((item) => item.title)).toEqual([
      "Data and AI systems",
      "Noteworthy",
      "Proxmox HA Cluster",
    ]);
  });

  it("contains no empty or malformed configured links", () => {
    const hrefs = [
      ...site.links.map((link) => link.href),
      ...site.selectedWork.flatMap((item) => item.href ? [item.href] : []),
    ];
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(href).toMatch(/^(https:\/\/|mailto:)/);
      expect(href).not.toContain("#");
    }
  });
});
```

- [ ] **Step 4: Run the test and verify the intended failure**

Run: `npm test -- src/data/site.test.ts`

Expected: FAIL because `src/data/site.ts` does not exist.

- [ ] **Step 5: Implement the minimal typed content module**

Create `src/data/site.ts`:

```ts
export type SiteLink = {
  label: string;
  href: `https://${string}` | `mailto:${string}`;
};

export type WorkItem = {
  context: string;
  title: string;
  description: string;
  href?: `https://${string}`;
};

export type PreviousItem = {
  period: string;
  organization: string;
  role: string;
};

export const site = {
  name: "Oliver Morrow",
  introduction:
    "Oliver Morrow is a computer engineering student at Queen's University, currently working on data and AI systems at Sanofi.",
  location: "Toronto / Kingston, Canada",
  links: [
    { label: "Writing", href: "https://blog.olivermorrow.com" },
    { label: "GitHub", href: "https://github.com/oliver-morrow" },
    { label: "LinkedIn", href: "https://linkedin.com/in/oliver-morrow" },
    { label: "Email", href: "mailto:me@olivermorrow.ca" },
  ],
  selectedWork: [
    {
      context: "Sanofi · 2025—",
      title: "Data and AI systems",
      description:
        "I work on semantic models and agent workflows that make governed internal data easier to use. Much of the work is in the reliability, business logic, and data access behind the interface.",
    },
    {
      context: "Personal project",
      title: "Noteworthy",
      description:
        "A collaborative note-taking platform built across C++, Qt, WebAssembly, Docker, and Nginx.",
      href: "https://www.noteworthy.howdoesthiseven.work",
    },
    {
      context: "Homelab",
      title: "Proxmox HA Cluster",
      description:
        "A three-node cluster for home automation, DNS, and virtual machines, built to explore practical service placement and redundancy.",
      href: "https://blog.olivermorrow.com/posts/home-server",
    },
  ],
  previously: [
    { period: "2025", organization: "Tilray Brands", role: "Data & Analytics Intern" },
    { period: "2024—2025", organization: "Smith Engineering", role: "Electronics I Course Developer" },
    { period: "2024", organization: "Queen's University ITS", role: "Digital Classrooms Intern" },
    { period: "2023", organization: "Legal Aid Ontario", role: "Information Technology Analyst Intern" },
    { period: "Expected 2026", organization: "Queen's University", role: "B.A.Sc. Computer Engineering" },
  ],
} satisfies {
  name: string;
  introduction: string;
  location: string;
  links: SiteLink[];
  selectedWork: WorkItem[];
  previously: PreviousItem[];
};
```

Do not add a Résumé entry until a real current PDF or external URL is supplied.

- [ ] **Step 6: Run the focused test**

Run: `npm test -- src/data/site.test.ts`

Expected: PASS, 2 tests.

- [ ] **Step 7: Commit the content contract**

```bash
git add package.json package-lock.json vitest.config.ts src/data/site.ts src/data/site.test.ts
git commit -m "test: define minimal site content contract"
```

### Task 2: Build semantic server-rendered homepage units

**Files:**
- Create: `oliver-morrow-site/src/components/HomePage.test.tsx`
- Create: `oliver-morrow-site/src/components/SiteHeader.tsx`
- Create: `oliver-morrow-site/src/components/Introduction.tsx`
- Create: `oliver-morrow-site/src/components/SelectedWork.tsx`
- Create: `oliver-morrow-site/src/components/Previously.tsx`
- Create: `oliver-morrow-site/src/components/SiteFooter.tsx`
- Replace: `oliver-morrow-site/src/app/page.tsx`

- [ ] **Step 1: Write the failing server-markup test**

Create `src/components/HomePage.test.tsx`:

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("home page", () => {
  const html = renderToStaticMarkup(<Home />);

  it("renders the approved semantic structure", () => {
    expect(html).toContain("<header");
    expect(html).toContain("<main");
    expect(html).toContain("<h1>Oliver Morrow</h1>");
    expect(html).toContain('id="work"');
    expect(html).toContain("Selected work");
    expect(html).toContain("Previously");
    expect(html).toContain("<footer");
  });

  it("does not render interactive portfolio machinery", () => {
    expect(html).not.toMatch(/<button|<form|<canvas|dialog/i);
    expect(html).not.toMatch(/available for|system status|telemetry|command search/i);
  });

  it("uses descriptive text links", () => {
    expect(html).toContain(">Writing</a>");
    expect(html).toContain(">GitHub</a>");
    expect(html).toContain(">LinkedIn</a>");
    expect(html).toContain(">Email</a>");
  });
});
```

- [ ] **Step 2: Verify the markup contract fails against the old page**

Run: `npm test -- src/components/HomePage.test.tsx`

Expected: FAIL because the old page uses `HeroSection`, lacks the new semantic composition, and includes prohibited presentation language.

- [ ] **Step 3: Implement the header and introduction**

Create `src/components/SiteHeader.tsx`:

```tsx
import { site } from "@/data/site";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <h1>{site.name}</h1>
      <nav aria-label="Primary">
        {site.links.map((link) => (
          <a key={link.label} href={link.href}>{link.label}</a>
        ))}
      </nav>
    </header>
  );
}
```

Create `src/components/Introduction.tsx`:

```tsx
import { site } from "@/data/site";

export default function Introduction() {
  return <p className="introduction">{site.introduction}</p>;
}
```

- [ ] **Step 4: Implement selected work and chronology**

Create `src/components/SelectedWork.tsx`:

```tsx
import { site } from "@/data/site";

export default function SelectedWork() {
  return (
    <section id="work" aria-labelledby="work-heading" className="section">
      <h2 id="work-heading">Selected work</h2>
      <div className="work-list">
        {site.selectedWork.map((item) => (
          <article className="work-item" key={item.title}>
            <p className="metadata">{item.context}</p>
            <div>
              <h3>{item.href ? <a href={item.href}>{item.title}</a> : item.title}</h3>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
```

Create `src/components/Previously.tsx`:

```tsx
import { site } from "@/data/site";

export default function Previously() {
  return (
    <section aria-labelledby="previously-heading" className="section">
      <h2 id="previously-heading">Previously</h2>
      <ol className="previous-list">
        {site.previously.map((item) => (
          <li key={`${item.organization}-${item.period}`}>
            <span className="metadata">{item.period}</span>
            <span><strong>{item.organization}</strong> — {item.role}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 5: Implement the footer and page composition**

Create `src/components/SiteFooter.tsx`:

```tsx
import { site } from "@/data/site";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>{site.location}</span>
      <span>© {new Date().getFullYear()} {site.name}</span>
      <a href="https://blog.olivermorrow.com">Writing</a>
    </footer>
  );
}
```

Replace `src/app/page.tsx`:

```tsx
import Introduction from "@/components/Introduction";
import Previously from "@/components/Previously";
import SelectedWork from "@/components/SelectedWork";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function Home() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main>
        <Introduction />
        <SelectedWork />
        <Previously />
      </main>
      <SiteFooter />
    </div>
  );
}
```

- [ ] **Step 6: Run component and content tests**

Run: `npm test`

Expected: PASS, 5 tests total.

- [ ] **Step 7: Commit the semantic page**

```bash
git add src/app/page.tsx src/components/SiteHeader.tsx src/components/Introduction.tsx src/components/SelectedWork.tsx src/components/Previously.tsx src/components/SiteFooter.tsx src/components/HomePage.test.tsx
git commit -m "feat: build factual single-page portfolio"
```

### Task 3: Apply the charcoal document visual system

**Files:**
- Replace: `oliver-morrow-site/src/app/layout.tsx`
- Replace: `oliver-morrow-site/src/app/globals.css`

- [ ] **Step 1: Add visual-contract assertions to the markup test**

Append inside `describe("home page", ...)` in `src/components/HomePage.test.tsx`:

```tsx
it("exposes stable classes for the document layout", () => {
  expect(html).toContain('class="site-shell"');
  expect(html).toContain('class="introduction"');
  expect(html).toContain('class="work-item"');
  expect(html).toContain('class="site-footer"');
});
```

- [ ] **Step 2: Run the contract test**

Run: `npm test -- src/components/HomePage.test.tsx`

Expected: PASS for the component classes; proceed to CSS implementation. This is a characterization gate protecting the CSS interface.

- [ ] **Step 3: Replace the root layout**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "Oliver Morrow",
  description:
    "Oliver Morrow is a computer engineering student working on data and AI systems.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Replace global CSS with the complete document system**

Replace `src/app/globals.css` with:

```css
@import "tailwindcss";

:root {
  --surface: #191a19;
  --text: #e8e7e3;
  --muted: #aaa9a4;
  --rule: #3a3a37;
  --link: #f0efe9;
  --focus: #d6b879;
  --content-width: 44rem;
}

* { box-sizing: border-box; }

html { background: var(--surface); }

body {
  margin: 0;
  color: var(--text);
  background-color: var(--surface);
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.72' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.035'/%3E%3C/svg%3E");
  font-family: var(--font-geist), ui-sans-serif, system-ui, sans-serif;
  font-size: 1rem;
  line-height: 1.65;
  text-rendering: optimizeLegibility;
}

a {
  color: var(--link);
  text-decoration-color: color-mix(in srgb, var(--link) 45%, transparent);
  text-underline-offset: .2em;
}
a:hover { text-decoration-color: currentColor; }
a:focus-visible { outline: 2px solid var(--focus); outline-offset: 4px; border-radius: 1px; }

.site-shell {
  width: min(calc(100% - 2rem), var(--content-width));
  margin-inline: auto;
  padding-block: 2rem;
}

.site-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--rule);
}
.site-header h1 { margin: 0; font-size: 1rem; line-height: 1.3; }
.site-header nav { display: flex; flex-wrap: wrap; gap: .35rem 1rem; }
.site-header nav a { font-size: .875rem; }

main { padding-block: clamp(3.5rem, 10vw, 6rem); }
.introduction { max-width: 38rem; margin: 0 0 clamp(4rem, 12vw, 7rem); font-size: clamp(1.2rem, 3vw, 1.45rem); line-height: 1.55; letter-spacing: -.015em; }
.section { border-top: 1px solid var(--rule); padding-top: 1.25rem; margin-top: 3.5rem; }
.section h2 { margin: 0 0 2rem; font-size: .875rem; }
.work-list { display: grid; gap: 2rem; }
.work-item { display: grid; grid-template-columns: 8rem minmax(0, 1fr); gap: 1.5rem; }
.work-item h3 { margin: 0; font-size: 1rem; }
.work-item p:not(.metadata) { margin: .4rem 0 0; color: var(--muted); }
.metadata { margin: .15rem 0 0; color: var(--muted); font-size: .8rem; }
.previous-list { list-style: none; display: grid; gap: .8rem; padding: 0; margin: 0; }
.previous-list li { display: grid; grid-template-columns: 8rem minmax(0, 1fr); gap: 1.5rem; }

.site-footer { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .5rem 1.5rem; padding-top: 1rem; border-top: 1px solid var(--rule); color: var(--muted); font-size: .8rem; }

::selection { background: #575044; color: var(--text); }

@media (max-width: 36rem) {
  .site-header { align-items: flex-start; flex-direction: column; }
  .work-item, .previous-list li { grid-template-columns: 1fr; gap: .35rem; }
  .site-footer { flex-direction: column; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; }
}
```

- [ ] **Step 5: Run tests, lint, and build**

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: all tests pass; ESLint exits 0; Next.js production build exits 0 with `/` rendered successfully.

- [ ] **Step 6: Commit the visual system**

```bash
git add src/app/layout.tsx src/app/globals.css src/components/HomePage.test.tsx
git commit -m "style: apply restrained charcoal document theme"
```

### Task 4: Preserve legacy URLs and simplify metadata

**Files:**
- Create: `oliver-morrow-site/src/app/redirects.test.ts`
- Modify: `oliver-morrow-site/next.config.ts`
- Replace: `oliver-morrow-site/src/app/sitemap.ts`

- [ ] **Step 1: Write the failing redirect test**

Create `src/app/redirects.test.ts`:

```ts
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
```

- [ ] **Step 2: Verify it fails against current configuration**

Run: `npm test -- src/app/redirects.test.ts`

Expected: FAIL because `nextConfig.redirects` is undefined.

- [ ] **Step 3: Replace Next.js configuration**

Replace `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/work", destination: "/#work", permanent: true },
      { source: "/case-studies", destination: "/#work", permanent: true },
      { source: "/about", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 4: Replace the sitemap with the sole canonical page**

Replace `src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://olivermorrow.com", changeFrequency: "monthly", priority: 1 }];
}
```

- [ ] **Step 5: Run focused and full verification**

Run:

```bash
npm test -- src/app/redirects.test.ts
npm test
npm run build
```

Expected: redirect test passes; full suite passes; build output includes redirect rules and sitemap.

- [ ] **Step 6: Commit redirects and sitemap**

```bash
git add next.config.ts src/app/sitemap.ts src/app/redirects.test.ts
git commit -m "fix: preserve legacy portfolio routes"
```

### Task 5: Remove obsolete presentation code and dependencies

**Files:**
- Delete: `oliver-morrow-site/src/app/about/page.tsx`
- Delete: `oliver-morrow-site/src/app/work/page.tsx`
- Delete: `oliver-morrow-site/src/app/case-studies/page.tsx`
- Delete: `oliver-morrow-site/src/app/api/send/route.ts`
- Delete: `oliver-morrow-site/src/app/loading.tsx`
- Delete: `oliver-morrow-site/src/components/BackgroundSection.tsx`
- Delete: `oliver-morrow-site/src/components/CaseStudiesSection.tsx`
- Delete: `oliver-morrow-site/src/components/ContactSection.tsx`
- Delete: `oliver-morrow-site/src/components/CoreStackBand.tsx`
- Delete: `oliver-morrow-site/src/components/CurrentFocusSection.tsx`
- Delete: `oliver-morrow-site/src/components/EducationSection.tsx`
- Delete: `oliver-morrow-site/src/components/ExpandableCard.tsx`
- Delete: `oliver-morrow-site/src/components/ExperienceSection.tsx`
- Delete: `oliver-morrow-site/src/components/FrontDoorSection.tsx`
- Delete: `oliver-morrow-site/src/components/HeroSection.tsx`
- Delete: `oliver-morrow-site/src/components/Navbar.tsx`
- Delete: `oliver-morrow-site/src/components/ProjectGrid.tsx`
- Delete: `oliver-morrow-site/src/components/SectionHeader.tsx`
- Delete: `oliver-morrow-site/src/components/SectionReveal.tsx`
- Delete: `oliver-morrow-site/src/components/SpotlightSearch.tsx`
- Delete: `oliver-morrow-site/src/components/TechStack.tsx`
- Delete: `oliver-morrow-site/src/components/VolunteerSection.tsx`
- Delete: `oliver-morrow-site/src/hooks/useBodyScrollLock.ts`
- Delete: `oliver-morrow-site/src/hooks/useSystemStats.ts`
- Delete: `oliver-morrow-site/src/lib/searchIndex.ts`
- Delete: `oliver-morrow-site/src/lib/utils.ts`
- Delete: `oliver-morrow-site/src/types/index.ts`
- Delete: `oliver-morrow-site/src/data/portfolio.ts`
- Delete: `oliver-morrow-site/src/data/hero-textures.json`
- Delete: `oliver-morrow-site/scripts/generate-hero-manifest.mjs`
- Delete: `oliver-morrow-site/public/images/hero/cpu-die-shot.webp`
- Delete: `oliver-morrow-site/public/images/hero/data-center.webp`
- Delete: `oliver-morrow-site/public/images/hero/hard-drive.webp`
- Delete: `oliver-morrow-site/public/images/hero/windows-wallpaper.webp`
- Delete: `oliver-morrow-site/public/images/hero/wireframe-terrain.webp`
- Modify: `oliver-morrow-site/package.json`
- Modify: `oliver-morrow-site/package-lock.json`
- Modify: `oliver-morrow-site/README.md`

- [ ] **Step 1: Capture the passing baseline**

Run: `npm test && npm run lint && npm run build`

Expected: all three commands exit 0 before deletion.

- [ ] **Step 2: Delete the obsolete files listed above**

Use `apply_patch` with one `Delete File` entry for every exact path listed in this task after confirming `git status --short` contains no unrelated user changes. Do not delete `src/app/error.tsx`, `src/app/icon.svg`, the five new components, tests, or `src/data/site.ts`.

- [ ] **Step 3: Remove obsolete package hooks and runtime libraries**

Run:

```bash
npm pkg delete scripts.predev scripts.prebuild
npm uninstall clsx framer-motion lucide-react tailwind-merge
```

Expected: `package.json` retains `dev`, `build`, `start`, `lint`, and `test`; the four obsolete dependencies disappear from the package and lockfile.

- [ ] **Step 4: Replace the README summary and commands**

Replace `README.md` completely with:

````md
# Oliver Morrow

A small, server-rendered personal site built with Next.js and TypeScript.

The site is intentionally a single factual page. Its engineering priorities are semantic HTML, accessibility, fast rendering, and straightforward maintenance.

## Commands

```bash
npm run dev
npm test
npm run lint
npm run build
```

## Local development

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deployment

Run `npm run build` in the deployment environment. No application environment variables are required.
````

- [ ] **Step 5: Prove there are no stale references**

Run:

```bash
rg -n "framer-motion|lucide-react|SpotlightSearch|HeroSection|useSystemStats|api/send|hero-textures|card-noise|text-accent" src package.json README.md
```

Expected: no matches.

- [ ] **Step 6: Run the complete automated verification**

Run: `npm test && npm run lint && npm run build`

Expected: tests pass; lint exits 0; build exits 0; no removed routes are compiled as pages.

- [ ] **Step 7: Commit the deletion and documentation cleanup**

```bash
git add -A
git commit -m "refactor: remove obsolete portfolio machinery"
```

### Task 6: Browser and accessibility verification

**Files:**
- Modify only files implicated by observed defects.

- [ ] **Step 1: Start the production server**

Run:

```bash
npm run build
npm run start
```

Expected: production server listens on `http://localhost:3000`.

- [ ] **Step 2: Verify content and redirects in a browser**

Check `/`, `/work`, `/case-studies`, `/about`, and `/sitemap.xml`.

Expected:

- `/` contains one `h1`, the approved introduction, exactly three work items, five Previous entries, and no form/button/canvas.
- `/work` and `/case-studies` resolve to `/#work`.
- `/about` resolves to `/`.
- Sitemap contains only the canonical root URL.

- [ ] **Step 3: Verify responsive and zoom behavior**

Inspect at 360×800, 768×1024, and 1440×900, then at 200% browser zoom.

Expected: no horizontal overflow; navigation wraps; work metadata stacks below 36rem; all content remains readable.

- [ ] **Step 4: Verify keyboard, contrast, and motion**

Tab through every link with reduced motion enabled.

Expected: DOM order matches visual order; every link has a visible focus outline; no motion occurs; contrast remains legible over the grain.

- [ ] **Step 5: Verify client JavaScript budget**

Inspect the production page source and browser network/runtime behavior.

Expected: the page contains no `"use client"` component, event handler, canvas loop, or feature-specific client chunk. Framework bootstrap behavior, if emitted by Next.js, is not expanded by application code.

- [ ] **Step 6: Fix only observed defects and rerun gates**

Run: `npm test && npm run lint && npm run build`

Expected: all commands exit 0 after any fixes.

- [ ] **Step 7: Commit verified corrections**

```bash
git add src/app src/components src/data next.config.ts package.json package-lock.json README.md
git commit -m "fix: resolve main site verification findings"
```

If no files changed, do not create an empty commit.
