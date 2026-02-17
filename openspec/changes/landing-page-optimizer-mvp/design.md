## Context

Landing Page Optimizer is a greenfield Next.js application. No existing codebase — we're building from scratch following the same architecture patterns proven in Social Media Audit Pro (Next.js + Prisma + Neon + Vercel + NextAuth + Stripe).

The core technical challenge is running Puppeteer + Lighthouse inside Vercel Serverless Functions, which have memory limits (~1GB on Pro) and execution time limits (60s free, 300s Pro). The analysis pipeline must complete within these constraints.

Target: ship full MVP in 2-3 days.

## Goals / Non-Goals

**Goals:**
- Input any URL → get 7-dimension score + AI suggestions in under 60 seconds
- Support 3-tier plan gating with Stripe payments
- Competitor comparison for AGENCY users
- PDF export with white-label
- History tracking with trend charts
- Dark mode default, fully responsive

**Non-Goals:**
- Page builder / drag-and-drop editor (we analyze, not build)
- Heatmaps or session recording (requires JS snippet installation)
- A/B testing engine
- Real-time monitoring / alerting
- Browser extension (future consideration)
- Multi-language UI (English only for MVP)
- Custom Lighthouse plugins (use stock audits)

## Decisions

### D1: Analysis Pipeline Architecture

**Decision**: Sequential pipeline in a single Vercel Serverless Function.

```
POST /api/analyze { url }
    │
    ├─ 1. Puppeteer: load page, wait networkidle0 (max 15s), HAR capture via CDP
    ├─ 2. Puppeteer: capture full-page screenshot (1440px + 375px)
    ├─ 3. Puppeteer: extract DOM data + extended metrics (DOM nodes, depth, listeners, CSS complexity)
    ├─ 4. Parallel:
    │   ├─ Lighthouse: run via Node API (performance, a11y, best-practices, seo)
    │   └─ Pa11y: run with axe runner, WCAG2AA standard → detailed violation list
    ├─ 5. HAR Analysis: resource count by type, transfer sizes, render-blocking, unused JS estimate
    ├─ 6. Scoring Engine: compute structure, conversion, SEO scores from DOM + Lighthouse + Pa11y + HAR data
    ├─ 7. AI Vision: send screenshot to Claude/GPT-4o → design score
    ├─ 8. AI Text: send DOM text + scores to Claude Haiku → copy score + suggestions + rewrites
    ├─ 9. Benchmark: compare against stored industry averages
    └─ 10. Aggregate: weighted overall score + letter grade → save to DB → return
```

**Why single function**: Avoids queue/worker complexity. Vercel Pro allows 300s timeout, and our pipeline targets 30-45s. If we hit limits, we can split into async (submit → poll) later.

**Key integration**: Lighthouse and Pa11y run in parallel on the same URL to maximize throughput. Pa11y uses the axe-core runner for WCAG 2.1 AA compliance. HAR data is captured passively via CDP during the initial page load — zero extra latency.

### D2: Chromium in Serverless

**Decision**: Use `@sparticuz/chromium` (v131+) with `puppeteer-core`.

- `@sparticuz/chromium`: ~50MB compressed Chromium binary optimized for Lambda/Vercel
- `puppeteer-core`: no bundled Chromium, uses the sparticuz binary
- Lighthouse: use `lighthouse` npm package with `puppeteer` as the Chrome launcher
- Pa11y: use `pa11y` npm package with `runner: 'axe'` for WCAG 2.1 AA compliance checks
- `puppeteer-har`: HAR capture via CDP during page load (or manual CDP Network domain recording)

**Config**:
```js
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

const browser = await puppeteer.launch({
  args: chromium.args,
  defaultViewport: { width: 1440, height: 900 },
  executablePath: await chromium.executablePath(),
  headless: chromium.headless,
});
```

**Vercel function config** (next.config.js):
```js
api: {
  bodyParser: { sizeLimit: '10mb' },
  responseLimit: '10mb',
},
serverless: {
  maxDuration: 60, // seconds, increase to 300 on Pro
  memory: 1024,    // MB
}
```

### D3: Database Schema

**Decision**: Prisma + Neon PostgreSQL (serverless).

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  image         String?
  plan          Plan     @default(FREE)
  stripeCustomerId String?
  stripeSubscriptionId String?
  analysisCount Int      @default(0)
  monthResetAt  DateTime @default(now())
  reports       AnalysisReport[]
  comparisons   ComparisonReport[]
  accounts      Account[]
  sessions      Session[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

enum Plan {
  FREE
  PRO
  AGENCY
}

model AnalysisReport {
  id              String   @id @default(cuid())
  url             String
  overallScore    Float
  letterGrade     String
  structureScore  Float
  designScore     Float?
  copyScore       Float?
  conversionScore Float
  performanceScore Float
  seoScore        Float
  benchmarkScore  Float?
  industry        String?
  issues          Json     // Array of { dimension, severity, message }
  suggestions     Json     // Array of { title, impact, fix, dimension }
  copyRewrites    Json?    // Array of { element, original, alternatives[] }
  lighthouseData  Json     // Raw Lighthouse results
  screenshotUrl   String?
  mobileScreenshotUrl String?
  userId          String?
  user            User?    @relation(fields: [userId], references: [id])
  createdAt       DateTime @default(now())
}

model ComparisonReport {
  id          String   @id @default(cuid())
  urlA        String
  urlB        String
  reportAId   String
  reportBId   String
  summary     String   // AI-generated comparison summary
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
}

// NextAuth models: Account, Session, VerificationToken (standard)
```

### D4: AI API Strategy

**Decision**: Claude API as primary, OpenAI as fallback.

| Task | Model | Est. Cost | Timeout |
|------|-------|-----------|---------|
| Vision analysis (screenshot) | Claude Sonnet (vision) | ~$0.02 | 15s |
| Copy analysis + suggestions | Claude Haiku | ~$0.005 | 10s |
| Copy rewrites | Claude Haiku | ~$0.005 | 10s |
| Comparison summary | Claude Haiku | ~$0.005 | 10s |

**Total per analysis**: ~$0.03-0.04

**Prompt structure**: System prompt defines the scoring rubric and output JSON schema. User prompt contains the extracted data. Response is structured JSON for reliable parsing.

**Caching**: Store AI results in DB. If same URL analyzed within 24h, return cached AI results (skip Vision + Text API calls, still re-run Lighthouse for fresh performance data).

### D5: Screenshot Storage

**Decision**: Store screenshots as base64 in the AI API call, save a compressed thumbnail in the DB for report display.

- Full screenshot: sent directly to AI Vision API, not persisted long-term
- Thumbnail (800px wide, JPEG 70% quality): stored as base64 in DB or uploaded to Vercel Blob
- Reason: avoids external storage dependency for MVP. Can migrate to S3/Cloudflare R2 later.

### D6: PDF Generation

**Decision**: Use `@react-pdf/renderer` for server-side PDF generation.

- Renders React components to PDF
- Supports custom fonts, colors, layouts
- White-label: swap logo and primary color based on user's AGENCY settings
- Generated on-demand via API route, not pre-stored

### D7: Frontend Component Architecture

```
app/
├── page.tsx                    # Landing page (Hero + Features + Pricing + FAQ)
├── analyze/page.tsx            # Analysis loading/progress page
├── report/[id]/page.tsx        # Full analysis report
├── compare/page.tsx            # Competitor comparison (AGENCY)
├── dashboard/page.tsx          # User dashboard + history
├── auth/signin/page.tsx        # Auth page
├── api/
│   ├── analyze/route.ts        # POST: run analysis
│   ├── compare/route.ts        # POST: run comparison
│   ├── report/[id]/route.ts    # GET: fetch report
│   ├── report/[id]/pdf/route.ts # GET: generate PDF
│   ├── history/route.ts        # GET: user's reports
│   ├── auth/[...nextauth]/route.ts
│   └── webhooks/stripe/route.ts
├── components/
│   ├── UrlInput.tsx             # URL input with validation
│   ├── ScoreRing.tsx            # Animated circular score chart
│   ├── DimensionBar.tsx         # Horizontal score bar with color
│   ├── IssueList.tsx            # Expandable issue list per dimension
│   ├── SuggestionCard.tsx       # AI suggestion with impact badge
│   ├── CopyRewriteCard.tsx      # Original vs alternatives
│   ├── LockedSection.tsx        # Blur + upgrade prompt
│   ├── ComparisonView.tsx       # Side-by-side report
│   ├── TrendChart.tsx           # Score over time line chart
│   ├── PricingTable.tsx         # 3-tier pricing cards
│   ├── ProgressSteps.tsx        # Analysis progress indicator
│   └── PlanBadge.tsx            # User plan indicator
└── lib/
    ├── analyzer.ts              # Analysis pipeline orchestrator
    ├── lighthouse.ts            # Lighthouse runner
    ├── dom-extractor.ts         # DOM data extraction
    ├── pa11y.ts                 # Pa11y accessibility runner
    ├── har-analyzer.ts          # HAR capture + resource analysis
    ├── extended-metrics.ts      # DOM depth, listeners, CSS complexity, long tasks
    ├── scoring.ts               # 7-dimension scoring engine
    ├── rules/                   # Custom rule definitions
    │   ├── structure.ts
    │   ├── conversion.ts
    │   ├── seo.ts
    │   ├── accessibility.ts     # Pa11y-based a11y penalty rules
    │   └── frontend-quality.ts  # CSS/JS health checks (YellowLabTools-inspired)
    ├── ai/
    │   ├── vision.ts            # AI Vision analysis
    │   ├── suggestions.ts       # AI suggestion generation
    │   └── rewrites.ts          # AI copy rewrite generation
    ├── pdf.ts                   # PDF generation
    ├── stripe.ts                # Stripe helpers
    ├── rate-limit.ts            # Rate limiting
    └── prisma.ts                # Prisma client singleton
```

### D8: Scoring Engine Design

**Decision**: Rule-based scoring with configurable weights.

Each dimension has a scorer function: `(data: AnalysisData) => DimensionResult`

```ts
interface DimensionResult {
  score: number;        // 0-100
  issues: Issue[];      // detected problems
  details: Record<string, any>; // dimension-specific data
}

interface Issue {
  severity: 'high' | 'medium' | 'low';
  message: string;
  suggestion: string;
}
```

Overall score = weighted average of dimension scores.

Default weights: Structure 15%, Design 10%, Copy 15%, Conversion 20%, Performance 15%, SEO 15%, Benchmark 10%.

## Risks / Trade-offs

**[Chromium memory in serverless]** → Mitigation: Use @sparticuz/chromium (optimized for serverless), set function memory to 1024MB, close browser immediately after use. Monitor with Vercel analytics.

**[60s timeout on Vercel free tier]** → Mitigation: Target 30-45s pipeline. If needed, upgrade to Vercel Pro (300s). Can also split into async submit/poll pattern later.

**[AI Vision cost at scale]** → Mitigation: 24h cache for same URL. FREE tier limited to 3/month. Use cheapest vision-capable model. Monitor costs weekly.

**[Lighthouse accuracy in serverless]** → Mitigation: Lighthouse in serverless may give slightly different scores than local Chrome. Document this as "lab data" (consistent with Google's own terminology). Scores are relative, not absolute.

**[Screenshot storage growth]** → Mitigation: Store only thumbnails for MVP. Implement TTL cleanup (delete screenshots older than 90 days for FREE users). Migrate to object storage if DB grows too large.

**[Industry benchmark cold start]** → Mitigation: Start with global averages. Seed initial data by analyzing top 100 SaaS landing pages. Mark benchmark as "beta" until 50+ reports per industry.
