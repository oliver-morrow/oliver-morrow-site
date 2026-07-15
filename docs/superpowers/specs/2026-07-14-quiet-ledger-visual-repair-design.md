# Quiet Ledger Visual Repair

**Date:** 2026-07-14
**Repository:** `oliver-morrow-site`

## Goal

Repair the simplified homepage so it feels authored, tactile, and professionally restrained without restoring the promotional portfolio machinery removed by the earlier redesign.

The current factual content and single-page information architecture are successful. This pass changes the visual system and composition, not the site's positioning or scope.

## Diagnosis

The committed simplified site has a credible content strategy but insufficient visual character. The current uncommitted styling attempts to restore depth with a centred sheet, rounded outer corners, a border, and a drop shadow. Those choices make the page resemble a generic generated SaaS card rather than a personal document.

The current repeating dot pattern also fails to read as paper. It is too regular to suggest a material surface and too subtle to provide intentional texture.

## Selected Direction: Quiet Ledger

Quiet Ledger is a dark, document-like interface with a continuous charcoal surface, precise alignment, restrained warmth, and fine paper grain. It should feel calm and professional at a glance and reveal its tactile detail only on closer inspection.

This direction was selected over two alternatives:

- **Notes Canvas:** softer, more spacious, and more directly Apple Notes-adjacent, but less structured and information-dense.
- **Engineer's Index:** sharper and more distinctive, with a persistent index rail, but more conspicuously designed than the site's content requires.

Quiet Ledger best balances personality with restraint.

## Scope

This pass covers only the main site in this repository.

The separate blog will receive a follow-up alignment pass after the homepage is complete. That follow-up may reuse the final colours, texture, typography, rules, link behaviour, and focus treatment, but it must preserve the blog's long-form reading layout.

The current factual copy and content order remain unchanged:

1. Header
2. Introduction
3. Selected work
4. Previous experience
5. Footer

No new marketing copy, project imagery, badges, calls to action, cards, animations, or interactive portfolio features are introduced.

## Surface and Texture

The page uses one continuous, edge-to-edge charcoal field. The main content is not placed inside a floating sheet and has no outer border, rounded container, or drop shadow.

The surface has a subtle warm cast rather than a neutral digital grey. Text remains warm white, descriptions and metadata use a quieter warm grey, and rules remain visible without becoming structural chrome.

Paper grain is deterministic, static, and local. It should combine:

- Fine high-frequency fibres
- Tiny irregular tonal variation
- Low overall contrast
- No visible repeating dots, fuzzy blur, or coarse noise clusters

The texture applies behind the full page, remains visually subordinate beneath text, is pointer-inert, and has no effect on content or layout if it fails to render. It must not require a remote request.

## Colour and Emphasis

The palette remains dark-only.

- Primary surface: warm charcoal
- Primary text: warm off-white
- Secondary text: muted warm grey
- Rules: low-contrast warm grey
- Accent: restrained amber

Amber is used only for section wayfinding and keyboard focus. It is not used for decorative glows, gradients, borders around large regions, or broad text highlighting.

## Typography

The site retains a neutral sans-serif voice. It does not introduce an editorial serif, decorative monospace, or oversized hero type.

Hierarchy comes from deliberate type weight, tracking, line height, spacing, and alignment. Type-size changes remain modest.

The introduction gains presence through measure and surrounding space rather than scale. Metadata is quiet but readable. Titles carry enough weight to anchor each row without resembling card headings.

## Page Composition

The content remains a narrow reading column placed deliberately within the viewport. Desktop layouts use generous breathing room without centring the content inside a visible object. Mobile layouts use natural gutters.

The header places Oliver Morrow's name and the primary links on one baseline at wide viewports. At narrow widths, the links wrap into a second row without a menu, drawer, or client-side state.

The introduction remains the first substantial content block and keeps its existing factual wording.

Selected work uses a consistent two-column grid at wide viewports:

- A quiet left gutter for date or context metadata
- A main reading column for the title and description

Previous experience uses the same grid and alignment logic. The consistency should make the page feel governed by one visual system rather than assembled from separate components.

The footer uses the same rule and alignment language as the rest of the document.

Square edges are the default throughout the page. A minimal radius may remain on the focus outline only where it improves rendering.

## Interaction

Links remain plain text and underlined by default. Hover produces only a restrained colour or underline-strength change. There are no lifts, transforms, animated underlines, or decorative cursor effects.

Keyboard focus uses the amber accent and remains clearly visible against every surface.

The intended homepage contains no nonessential motion and requires no client-side JavaScript.

## Responsive Behaviour

At narrow widths:

- Header links wrap without a hamburger menu.
- Metadata moves above the associated title and description.
- Content remains a single readable column.
- Footer content wraps or stacks without overlap.

At 200% zoom, the page must not scroll horizontally. Long names and descriptions wrap without colliding with metadata.

## Component and Implementation Boundaries

The existing server-rendered component structure remains the default:

- `SiteHeader`
- `Introduction`
- `SelectedWork`
- `Previously`
- `SiteFooter`

The existing typed content module remains the source of page copy and links.

This is predominantly a CSS repair. Component or markup changes are permitted only when they materially improve semantic structure, alignment, or styling boundaries. The work must not introduce a client component or a new runtime dependency.

The current uncommitted rounded-sheet styling is replaced. Unrelated worktree changes, including the existing `.gitignore` edit, remain untouched.

## Accessibility and Performance

- Text and interactive elements meet WCAG AA contrast.
- Keyboard focus is visible and is not clipped.
- The page remains usable with the texture absent.
- Texture is static and pointer-inert.
- The page respects reduced-motion preferences and introduces no motion that requires suppression.
- Core homepage content remains server-rendered without client-side hydration.
- No remote texture or additional font request is introduced.

## Verification

Automated verification includes:

- Existing unit tests
- Global-style contract tests where stable visual rules can be asserted
- Linting
- Type checking through the configured build
- Production build

Manual verification includes:

- Standard desktop viewport
- Narrow mobile viewport
- 200% browser zoom
- Keyboard navigation and focus visibility
- Long-content wrapping and horizontal overflow
- Texture appearance at normal scale and on a high-density display
- Text and rule contrast
- Reduced-motion preference
- Confirmation that no client-side React is introduced

## Acceptance Criteria

The repair is complete when:

1. The homepage uses one continuous charcoal surface with no floating outer sheet, rounded container, outer border, or drop shadow.
2. The surface has visible but subordinate irregular paper grain that does not resemble dots, blur, or a coarse repeating texture.
3. The existing factual copy, section order, and restrained information architecture are preserved.
4. Selected work and previous experience share a precise, responsive metadata/content grid.
5. Amber appears only as restrained wayfinding or focus emphasis.
6. The page remains keyboard accessible, readable at 200% zoom, and free of horizontal overflow.
7. The homepage introduces no new marketing elements, motion, client-side JavaScript, runtime dependency, or remote texture request.
8. Automated checks and the production build pass.
9. Manual desktop and mobile review matches the approved Quiet Ledger direction.

## Out of Scope

- Blog implementation or blog layout changes
- Copy rewriting
- New projects or résumé detail
- Light mode or a theme switcher
- New imagery or illustration
- Analytics, contact handling, search, or CMS work
- Restoring removed portfolio machinery
