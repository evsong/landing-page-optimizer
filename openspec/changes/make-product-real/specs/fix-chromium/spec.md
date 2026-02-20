## ADDED Requirements

### Requirement: Chromium runs on Vercel serverless
The system SHALL use `@sparticuz/chromium-min` to launch Chromium in Vercel serverless functions, downloading the binary from a CDN at runtime.

#### Scenario: Successful page analysis on Vercel
- **WHEN** a user submits a URL for analysis on the production Vercel deployment
- **THEN** Puppeteer launches Chromium via `@sparticuz/chromium-min`, loads the page, captures screenshot, and returns analysis results without path errors

#### Scenario: Local development fallback
- **WHEN** the app runs locally (no `VERCEL_ENV`)
- **THEN** the system uses standard `puppeteer` with local Chromium

### Requirement: Next.js config excludes chromium from bundling
The system SHALL configure `serverExternalPackages` in `next.config.ts` to prevent Next.js from bundling chromium-min.

#### Scenario: Build succeeds with chromium-min
- **WHEN** `next build` runs
- **THEN** the build completes without chromium-related errors
