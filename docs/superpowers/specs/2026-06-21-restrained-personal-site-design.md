# Restrained Personal Site Redesign

**Date:** 2026-06-21
**Repositories:** `oliver-morrow-site`, `oliver-morrow-blog`

## Goal

Replace the current promotional-feeling portfolio with a restrained professional home page that is credible to hiring managers, engineering peers, and general visitors. The site should communicate Oliver's current work and selected experience without overstating the depth or scale of his career.

The blog already has the right scope and reading experience. Its redesign is limited to aligning the shared visual language and navigation with the main site.

## Design Principles

1. Facts replace positioning statements. The page does not use a tagline, availability badge, or marketing headline.
2. Specific work provides credibility. The interface does not attempt to manufacture credibility through animation, telemetry, effects, or excessive detail.
3. Robustness appears in the implementation: semantic markup, accessibility, performance, responsiveness, maintainability, and careful typography.
4. Both sites feel related without introducing a cross-repository component library or migration.
5. The default answer to an optional feature is omission.

## Selected Approach

Keep the repositories and frameworks separate:

- `oliver-morrow-site` remains a Next.js application and becomes a single-page professional site.
- `oliver-morrow-blog` remains an Astro site with its existing content collections, post routes, RSS feed, sitemap, and Mermaid support.
- The sites share documented design tokens and interaction conventions, not source packages.

This approach solves the presentation problem directly and avoids an unrelated framework or deployment migration.

## Main Site Information Architecture

The root page is the complete site. Its content appears in this order.

### 1. Header

The header contains Oliver Morrow's name and plain links to:

- Writing
- Résumé
- GitHub
- LinkedIn
- Email

The Résumé link must never ship broken. It is rendered only when a current PDF or external URL is configured.

The header is not a floating marketing navigation bar. On narrow screens, links wrap naturally or move to a second row; there is no hamburger menu.

### 2. Introduction

Use this factual opening, subject only to updates when Oliver's school or employment changes:

> Oliver Morrow is a computer engineering student at Queen's University, currently working on data and AI systems at Sanofi.

There is no preceding eyebrow, role label, slogan, animated text, or call-to-action button.

### 3. Selected Work

Show exactly three items:

1. One current professional item covering Oliver's data and AI work at Sanofi.
2. Noteworthy, the C++/Qt/WebAssembly collaborative note-taking project.
3. Proxmox HA Cluster, connected to the existing home-server writing where relevant.

Each item contains:

- A short context or date label
- A factual title
- At most two concise sentences describing the work
- A link only when a working destination exists

Items render as rows in the document flow. They are not cards and have no technology badge list, image, modal, hidden expansion, or inflated outcome claim.

### 4. Previously

Use a compact chronological list rather than a full résumé. It includes:

- Tilray Brands
- Smith Engineering
- Queen's University ITS
- Legal Aid Ontario
- Queen's University education

Volunteer positions are omitted from the homepage and remain available in the résumé.

Each entry is limited to organization, role or relationship, and date. Detailed bullets remain in the résumé rather than the website.

### 5. Footer

The footer contains Oliver's location, the current year, and a direct Writing link. It does not contain build hashes, system status, slogans, or a contact form.

## Routes and Redirects

- `/` is the only content page on the main site.
- `/work` redirects to `/#work`.
- `/about` redirects to `/`.
- `/case-studies` redirects to `/#work`.
- Existing indexed URLs receive permanent redirects rather than becoming 404 pages.

The homepage does not add separate About or Contact sections merely to preserve old anchors. The introduction and header links already serve those purposes.

## Main Site Removal Scope

Remove code and dependencies used only by the previous presentation:

- Animated canvas hero and texture manifest pipeline
- Hardware/system telemetry and boot sequence
- Command search and search index
- Framer Motion page and section animation
- Expandable cards and modal behavior
- Technology clouds, badge grids, and decorative stack bands
- Contact form UI and email API route
- Decorative case-study pages and redundant Work/About pages
- Mobile-menu state that is unnecessary for the simplified header

Content data may be reduced to the fields the new page actually renders. Historical résumé detail should not remain in client bundles or unused component trees.

## Blog Scope

The blog keeps:

- Its homepage post list
- Existing post URLs and MDX content
- Post metadata and reading layout
- RSS and sitemap generation
- Mermaid or post-specific scripts where a post requires them

Change only the shared shell and visual tokens:

- Header uses the same name and plain-link treatment as the main site.
- Footer uses the same quiet metadata treatment.
- Background, text, rule, link, spacing, and focus tokens align with the main site.
- Post typography remains optimized for long-form reading and need not match homepage measures exactly.

The blog is a sibling experience, not a pixel-identical copy of the homepage.

## Visual System

### Surface

- Dark-only appearance
- Soft charcoal background rather than pure black
- Off-white primary text
- Muted warm-grey secondary text and separators
- No cyan accent, gradient, glow, glass effect, or floating surface

### Texture

A subtle static paper grain, inspired by the tactile dark surface of Apple Notes, is applied to the page background.

The texture must:

- Remain visually subordinate to the text
- Be static and pointer-inert
- Use a tiny local asset or CSS data image
- Add no meaningful layout or rendering cost
- Preserve required contrast in every text region

### Typography

- Neutral sans-serif throughout
- No editorial serif or decorative monospace voice
- A narrow readable measure with responsive gutters
- Hierarchy created by weight, spacing, line height, and thin rules
- Modest type-size differences; no oversized hero text

### Interaction

- Plain text links are underlined by default and use a restrained color shift on hover
- Clear `:focus-visible` treatment
- No entrance animations, custom cursor, parallax, hover lifts, animated counters, or theme switcher
- Core content requires no client-side JavaScript

## Content and Component Boundaries

The main page is composed from small server-rendered units with one purpose each:

- `SiteHeader`: name and external/contact links
- `Introduction`: factual biography sentence
- `SelectedWork`: maps three typed work records to semantic rows
- `Previously`: maps compact chronology records
- `SiteFooter`: location, year, and Writing link

Content lives in a small typed data module. Layout components do not embed résumé prose, and the data model does not retain fields that no rendered component consumes.

Optional links are represented explicitly and omitted when absent. Components do not render disabled anchors, placeholder URLs, or empty metadata containers.

The blog continues using Astro layouts and components. Both repositories define the same CSS variable names for the shared background, text, muted text, rule, link, focus, and content-width tokens, but no runtime or package dependency connects them.

## Responsive Behavior

- The document uses one reading column at all breakpoints.
- Header links wrap without a menu or drawer.
- Work rows may use a metadata/content grid on wider screens and stack on narrow screens.
- Text remains readable at 200% zoom without horizontal scrolling.
- Touch targets and link spacing remain usable on small screens.

## Accessibility and Semantics

- One `h1` identifies Oliver Morrow; section headings follow a valid order.
- Use `header`, `nav`, `main`, `section`, and `footer` landmarks appropriately.
- All functionality is keyboard accessible.
- Focus indicators meet contrast requirements and are not removed.
- Text and interactive controls meet WCAG AA contrast.
- External links do not rely on icon-only labels.
- Reduced-motion preferences are respected; the intended experience contains no nonessential motion.

## Failure and Edge Cases

- Missing optional project, résumé, or social URLs cause the corresponding link to be omitted.
- Invalid configuration should fail type-checking or the production build rather than produce malformed links.
- Long organization or project names wrap without overlapping dates.
- The static grain remains a cosmetic enhancement; content remains complete if it does not load.
- Existing main-site routes redirect to stable destinations.

## Performance Requirements

- Main-site core content ships without client-side React hydration.
- Remove client-only dependencies that are unused after the redesign.
- Avoid remote font or texture requests that delay first render.
- Prevent layout shift from font loading.
- Keep post-specific blog scripts scoped to the posts that require them.

No numeric audit score is an acceptance criterion because scores vary by environment. Regressions such as unnecessary hydration, blocking remote assets, or layout shift are acceptance failures.

## Verification

Run in both repositories:

- Production build
- Linting where configured
- Type checking where configured
- Existing automated tests

Manually verify:

- Main homepage and all redirect routes
- Blog index and at least one MDX post
- Keyboard navigation and focus visibility
- Narrow mobile, standard desktop, 200% zoom, and reduced-motion settings
- No broken or placeholder links
- No horizontal overflow
- Legibility of the grain texture
- RSS and sitemap output

## Acceptance Criteria

The redesign is complete when:

1. The main site is a single factual page containing the approved introduction, three selected work items, compact previous experience, and direct external/contact links.
2. The page contains no tagline, marketing call-to-action, telemetry, canvas effect, card grid, modal, command search, or contact form.
3. Legacy routes redirect to appropriate homepage destinations.
4. The blog's content and reading behavior remain intact while its shell clearly shares the main site's visual system.
5. Both sites use the approved charcoal, sans-serif, document-like design with a subtle nonessential paper texture.
6. Core main-site content works without client-side JavaScript.
7. Both production builds pass, and manual responsive, keyboard, link, and content checks reveal no blocking issues.

## Out of Scope

- Combining the repositories or frameworks
- A shared design-system package
- New case studies or blog posts
- Resume rewriting
- Analytics, CMS, newsletter, search, or new contact handling
- Light mode or a theme toggle
- New illustrations, photography, or project imagery
