# Blog Visual Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the existing Astro blog shell with the restrained charcoal document system while preserving its posts, URLs, RSS, sitemap, MDX rendering, and Mermaid behavior.

**Architecture:** Keep the content pipeline unchanged and treat the generated HTML as the integration boundary. Simplify the shared Astro header/footer and post-list presentation, then update global tokens and long-form typography without introducing a shared package or additional client scripts.

**Tech Stack:** Astro 5 static output, MDX, Tailwind CSS 4 Typography, local Geist variable font, Node built-in test runner

---

## File Map

- Create `oliver-morrow-blog/tests/site-output.test.mjs`: assertions against generated static HTML, RSS, and sitemap.
- Modify `oliver-morrow-blog/package.json`: add repeatable test command.
- Replace `oliver-morrow-blog/src/components/Navbar.astro`: wrapping static header with no mobile script.
- Replace `oliver-morrow-blog/src/components/Footer.astro`: location/year/portfolio link.
- Modify `oliver-morrow-blog/src/layouts/BaseLayout.astro`: simplified document shell and metadata casing.
- Replace `oliver-morrow-blog/src/pages/index.astro`: quiet Writing heading and list.
- Replace `oliver-morrow-blog/src/components/PostCard.astro`: border-separated rows instead of cards/tags.
- Modify `oliver-morrow-blog/src/layouts/BlogPost.astro`: restrained post header, tags, back link, Mermaid palette.
- Replace `oliver-morrow-blog/src/styles/global.css`: shared tokens, grain, focus, prose styling.

### Task 1: Establish generated-output regression tests

**Files:**
- Create: `oliver-morrow-blog/tests/site-output.test.mjs`
- Modify: `oliver-morrow-blog/package.json`

- [ ] **Step 1: Add a build-backed test script**

Run:

```bash
cd oliver-morrow-blog
npm pkg set scripts.test="npm run build && node --test tests/*.test.mjs"
```

Expected: `package.json` gains a `test` script without new dependencies.

- [ ] **Step 2: Write the failing output contract**

Create `tests/site-output.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../dist/${path}`, import.meta.url), "utf8");

test("blog index uses the restrained static shell", async () => {
  const html = await read("index.html");
  assert.match(html, />Oliver Morrow<\/a>/);
  assert.match(html, /aria-label="Primary"/);
  assert.match(html, />Writing<\/h1>/);
  assert.doesNotMatch(html, /mobile-menu-toggle|card-noise|PORTFOLIO|INITIALIZING/);
  assert.doesNotMatch(html, /<button|<script[^>]*>[^<]*mobile-menu/s);
});

test("a post keeps content and Mermaid support", async () => {
  const [diagramPost, plainPost] = await Promise.all([
    read("posts/agents-to-mcp/index.html"),
    read("posts/home-server/index.html"),
  ]);
  assert.match(diagramPost, /Agents to MCP/i);
  assert.match(diagramPost, /mermaid-config/);
  assert.match(diagramPost, /Back to writing/);
  assert.doesNotMatch(plainPost, /mermaid-config/);
});

test("feeds and sitemap still build", async () => {
  const [rss, sitemap] = await Promise.all([
    read("rss.xml"),
    read("sitemap-index.xml"),
  ]);
  assert.match(rss, /<rss/);
  assert.match(sitemap, /<sitemapindex/);
});
```

- [ ] **Step 3: Run the test and verify the intended failures**

Run: `npm test`

Expected: build succeeds; index and post contract tests FAIL on the current promotional shell; feed/sitemap test passes.

- [ ] **Step 4: Commit the red test**

```bash
git add package.json tests/site-output.test.mjs
git commit -m "test: define restrained blog output contract"
```

### Task 2: Replace the scripted shell with static document navigation

**Files:**
- Replace: `oliver-morrow-blog/src/components/Navbar.astro`
- Replace: `oliver-morrow-blog/src/components/Footer.astro`
- Modify: `oliver-morrow-blog/src/layouts/BaseLayout.astro`

- [ ] **Step 1: Replace the navbar with a wrapping static header**

Replace `src/components/Navbar.astro`:

```astro
---
const links = [
  { label: "Portfolio", href: "https://olivermorrow.com" },
  { label: "RSS", href: "/rss.xml" },
  { label: "GitHub", href: "https://github.com/oliver-morrow" },
  { label: "Email", href: "mailto:me@olivermorrow.ca" },
];
---

<header class="site-header">
  <a class="site-name" href="/">Oliver Morrow</a>
  <nav aria-label="Primary">
    {links.map((link) => <a href={link.href}>{link.label}</a>)}
  </nav>
</header>
```

This component must contain no `<script>`, button, fixed positioning, blur, mobile drawer, or icon-only link.

- [ ] **Step 2: Replace the footer**

Replace `src/components/Footer.astro`:

```astro
---
const year = new Date().getFullYear();
---

<footer class="site-footer">
  <span>Toronto / Kingston, Canada</span>
  <span>&copy; {year} Oliver Morrow</span>
  <a href="https://olivermorrow.com">Portfolio</a>
</footer>
```

- [ ] **Step 3: Simplify the base layout shell**

Replace `src/layouts/BaseLayout.astro` completely:

```astro
---
import "@fontsource-variable/geist";
import "@/styles/global.css";
import Navbar from "@/components/Navbar.astro";
import Footer from "@/components/Footer.astro";

interface Props {
  title: string;
  description?: string;
}

const { title, description = "Oliver Morrow's engineering blog" } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title === "Writing" ? "Writing — Oliver Morrow" : `${title} — Oliver Morrow`}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="alternate" type="application/rss+xml" title="Oliver Morrow Blog" href="/rss.xml" />
    <link rel="sitemap" href="/sitemap-index.xml" />
  </head>
  <body>
    <div class="site-shell">
      <Navbar />
      <main><slot /></main>
      <Footer />
    </div>
  </body>
</html>
```

This deliberately removes the Geist Mono import, fixed-header padding, smooth scrolling, and utility-class shell.

- [ ] **Step 4: Build and inspect the partial result**

Run: `npm run build`

Expected: build succeeds; generated index contains static `aria-label="Primary"` navigation and no mobile-menu script. Full output test may still fail until index/post copy is updated.

- [ ] **Step 5: Commit the static shell**

```bash
git add src/components/Navbar.astro src/components/Footer.astro src/layouts/BaseLayout.astro
git commit -m "refactor: replace blog navigation with static shell"
```

### Task 3: Restyle the blog index as a document list

**Files:**
- Replace: `oliver-morrow-blog/src/pages/index.astro`
- Replace: `oliver-morrow-blog/src/components/PostCard.astro`

- [ ] **Step 1: Replace the index content**

Replace `src/pages/index.astro`:

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
import PostCard from "@/components/PostCard.astro";
import { getCollection } from "astro:content";

const posts = (await getCollection("posts", ({ data }) => !data.draft)).sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
);
---

<BaseLayout title="Writing">
  <section class="writing-index" aria-labelledby="writing-heading">
    <header class="page-heading">
      <h1 id="writing-heading">Writing</h1>
      <p>Notes on data engineering, systems, software, and the projects around them.</p>
    </header>
    <div class="post-list">
      {posts.map((post) => <PostCard post={post} />)}
    </div>
    {posts.length === 0 && <p class="empty-state">No posts yet.</p>}
  </section>
</BaseLayout>
```

- [ ] **Step 2: Replace cards with semantic rows**

Replace `src/components/PostCard.astro`:

```astro
---
import type { CollectionEntry } from "astro:content";

interface Props { post: CollectionEntry<"posts">; }
const { post } = Astro.props;
const { title, description, pubDate } = post.data;
const formattedDate = pubDate.toLocaleDateString("en-CA", {
  year: "numeric", month: "short", day: "numeric",
});
---

<article class="post-row">
  <time datetime={pubDate.toISOString()}>{formattedDate}</time>
  <div>
    <h2><a href={`/posts/${post.id.replace(/\.[^.]+$/, "")}`}>{title}</a></h2>
    <p>{description}</p>
  </div>
</article>
```

Do not render tags on the index; they remain post metadata.

- [ ] **Step 3: Run the build-backed contract**

Run: `npm test`

Expected: index contract passes; post contract still fails only if the back-link copy has not yet changed; feeds/sitemap pass.

- [ ] **Step 4: Commit the index redesign**

```bash
git add src/pages/index.astro src/components/PostCard.astro
git commit -m "feat: present blog index as a quiet document list"
```

### Task 4: Align post chrome without changing post content

**Files:**
- Modify: `oliver-morrow-blog/src/layouts/BlogPost.astro`

- [ ] **Step 1: Replace the post header markup**

Retain the current `Props` interface, `post` destructuring, `formatDate`, `words`, and `readTime` declarations exactly. Replace the article opening/header with:

```astro
<article class="blog-post">
  <header class="post-heading">
    <h1>{title}</h1>
    <div class="post-meta">
      <time datetime={pubDate.toISOString()}>{formatDate(pubDate)}</time>
      <span>{readTime} min read</span>
      {updatedDate && <span>Updated {formatDate(updatedDate)}</span>}
    </div>
    {tags.length > 0 && <p class="post-tags">{tags.join(" · ")}</p>}
  </header>
```

After the prose and Mermaid script, replace the old back-link block with:

```astro
<nav class="post-footer" aria-label="Post">
  <a href="/">← Back to writing</a>
</nav>
</article>
```

- [ ] **Step 2: Update Mermaid base colors and typography**

Replace `baseMermaidVars` with:

```ts
const baseMermaidVars = {
  background: "#191a19",
  primaryColor: "#232421",
  primaryTextColor: "#e8e7e3",
  primaryBorderColor: "#3a3a37",
  secondaryColor: "#232421",
  tertiaryColor: "#232421",
  lineColor: "#aaa9a4",
  edgeLabelBackground: "#232421",
  clusterBkg: "#232421",
  clusterBorder: "#3a3a37",
  titleColor: "#e8e7e3",
  fontFamily: "Geist Variable, system-ui, sans-serif",
};
```

Remove uppercase transformations from `formatDate` by deleting `.toUpperCase()`.

Add a content guard beside the read-time calculation:

```ts
const hasMermaid = post.body?.includes("```mermaid") ?? false;
```

Delete the existing `mermaid-config` element and its following script. Insert this guarded block in the same position:

```astro
{
  hasMermaid && (
    <>
      <div id="mermaid-config" data-vars={mermaidVars} style="display:none"></div>
      <script>
        import mermaid from "mermaid";
        const configEl = document.getElementById("mermaid-config");
        const themeVariables = JSON.parse(configEl?.dataset.vars ?? "{}");
        mermaid.initialize({ startOnLoad: false, theme: "base", themeVariables });
        document.querySelectorAll<HTMLPreElement>("pre[data-language='mermaid']").forEach((pre) => {
          const code = pre.querySelector("code");
          if (!code) return;
          const wrapper = document.createElement("div");
          wrapper.className = "mermaid not-prose my-8 flex justify-center";
          wrapper.textContent = code.textContent ?? "";
          pre.replaceWith(wrapper);
        });
        await mermaid.run();
      </script>
    </>
  )
}
```

- [ ] **Step 3: Run the generated-output tests**

Run: `npm test`

Expected: all 3 tests pass after the post back-link and Mermaid config changes.

- [ ] **Step 4: Commit the post chrome alignment**

```bash
git add src/layouts/BlogPost.astro
git commit -m "style: align blog post chrome with personal site"
```

### Task 5: Replace the OLED theme with shared document tokens

**Files:**
- Replace: `oliver-morrow-blog/src/styles/global.css`

- [ ] **Step 1: Replace global tokens and structural styles**

Replace `src/styles/global.css` with a stylesheet containing the existing Tailwind imports followed by this complete shared system:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

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
  font-family: "Geist Variable", ui-sans-serif, system-ui, sans-serif;
  line-height: 1.65;
}
a { color: var(--link); text-decoration-color: color-mix(in srgb, var(--link) 45%, transparent); text-underline-offset: .2em; }
a:hover { text-decoration-color: currentColor; }
a:focus-visible { outline: 2px solid var(--focus); outline-offset: 4px; border-radius: 1px; }
.site-shell { width: min(calc(100% - 2rem), var(--content-width)); margin-inline: auto; padding-block: 2rem; }
.site-header { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem 2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--rule); }
.site-name { font-size: 1rem; font-weight: 700; text-decoration: none; }
.site-header nav { display: flex; flex-wrap: wrap; gap: .35rem 1rem; }
.site-header nav a { font-size: .875rem; }
main { padding-block: clamp(3.5rem, 10vw, 6rem); }
.site-footer { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .5rem 1.5rem; padding-top: 1rem; border-top: 1px solid var(--rule); color: var(--muted); font-size: .8rem; }
.page-heading { margin-bottom: clamp(3rem, 8vw, 5rem); }
.page-heading h1, .post-heading h1 { margin: 0; font-size: clamp(2rem, 7vw, 3.25rem); line-height: 1.08; letter-spacing: -.04em; }
.page-heading p { max-width: 35rem; margin: 1rem 0 0; color: var(--muted); }
.post-list { border-top: 1px solid var(--rule); }
.post-row { display: grid; grid-template-columns: 8rem minmax(0, 1fr); gap: 1.5rem; padding-block: 1.5rem; border-bottom: 1px solid var(--rule); }
.post-row time, .post-meta, .post-tags { color: var(--muted); font-size: .8rem; }
.post-row h2 { margin: 0; font-size: 1rem; }
.post-row p { margin: .4rem 0 0; color: var(--muted); }
.blog-post { max-width: 42rem; margin-inline: auto; }
.post-heading { margin-bottom: 3.5rem; }
.post-meta { display: flex; flex-wrap: wrap; gap: .35rem 1rem; margin-top: 1rem; }
.post-tags { margin: .75rem 0 0; }
.post-footer { margin-top: 4rem; padding-top: 1.5rem; border-top: 1px solid var(--rule); }
.empty-state { color: var(--muted); }
::selection { background: #575044; color: var(--text); }

.prose {
  --tw-prose-body: var(--muted);
  --tw-prose-headings: var(--text);
  --tw-prose-lead: var(--muted);
  --tw-prose-links: var(--link);
  --tw-prose-bold: var(--text);
  --tw-prose-counters: var(--muted);
  --tw-prose-bullets: var(--muted);
  --tw-prose-hr: var(--rule);
  --tw-prose-quotes: var(--muted);
  --tw-prose-quote-borders: var(--rule);
  --tw-prose-captions: var(--muted);
  --tw-prose-code: var(--text);
  --tw-prose-pre-code: var(--text);
  --tw-prose-pre-bg: #232421;
  --tw-prose-th-borders: var(--rule);
  --tw-prose-td-borders: var(--rule);
}
.prose a { font-weight: inherit; }
.prose pre, .prose img { border: 1px solid var(--rule); border-radius: .25rem; }
.prose code::before, .prose code::after { content: none; }
.prose blockquote { border-left-width: 1px; font-style: normal; }

@media (max-width: 36rem) {
  .site-header { align-items: flex-start; flex-direction: column; }
  .post-row { grid-template-columns: 1fr; gap: .35rem; }
  .site-footer { flex-direction: column; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; }
}
```

- [ ] **Step 2: Prove old visual vocabulary is gone**

Run:

```bash
rg -n "accent|cyan|card-noise|uppercase|tracking-widest|backdrop-blur|rounded-lg|font-mono" src/components src/layouts src/pages src/styles
```

Expected: no matches except content inside MDX posts or a justified code-specific style; fix any shell/index/post-chrome matches.

- [ ] **Step 3: Run full automated verification**

Run: `npm test`

Expected: Astro build succeeds; all 3 output tests pass; RSS and sitemap remain present.

- [ ] **Step 4: Commit the shared token system**

```bash
git add src/styles/global.css
git commit -m "style: apply restrained charcoal blog theme"
```

### Task 6: Browser and reading verification

**Files:**
- Modify only files implicated by observed defects.

- [ ] **Step 1: Start the production preview**

Run:

```bash
npm run build
npm run preview
```

Expected: Astro preview exposes the generated site locally.

- [ ] **Step 2: Verify the index and one prose-heavy post**

Inspect `/` and `/posts/home-server` at 360×800, 768×1024, and 1440×900.

Expected: navigation wraps without a menu; post rows stack on mobile; no horizontal overflow; hierarchy remains quiet and readable.

- [ ] **Step 3: Verify Mermaid behavior**

Inspect `/posts/agents-to-mcp`.

Expected: diagrams render once; labels are readable; background/borders match the charcoal token system; no console errors appear.

- [ ] **Step 4: Verify keyboard, zoom, and links**

Tab through header, post links, prose links, back link, and footer at normal and 200% zoom.

Expected: every interactive element has visible focus; order follows the document; external links and RSS work; no clipping or overflow occurs.

- [ ] **Step 5: Confirm scripts are scoped to content need**

Inspect generated index HTML and network/runtime behavior.

Expected: index has no navigation or presentation script; Mermaid code appears only in post pages using `BlogPost.astro` and does not alter non-Mermaid prose.

- [ ] **Step 6: Fix only observed defects and rerun**

Run: `npm test`

Expected: production build and all output contracts pass after any fixes.

- [ ] **Step 7: Commit verified corrections**

```bash
git add src/components src/layouts src/pages src/styles tests package.json
git commit -m "fix: resolve blog alignment verification findings"
```

If no files changed, do not create an empty commit.
