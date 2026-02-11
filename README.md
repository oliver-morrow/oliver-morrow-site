# Oliver Morrow Portfolio

My portfolio website showcasing professional experience, projects, and technical skills with an **OLED Void / Industrial** theme.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-black?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-black?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-black?style=flat-square&logo=tailwindcss)

## Features

- **OLED Void**: Pure black background (`#000000`) with cyan accent colors for high-contrast OLED displays
- **Smooth Animations**: Framer Motion-powered page transitions, scroll reveals, and interactive elements
- **Expandable Project Cards**: Modal overlays with shared layout transitions
- **Real-time System Stats**: Live uptime counter and animated telemetry displays
- **Interactive Tech Stack**: Hoverable technology icons with tooltips
- **Dynamic Hero Canvas**: Halftone effect with texture rotation and stability tracking
- **Contact Form**: Edge-runtime email handling via Resend API with rate limiting
- **Responsive Design**: Mobile-first approach with optimized layouts for all screen sizes
- **Performance Optimized**: Imperative DOM updates for high-frequency UI changes to minimize re-renders
- **Dynamic Textures**: Build-time texture manifest for hero section backgrounds

## Tech Stack

### Core
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework (CSS-based `@theme`)
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library

### Additional Libraries
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[Resend](https://resend.com/)** - Email API for contact form (called via `fetch`, edge-compatible)
- **clsx** & **tailwind-merge** - Utility functions for className management

## Design System

### Color Palette
```css
Background:  #000000 (Pure black)
Cards:       zinc-950
Text:        zinc-400 (body), #ffffff (headings), zinc-500 (muted)
Accent:      #06b6d4 (Cyan)
Borders:     zinc-800 (default), cyan-500/50 (hover)
```

### Typography
- **Headings**: Massive sans-serif, `font-black tracking-tighter uppercase`
- **Body**: Clean, readable sans-serif
- **Metadata**: `font-mono text-xs uppercase tracking-widest`

### Components
- **Cards**: Rounded corners with noise texture overlay (`.card-noise`)
- **Borders**: Subtle zinc borders with cyan hover states
- **Animations**: 0.3s easeOut transitions throughout

## Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/oliver-morrow/olivermorrow.ca.git
cd olivermorrow.ca
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Resend API key:
```env
RESEND_API_KEY=your_resend_api_key_here
CONTACT_EMAIL=your_email@example.com
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Available Scripts

```bash
npm run dev    # Generate hero manifest + start development server
npm run build  # Generate hero manifest + build for production
npm run start  # Start production server
npm run lint   # Run ESLint
```

### Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── send/              # Contact form email endpoint (edge runtime)
│   ├── globals.css            # Global styles & Tailwind theme
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   ├── error.tsx              # Error boundary
│   ├── loading.tsx            # Loading skeleton
│   └── icon.tsx               # Favicon generator
├── components/
│   ├── ContactSection.tsx     # Contact form + footer
│   ├── EducationSection.tsx   # Education timeline
│   ├── ExperienceSection.tsx  # Work experience cards
│   ├── ExpandableCard.tsx     # Reusable card-to-modal component
│   ├── HeroSection.tsx        # Hero with canvas animation
│   ├── Navbar.tsx             # Navigation with uptime counter
│   ├── ProjectGrid.tsx        # Project showcase
│   ├── SectionHeader.tsx      # Shared section heading component
│   ├── SectionReveal.tsx      # Scroll-reveal animation wrapper
│   ├── SpotlightSearch.tsx    # Search functionality
│   ├── TechStack.tsx          # Technology icons with tooltips
│   └── VolunteerSection.tsx   # Volunteer experience
├── data/
│   ├── hero-textures.json     # Auto-generated hero texture manifest
│   └── portfolio.ts           # Content data (projects, experience, etc.)
├── hooks/
│   ├── useBodyScrollLock.ts   # Modal scroll lock utility
│   └── useSystemStats.ts      # System stats hook
├── lib/
│   ├── searchIndex.ts         # Search indexing logic
│   └── utils.ts               # Utility functions
└── types/
    └── index.ts               # TypeScript type definitions
scripts/
└── generate-hero-manifest.mjs # Build-time hero texture scanner
```

## API Routes

### `/api/send` - Contact Form
- **Runtime**: Edge
- **Method**: POST
- **Rate Limiting**: 5 requests per minute per IP (best-effort in edge isolates)
- **Validation**: Email, subject, and message fields required
- **Security**: Header injection protection

## Performance Patterns

### Optimizations
- **Imperative DOM Updates**: Navbar uptime and HeroSection telemetry use refs + `textContent` to avoid state re-renders
- **TechStack Tooltip Positioning**: Direct style manipulation for high-frequency mousemove events
- **rAF Guards**: `queueMicrotask()` wraps state updates inside animation frames to prevent render thrashing
- **Code Splitting**: Automatic with Next.js App Router
- **Build-time Manifests**: Hero textures scanned at build time, eliminating runtime filesystem access

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `RESEND_API_KEY` | API key from [Resend](https://resend.com/api-keys) | Yes |
| `CONTACT_EMAIL` | Email address to receive contact form submissions | Yes |

## Deployment

This site is deployed on [Cloudflare Pages](https://pages.cloudflare.com):

1. Push your code to GitHub
2. Create a new project in Cloudflare Pages dashboard
3. Set build command to `npm run build` and output directory to `.next`
4. Add environment variables (`RESEND_API_KEY`, `CONTACT_EMAIL`) in the Cloudflare dashboard
5. Deploy

Cloudflare provides the `CF_PAGES_COMMIT_SHA` environment variable automatically, which is used for the build hash in the footer.

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)

## License

© 2026 Oliver Morrow. All rights reserved.

## Contact

For inquiries: [me@olivermorrow.ca](mailto:me@olivermorrow.ca)

---

Built with ☕ by [Oliver Morrow](https://olivermorrow.ca)
