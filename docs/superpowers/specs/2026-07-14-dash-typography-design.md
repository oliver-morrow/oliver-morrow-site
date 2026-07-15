# Dash Typography

**Date:** 2026-07-14

## Goal

Remove em dashes from the site's user-facing typography while preserving the compact, restrained presentation of professional metadata.

## Typography Rules

- Use a middle dot to separate an organization from a role or date: `Tilray Brands · Data & Analytics Intern` and `Sanofi · 2025–present`.
- Use an en dash for closed date ranges: `2024–2025`.
- Spell the open end of an ongoing date range as `present`; do not use a trailing em dash.
- Do not use em dashes in user-facing site content.

## Scope

Update the three current em-dash patterns in the homepage data and rendering:

1. Replace the organization/role em dash in the previous-experience list with a middle dot.
2. Change `Sanofi · 2025—` to `Sanofi · 2025–present`.
3. Change `2024—2025` to `2024–2025`.

No layout, component structure, or unrelated copy changes are included.

## Verification

- Existing site tests pass after updating any affected expectations.
- A source scan finds no em dashes in user-facing files under `src` or `public`.
- The homepage renders the new separator and date forms without changing layout behavior.
