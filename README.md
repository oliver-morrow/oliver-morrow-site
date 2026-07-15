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

The site is deployed as a static export on Cloudflare Pages:

- Framework preset: `Next.js (Static HTML Export)`
- Build command: `npm run build`
- Build output directory: `out`

No application environment variables are required. Legacy route redirects are
defined in `public/_redirects` and copied into the static export.
