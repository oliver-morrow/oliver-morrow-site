# Quiet Ledger Density Calibration

**Date:** 2026-07-14
**Repository:** `oliver-morrow-site`
**Amends:** `2026-07-14-quiet-ledger-visual-repair-design.md`

## Goal

Rebalance the approved Quiet Ledger homepage after the continuous-grain correction made the surface effectively invisible while leaving the layout calibrated for a visibly tactile background.

## Diagnosis

At a 1440px-wide viewport, the rendered page currently has:

- 112px between the header rule and introduction
- 120px between the introduction and Selected Work
- 64px between the two main sections
- 112px between Previous Experience and the footer

The continuous texture uses a `0.28` soft-light overlay. At normal viewing scale it is essentially invisible, leaving the large gaps visually unsupported.

## Selected Calibration

Adjust texture and spacing as one system:

- Increase the existing continuous texture overlay to `0.42` opacity.
- Keep the seeded, seamless fractal-noise asset and `soft-light` blend mode.
- Reduce the desktop header-to-introduction gap to 80px.
- Reduce the desktop introduction-to-work gap to 88px.
- Reduce the inter-section gap to 52px.
- Reduce the previous-section-to-footer gap to 80px.
- Tighten the mobile main padding to 52px above and 60px below.
- Tighten the mobile introduction bottom margin to 60px.

The texture should be visible when looking at the surface but should not form discrete marks, visible tile seams, or compete with text.

## Boundaries

This calibration changes only existing CSS values. It does not change:

- Page content or component markup
- Typography sizes or weights
- Colour tokens
- The texture asset's continuous-noise construction
- Responsive grid behaviour
- Link or focus behaviour
- Blog scope

## Verification

- Compare the rendered desktop page at 1440×1000 against the measured targets.
- Verify the texture is perceptible at native scale without visible sprinkles or seams.
- Verify the mobile page at 390×844 has no overflow and retains readable grouping.
- Run the CSS contract tests, complete test suite, lint, and production build.

## Acceptance Criteria

1. The surface texture is perceptible at normal scale but remains subordinate to content.
2. No discrete sprinkle marks or tile seams are visible.
3. Desktop major gaps measure 80px, 88px, 52px, and 80px respectively.
4. Mobile content remains readable and free of horizontal overflow.
5. No content, component, interaction, or dependency changes are introduced.
