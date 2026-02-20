## 1. Fix Chromium on Vercel

- [x] 1.1 Replace `@sparticuz/chromium` with `@sparticuz/chromium-min` in package.json
- [x] 1.2 Update browser launch code to use chromium-min with CDN download URL
- [x] 1.3 Add `@sparticuz/chromium-min` to `serverExternalPackages` in next.config.ts
- [x] 1.4 Verify `next build` succeeds and test analysis on deployed Vercel

## 2. Legal Pages

- [x] 2.1 Create `/privacy` page with real privacy policy content
- [x] 2.2 Create `/terms` page with real terms of service content
- [x] 2.3 Update footer links from `#` to `/privacy` and `/terms`

## 3. Fix Social Proof

- [x] 3.1 Replace hardcoded "2,000+" stats with real count from database or honest generic text

## 4. Benchmark Scoring

- [x] 4.1 Update scoring logic to calculate percentile rank via COUNT query on analysisReport
- [x] 4.2 Ensure benchmark score is saved to report and displayed on report page

## 5. PDF Export

- [x] 5.1 Create PDF template component with @react-pdf/renderer (scores, issues, suggestions)
- [x] 5.2 Create/update GET `/api/report/[id]/pdf` route to return PDF stream
- [x] 5.3 Wire up PDF download button on report page to call the API route

## 6. Creem Payment

- [x] 6.1 Install `creem` SDK, remove `stripe` dependency
- [x] 6.2 Create POST `/api/checkout` route — creates Creem checkout session, returns redirect URL
- [x] 6.3 Create POST `/api/webhooks/creem` route — handles checkout.completed and subscription.canceled
- [x] 6.4 Update pricing CTAs to call `/api/checkout` instead of linking to signin
- [x] 6.5 Delete Stripe-related files (`/api/upgrade`, `/api/webhooks/stripe`) and env vars
- [ ] 6.6 Add CREEM_API_KEY and CREEM_WEBHOOK_SECRET to Vercel env vars

## 7. White-Label Reports

- [x] 7.1 Add brandLogo, brandName, brandColor, apiKey fields to User model (Prisma migration)
- [x] 7.2 Add brand settings UI section to Settings page (Agency only)
- [x] 7.3 Update PDF template to use user's brand settings when available

## 8. Public API

- [x] 8.1 Add API key generation UI to Settings page (Agency only)
- [x] 8.2 Create API key auth middleware (parse Bearer token, look up user)
- [x] 8.3 Create POST `/api/v1/analyze` route with API key auth
- [x] 8.4 Create GET `/api/v1/reports` route with API key auth
- [x] 8.5 Add rate limiting (10 req/min per key) to API routes

## 9. Verify & Deploy

- [ ] 9.1 Run full build, fix any errors
- [ ] 9.2 Deploy to Vercel, test complete flow: analyze URL → view report → download PDF
- [ ] 9.3 Test Creem checkout flow (test mode)
- [ ] 9.4 Verify privacy/terms pages accessible, footer links work
- [ ] 9.5 Confirm support@landingpageoptimizer.online receives email
