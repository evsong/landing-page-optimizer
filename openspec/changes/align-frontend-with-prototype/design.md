# Design: Align Frontend with Prototype

## Design System (from prototype.html)

### Colors (CSS Variables)
```
--bg: #0a0a0a
--bg-card: #111111
--border: rgba(255,255,255,0.06)
--border-hover: rgba(255,255,255,0.12)
--cyan: #6366f1
--sky: #818cf8
--green: #22c55e
--yellow: #f59e0b
--red: #ef4444
--text: #ededed
--text-2: #888888
--text-3: #555555
```

### Typography
- Display + Body: Inter (weights: 300-700)
- Mono: JetBrains Mono (weights: 400-700)
- h1: clamp(3.5rem,6vw,5rem), weight 600, letter-spacing -0.06em
- h2: clamp(1.6rem,3vw,2.2rem), weight 600
- Labels: 0.7rem uppercase, letter-spacing 0.1em

### Layout
- Container: max-width 1120px, padding 0 24px
- Sections: 120px vertical padding
- Border radius: 14px (default), 10px (sm), 6px (xs)

## Component Mapping

### 1. Background Layer
Add three fixed overlays to layout.tsx:
- `.bg-grid`: subtle grid lines (40px), masked radial
- `.bg-grain`: fractal noise SVG texture
- `.bg-vignette`: radial gradient darkening edges

### 2. Nav (fixed, blurred)
- Fixed top, `backdrop-filter:blur(20px)`, border-bottom
- Left: SVG gauge logo + "PageScore" gradient text
- Center: tab buttons (Home/Report/Dashboard) — cosmetic only on landing
- Right: "Sign In" ghost + "Get Started" primary pill button

### 3. Hero
- 180px top / 120px bottom padding
- Radial glow: 600px circle, indigo 15%, blur 60px
- h1 with white text (no gradient on "landing page" — prototype uses text-shadow)
- Subtitle: weight 300, max-width 520px
- URL input: pill shape (border-radius 100px), dark bg, globe SVG icon, "Analyze Free" button inside
- Trust section: "Trusted by 2,000+ marketers" + 5 faded company logos

### 4. Dimensions Grid
- 7-column auto-fit grid (minmax 140px), 1px gap with bg color showing through
- Each card: centered, 28px padding, bg matches page bg
- Icons: 20px SVG stroke icons, hover → white + glow

### 5. How It Works
- Horizontal flex container with border, rounded
- 3 steps separated by vertical borders
- Step labels: mono font "01_ANALYZE", "02_DIAGNOSE", "03_OPTIMIZE"

### 6. Pricing
- 3-column grid, equal width
- Pro card: `scale(1.04)`, "Most Popular" floating badge, gradient top-line
- Free/Agency: outline buttons; Pro: primary gradient button

### 7. FAQ
- Border-bottom separated items
- Click to expand with rotate(45deg) icon animation
- No card wrapper — clean minimal style

### 8. Footer
- Multi-column: brand left, link groups right (Product, Company, Legal)
- Muted colors, small text

### 9. Animations
- Scroll-reveal: `translateY(28px) + blur(4px)` → visible
- Staggered delays: 0.08s increments
- Hero entrance: fadeUp with delays per element

## Dark-Only Decision
Remove light mode toggle. Prototype is dark-only. This simplifies CSS significantly.
