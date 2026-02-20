# Spec: Landing Page Alignment

## Overview
Rewrite the landing page frontend to match prototype.html exactly. Dark-only theme, custom design system, scroll animations.

## Requirements

### REQ-LP-001: Global Design System
- Add CSS variables from prototype to globals.css
- Import Inter + JetBrains Mono via next/font
- Add background textures (grid, grain, vignette) to layout.tsx
- Remove light/dark mode toggle and ThemeToggle component usage

### REQ-LP-002: Navigation
- Fixed position, blur backdrop, border-bottom
- SVG gauge logo + gradient "PageScore" text
- Tab buttons (Home/Report/Dashboard) — decorative
- Ghost "Sign In" + primary "Get Started" buttons

### REQ-LP-003: Hero Section
- Large padding (180px/120px), radial glow behind heading
- White h1 text with text-shadow (not gradient)
- Pill-shaped URL input (border-radius 100px) with globe icon
- Trust strip: "Trusted by 2,000+ marketers" + faded logos

### REQ-LP-004: Dimensions Grid
- 7-col auto-fit grid with 1px gap borders
- Centered cards, SVG stroke icons with hover glow
- Seamless grid feel (no individual card borders)

### REQ-LP-005: How It Works
- Horizontal flex with vertical border dividers
- Step labels: "01_ANALYZE", "02_DIAGNOSE", "03_OPTIMIZE"
- Left-aligned text within each step

### REQ-LP-006: Pricing Cards
- Pro card scaled 1.04x with "Most Popular" floating badge
- Gradient top-line accent on popular card
- Full-width buttons per card

### REQ-LP-007: FAQ
- Clean border-bottom style, no card wrappers
- Plus icon rotates 45deg on open

### REQ-LP-008: Footer
- Multi-column layout with link groups
- Brand info left, links right

### REQ-LP-009: Scroll Animations
- Reveal animation: translateY(28px) + blur(4px) → visible
- Staggered delays (0.08s increments)
- IntersectionObserver-based trigger

## Files Affected
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/components/UrlInput.tsx`
- `src/components/FAQ.tsx`
- `tailwind.config.ts`
