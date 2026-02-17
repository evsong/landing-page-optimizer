## Why

Marketers, SaaS founders, and agencies lack a single tool that analyzes landing page quality across all dimensions (performance, SEO, design, copy, conversion) and provides AI-generated actionable fixes. Existing tools are fragmented: PageSpeed only checks speed, Hotjar only shows behavior, builders like Unbounce ($187/mo) only analyze their own pages. The $0-$99/mo price range is underserved, and no tool answers "what specifically should I change?" — they only show data. The keyword "landing page analyzer" has 170K/mo search volume at 15% KD, representing a clear SEO opportunity.

## What Changes

- Add URL-based landing page analysis engine (Puppeteer + Lighthouse + AI Vision)
- Add 7-dimension scoring system (structure, design, copy, conversion, performance, SEO, benchmark)
- Add AI-powered actionable optimization suggestions with copy rewrites
- Add competitor landing page comparison (side-by-side URL analysis)
- Add PDF report export with white-label support
- Add analysis history tracking with score trend visualization
- Add user authentication and 3-tier plan gating (FREE/PRO/AGENCY)
- Add Stripe payment integration

## Capabilities

### New Capabilities
- `analysis-engine`: Core URL analysis pipeline — Puppeteer page loading, Lighthouse performance/SEO/a11y audits, DOM extraction for custom rule engine, screenshot capture for AI Vision analysis. Orchestrates the 3-layer analysis flow and returns structured results.
- `scoring-system`: 7-dimension scoring engine — structure completeness (section detection), visual design (AI Vision), copy quality (AI text analysis), conversion optimization (CTA/form/trust signal rules), technical performance (Lighthouse), SEO basics (meta/OG/heading), industry benchmark (percentile ranking). Weighted aggregation into overall score.
- `ai-suggestions`: AI-powered actionable optimization suggestions — reads analysis results, generates specific copy rewrites, CTA improvements, layout adjustments, and performance fixes. Uses Claude/GPT API. Differentiates FREE (summary only) vs PRO (detailed suggestions with rewrites).
- `competitor-compare`: Side-by-side landing page comparison — runs analysis on two URLs, generates per-dimension comparison, highlights strengths/weaknesses, produces diff summary. AGENCY-only feature.
- `pdf-export`: PDF report generation — renders analysis report as downloadable PDF with optional white-label branding (custom logo, colors). AGENCY-only feature.
- `history-tracking`: Analysis history and trend tracking — stores past reports per user, displays score trend charts over time, enables re-analysis of same URL to track improvements.
- `user-system`: User authentication (NextAuth) and subscription management — email/OAuth login, 3-tier plan gating (FREE: 3 analyses/mo, PRO: unlimited + AI suggestions, AGENCY: bulk + compare + PDF + API), Stripe integration for payments.
- `frontend`: Landing page, analysis report page, comparison page, dashboard, and shared UI components — URL input form, score visualizations (ring chart, dimension bars), suggestion cards, locked sections for upsell.

### Modified Capabilities
<!-- No existing specs to modify — this is a greenfield project -->

## Impact

- **New codebase**: Next.js app with ~15-20 components, ~10 API routes, ~6 DB models
- **Dependencies**: @sparticuz/chromium, lighthouse, puppeteer-core, pa11y, @anthropic-ai/sdk or openai, @prisma/client, next-auth, stripe, jspdf/react-pdf
- **External APIs**: Claude or GPT-4o Vision API (~$0.03-0.05/analysis), Stripe
- **Infrastructure**: Vercel (serverless functions need sufficient memory for Chromium ~512MB), Neon PostgreSQL
- **Cost structure**: ~$0.05/analysis (AI API + compute), FREE tier capped at 3/mo to limit cost exposure
