## 1. Project Setup

- [x] 1.1 Initialize Next.js project with TypeScript, TailwindCSS, ESLint (`npx create-next-app@latest landing-page-optimizer --typescript --tailwind --eslint --app --src-dir`)
- [x] 1.2 Install core dependencies: `prisma @prisma/client puppeteer-core @sparticuz/chromium lighthouse pa11y next-auth @auth/prisma-adapter`
- [x] 1.3 Install AI + payment dependencies: `@anthropic-ai/sdk stripe @react-pdf/renderer`
- [x] 1.4 Install UI dependencies: `recharts lucide-react clsx tailwind-merge`
- [x] 1.5 Configure Prisma with Neon PostgreSQL — create `prisma/schema.prisma` with User, AnalysisReport, ComparisonReport, Account, Session, VerificationToken models
- [ ] 1.6 Run `prisma migrate dev` to create initial database schema
- [x] 1.7 Create `.env.local` template with all required env vars (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, ANTHROPIC_API_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, EMAIL_SERVER, EMAIL_FROM)
- [ ] 1.8 Create GitHub repo and push initial commit

## 2. Authentication & User System (REQ-US-001, REQ-US-002)

- [x] 2.1 Configure NextAuth with Prisma adapter, email magic link provider, and Google OAuth provider (`app/api/auth/[...nextauth]/route.ts`)
- [x] 2.2 Create sign-in page (`app/auth/signin/page.tsx`) with email input and Google button
- [x] 2.3 Add session provider wrapper in root layout
- [x] 2.4 Create Prisma client singleton (`lib/prisma.ts`)
- [x] 2.5 Implement plan gating middleware — helper function `checkPlanAccess(userId, feature)` that enforces FREE/PRO/AGENCY limits
- [x] 2.6 Implement monthly analysis counter reset logic (reset `analysisCount` when `monthResetAt` is past)

## 3. Stripe Integration (REQ-US-003)

- [ ] 3.1 Create Stripe products and prices for PRO ($5.99/mo) and AGENCY ($49/mo) in Stripe dashboard
- [x] 3.2 Implement checkout session creation (`lib/stripe.ts`) — `createCheckoutSession(userId, plan)`
- [x] 3.3 Create Stripe webhook handler (`app/api/webhooks/stripe/route.ts`) — handle checkout.session.completed, customer.subscription.updated, customer.subscription.deleted
- [x] 3.4 Implement billing portal redirect for subscription management
- [x] 3.5 Create upgrade API route (`app/api/upgrade/route.ts`) that redirects to Stripe Checkout

## 4. Analysis Engine — Page Loading & Extraction (REQ-AE-001, REQ-AE-002, REQ-AE-003)

- [x] 4.1 Create analysis pipeline orchestrator (`lib/analyzer.ts`) — main `analyzeUrl(url)` function
- [x] 4.2 Implement Puppeteer page loader with @sparticuz/chromium — launch browser, navigate to URL, wait for networkidle0 (max 15s), handle redirects
- [x] 4.3 Implement full-page screenshot capture (1440px desktop + 375px mobile viewports)
- [x] 4.4 Implement DOM extractor (`lib/dom-extractor.ts`) — extract headings, links, images, forms, buttons, meta tags, OG tags, JSON-LD, page text via `page.evaluate()`
- [x] 4.5 Implement section detector — identify Hero, Social Proof, How It Works, Features, Testimonials, Pricing, FAQ, CTA, Footer sections from DOM structure
- [x] 4.6 Add error handling for invalid URLs, unreachable pages, timeouts, and redirect loops

## 5. Analysis Engine — Lighthouse, Pa11y, HAR & AI (REQ-AE-004, REQ-AE-005, REQ-AE-007, REQ-AE-008, REQ-AE-009)

- [x] 5.1 Implement Lighthouse runner (`lib/lighthouse.ts`) — run Lighthouse Node API with categories [performance, accessibility, best-practices, seo] on the Puppeteer browser instance
- [x] 5.2 Implement Pa11y accessibility runner (`lib/pa11y.ts`) — run Pa11y with `standard: 'WCAG2AA'`, `runner: 'axe'`, return issues with code, type, message, selector, context. Fallback to Lighthouse-only on timeout/failure (20s limit)
- [x] 5.3 Implement HAR capture and resource analyzer (`lib/har-analyzer.ts`) — enable CDP Network domain during page load, compute: total requests by type, transfer sizes, top 5 largest resources, third-party %, render-blocking count, unused JS estimate (Coverage API), modern image format check
- [x] 5.4 Implement extended performance metrics (`lib/extended-metrics.ts`) — extract via `page.evaluate()` and CDP: resource entry count/duration, long task count (>50ms), DOM node count, DOM max depth, event listener count. CSS complexity: stylesheet count, CSS rules count, !important count, inline style count
- [x] 5.5 Update analysis orchestrator (`lib/analyzer.ts`) — run Lighthouse ∥ Pa11y in parallel, HAR capture during initial page load, extended metrics during DOM extraction phase
- [x] 5.6 Implement AI Vision analyzer (`lib/ai/vision.ts`) — send screenshot to Claude Sonnet with structured prompt, parse JSON response for design sub-scores
- [x] 5.7 Implement AI text analyzer (`lib/ai/suggestions.ts`) — send DOM text + scores to Claude Haiku, get prioritized suggestions with impact levels
- [x] 5.8 Implement AI copy rewriter (`lib/ai/rewrites.ts`) — generate 3 alternative headlines, 3 alternative CTAs when scores are below threshold
- [x] 5.9 Implement 24-hour AI result caching — check DB for recent analysis of same URL, reuse AI results if fresh

## 6. Scoring System (REQ-SS-001 through REQ-SS-011)

- [x] 6.1 Create scoring engine (`lib/scoring.ts`) — `computeScores(domData, lighthouseData, pa11yData, harData, extendedMetrics, aiVisionResult, aiTextResult)` returning all 7 dimension scores
- [x] 6.2 Implement structure completeness scorer — check for 9 key sections, score proportionally
- [x] 6.3 Implement visual design scorer — map AI Vision sub-scores to 0-100
- [x] 6.4 Implement copy quality scorer — map AI text analysis to 0-100
- [x] 6.5 Implement conversion optimization scorer (`lib/rules/conversion.ts`) — CTA above fold, CTA count, form fields, trust signals, urgency elements
- [x] 6.6 Implement performance scorer — Lighthouse Performance as base, with HAR-based penalty deductions: >3MB transfer (-5pts), >80 requests (-3pts), >5 render-blocking (-3pts), >1500 DOM nodes (-2pts), >3 long tasks over 50ms (-2pts). Clamp 0-100.
- [x] 6.7 Implement SEO scorer (`lib/rules/seo.ts`) — combine Lighthouse SEO + custom checks (title length, meta desc, OG tags, heading hierarchy, alt texts, canonical, structured data)
- [x] 6.8 Implement accessibility sub-scoring (`lib/rules/accessibility.ts`) — categorize Pa11y violations by severity, apply penalties: -2pts per error (max -10), -1pt per warning (max -5). Surface critical issues (missing alt, contrast, form labels) as high-severity with CSS selectors and remediation guidance
- [x] 6.9 Implement front-end quality checks (`lib/rules/frontend-quality.ts`) — CSS complexity: >1000 rules (warning), >20 !important (warning), >50 inline styles (warning), >15 DOM depth (warning). JS health: >500KB JS (warning), >200 listeners (warning), >40% unused JS (warning)
- [x] 6.10 Implement benchmark scorer — compare against stored averages, compute percentile
- [x] 6.11 Implement weighted overall score aggregation + letter grade assignment (A+ through F)

## 7. API Routes

- [x] 7.1 Create `POST /api/analyze` — accept URL, validate, check rate limit, run pipeline, save report, return report ID
- [x] 7.2 Create `GET /api/report/[id]` — fetch report by ID, apply plan gating (blur suggestions for FREE)
- [x] 7.3 Create `POST /api/compare` — accept two URLs, run analysis on both, generate comparison summary, save ComparisonReport (AGENCY only)
- [x] 7.4 Create `GET /api/history` — return paginated list of user's past reports
- [ ] 7.5 Create `GET /api/report/[id]/pdf` — generate and stream PDF report (AGENCY only)
- [x] 7.6 Implement rate limiting (`lib/rate-limit.ts`) — FREE: 3/month, PRO/AGENCY: 60/hour

## 8. Frontend — Landing Page (REQ-FE-001)

- [x] 8.1 Create landing page (`app/page.tsx`) — Hero section with URL input, headline "How good is your landing page?", analyze CTA
- [x] 8.2 Create 7-dimension feature showcase section with icons and descriptions
- [x] 8.3 Create PricingTable component — 3 cards (FREE/PRO/AGENCY) with feature comparison
- [x] 8.4 Create FAQ section with accordion
- [x] 8.5 Create footer with links and legal info
- [x] 8.6 Apply dark mode as default theme with TailwindCSS dark classes

## 9. Frontend — Report Page (REQ-FE-002)

- [x] 9.1 Create ScoreRing component — animated circular chart showing overall score + letter grade
- [x] 9.2 Create DimensionBar component — horizontal bar with color coding (green ≥80, yellow ≥60, red <60)
- [x] 9.3 Create IssueList component — expandable list of issues per dimension with severity badges
- [x] 9.4 Create SuggestionCard component — AI suggestion with impact badge (high/medium/low) and fix description
- [x] 9.5 Create CopyRewriteCard component — shows original text vs 3 AI alternatives
- [x] 9.6 Create LockedSection component — blurred content with upgrade prompt overlay
- [x] 9.7 Create ProgressSteps component — 4-step progress indicator (Loading → Auditing → AI Analysis → Report)
- [x] 9.8 Assemble report page (`app/report/[id]/page.tsx`) — ScoreRing + DimensionBars + IssueList + Suggestions + CopyRewrites + LockedSections

## 10. Frontend — Comparison & Dashboard (REQ-FE-003, REQ-FE-004)

- [x] 10.1 Create ComparisonView component — side-by-side reports with per-dimension winner indicators
- [x] 10.2 Create comparison page (`app/compare/page.tsx`) — dual URL input form + ComparisonView
- [x] 10.3 Create TrendChart component — line chart (recharts) showing score over time for re-analyzed URLs
- [x] 10.4 Create dashboard page (`app/dashboard/page.tsx`) — history list + trend chart + remaining quota + plan info
- [x] 10.5 Create PlanBadge component — shows current plan with upgrade link

## 11. PDF Export (REQ-PE-001, REQ-PE-002)

- [x] 11.1 Create PDF report template (HTML-based for browser print-to-PDF) — overall score, 7 dimensions, issues, suggestions
- [ ] 11.2 Implement white-label support — accept custom logo URL and primary color from AGENCY user settings
- [x] 11.3 Wire up PDF generation to `GET /api/report/[id]/pdf` route with AGENCY plan check

## 12. History & Trends (REQ-HT-001, REQ-HT-002, REQ-HT-003)

- [x] 12.1 Implement report persistence — save full report to DB for authenticated users after analysis
- [x] 12.2 Implement history list API with pagination and sorting
- [ ] 12.3 Implement re-analysis feature — "Re-analyze" button on historical reports
- [ ] 12.4 Implement trend data aggregation — group reports by URL, compute score deltas

## 13. Responsive & Polish (REQ-FE-005, REQ-FE-006)

- [ ] 13.1 Implement responsive layouts for all pages (desktop 1440px, tablet 768px, mobile 375px)
- [ ] 13.2 Implement dark/light mode toggle with localStorage persistence
- [ ] 13.3 Add loading skeletons for report and dashboard pages
- [ ] 13.4 Add error boundary and user-friendly error pages (404, 500, analysis failed)
- [ ] 13.5 Add meta tags, OG image, and favicon for the app itself

## 14. Testing & Deployment

- [ ] 14.1 Test full analysis pipeline end-to-end with 3 sample URLs (SaaS, e-commerce, portfolio)
- [ ] 14.2 Test plan gating — verify FREE limits, PRO unlock, AGENCY full access
- [ ] 14.3 Test Stripe checkout flow and webhook handling
- [ ] 14.4 Test PDF generation with white-label
- [ ] 14.5 Deploy to Vercel, configure environment variables, verify production build
- [ ] 14.6 Configure custom domain (if available)
- [ ] 14.7 Seed benchmark database by analyzing top 50 SaaS landing pages
