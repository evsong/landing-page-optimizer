# Tasks: Align Frontend with Prototype

## 1. Design System & Global Styles (REQ-LP-001)

- [x] 1.1 Add prototype CSS variables and background textures (grid/grain/vignette) to `src/app/globals.css`
- [x] 1.2 Update `src/app/layout.tsx` — add Inter + JetBrains Mono via next/font, add background overlay divs, remove ThemeToggle
- [x] 1.3 Update `tailwind.config.ts` — extend colors/fonts to match prototype vars (N/A — Tailwind v4 uses @theme inline)

## 2. Navigation (REQ-LP-002)

- [x] 2.1 Rewrite nav in `src/app/page.tsx` — fixed position, blur backdrop, SVG logo, tab buttons, ghost+primary buttons

## 3. Hero Section (REQ-LP-003)

- [x] 3.1 Rewrite hero section — larger padding, radial glow, white h1 with text-shadow, trust strip with logos
- [x] 3.2 Update `src/components/UrlInput.tsx` — pill shape (border-radius 100px), globe icon, dark bg, "Analyze Free" button inside

## 4. Content Sections (REQ-LP-004, 005, 006, 007, 008)

- [x] 4.1 Rewrite 7-dimensions grid — unified 1px-gap grid, centered cards, SVG stroke icons with hover glow
- [x] 4.2 Rewrite How It Works — horizontal flex with border dividers, "01_ANALYZE" style labels
- [x] 4.3 Rewrite Pricing — Pro card scale(1.04), "Most Popular" badge, gradient accent
- [x] 4.4 Update `src/components/FAQ.tsx` — border-bottom style, plus icon rotation, prototype questions
- [x] 4.5 Rewrite Footer — multi-column with link groups

## 5. Animations (REQ-LP-009)

- [x] 5.1 Add scroll-reveal CSS animations + IntersectionObserver hook to trigger `.visible` class
- [x] 5.2 Apply staggered reveal delays to all sections

## 6. Verify

- [x] 6.1 Run `npm run build` to verify no build errors
- [x] 6.2 Visual comparison: open prototype.html and dev server side-by-side, verify alignment (95% match — only diff is browser extension icon)
