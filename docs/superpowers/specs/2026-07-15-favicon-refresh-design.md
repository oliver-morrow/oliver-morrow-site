# Favicon Refresh Design

## Goal

Replace the obsolete cyan portfolio favicon with a restrained mark that belongs
to the current charcoal-and-amber site.

## Visual design

The favicon remains a 32 by 32 SVG. It uses the site's charcoal surface color
(`#1b1c19`) as a full-bleed square background and a single geometric O in the
site accent color (`#c6a663`). The O is drawn as SVG geometry rather than a text
glyph so its weight and alignment do not depend on an installed font.

The mark has no rounded card, decorative frame, texture, gradient, shadow, or
additional lettering. Its stroke and inset must remain distinct when rendered
at 16 by 16 pixels.

## Integration

Update the existing `src/app/icon.svg` asset in place. Next.js continues to
publish it through the existing `/icon.svg` metadata route, so no layout or
metadata changes are required.

## Verification

- Add an asset-level test that rejects the legacy cyan value `#06b6d4`.
- Assert that the SVG contains the approved charcoal and amber colors.
- Assert that the mark uses geometric SVG elements and no `<text>` element.
- Run the full test, lint, type-check, and production-build suite.
- Inspect the served favicon at 16 and 32 pixels for legibility.

## Scope

This change affects only the favicon asset and its regression coverage. It does
not introduce a broader logo system or change page content, typography, or
layout.
