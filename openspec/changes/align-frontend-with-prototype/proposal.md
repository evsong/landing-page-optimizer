# Proposal: Align Frontend with Prototype Design

## Problem

The current Next.js frontend (`src/app/page.tsx` + components) has significantly deviated from the approved prototype design (`prototype.html`). The prototype went through 6 rounds of screenshot iteration (v1→v6, 25 screenshots) and represents the intended visual direction.

## Key Differences

### 1. Theme & Background
- **Prototype**: Dark-only, custom CSS vars (`--bg:#0a0a0a`), grid/grain/vignette background textures, Inter + JetBrains Mono fonts
- **Current**: Generic Tailwind light/dark mode, plain background, default system fonts

### 2. Navigation
- **Prototype**: Fixed nav with `backdrop-filter:blur(20px)`, SVG gauge logo icon, tab switcher (Home/Report/Dashboard), "Sign In" ghost + "Get Started" primary buttons
- **Current**: Simple flex nav, text-only "PageScore" logo, only Pricing link + ThemeToggle + Sign in

### 3. Hero Section
- **Prototype**: 180px top padding, radial gradient glow behind heading, pill-shaped URL input with globe icon inside, "Trusted by 2,000+ marketers" trust strip with company logos
- **Current**: Smaller padding, "AI-Powered" badge chip, standard rectangular input, "No signup required" text only

### 4. 7 Dimensions Grid
- **Prototype**: Unified grid with 1px gap borders (`grid-7`), centered text, SVG icons with hover glow, seamless card feel
- **Current**: Separate bordered cards, left-aligned lucide icons, standard hover

### 5. How It Works
- **Prototype**: Horizontal connected steps with border dividers, labels like "01_ANALYZE", left-aligned text
- **Current**: Centered 3-column grid with plain "01"/"02"/"03"

### 6. Pricing
- **Prototype**: Popular card with `scale(1.04)`, "Most Popular" floating badge, gradient top-line accent
- **Current**: Simple cyan border highlight, no badge, no scale

### 7. Animations
- **Prototype**: Scroll-reveal animations (fadeUp, reveal classes with staggered delays), entrance animations
- **Current**: No animations at all

### 8. Footer
- **Prototype**: Multi-column footer with grouped links (Product, Company, Legal)
- **Current**: Single-line minimal footer

## Scope

Rewrite the landing page (`src/app/page.tsx`) and related components to match the prototype.html design. This is a visual/CSS change — no backend or API changes needed.

## Approach

1. Port the prototype's CSS design system (variables, backgrounds, typography) into Tailwind config + global CSS
2. Rewrite `page.tsx` structure to match prototype HTML sections
3. Update components (UrlInput, FAQ) to match prototype styling
4. Add scroll-reveal animations
5. Remove light mode (prototype is dark-only)

## Files to Modify

- `src/app/page.tsx` — main landing page
- `src/app/globals.css` — add design system vars, background textures, animations
- `src/components/UrlInput.tsx` — pill-shaped input with globe icon
- `src/components/FAQ.tsx` — match prototype FAQ styling
- `tailwind.config.ts` — extend with prototype fonts/colors
- `src/app/layout.tsx` — add Inter + JetBrains Mono fonts, remove theme toggle logic
