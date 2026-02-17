## ADDED Requirements

### Requirement: REQ-AE-001 Page Loading and Rendering
The system SHALL load any user-provided URL using Puppeteer with @sparticuz/chromium in a Vercel Serverless Function. The system MUST wait for the page to be fully rendered (networkidle0 or max 15 seconds) before proceeding with analysis.

#### Scenario: Valid URL analysis
- **WHEN** user submits a valid URL (e.g., https://example.com)
- **THEN** system loads the page in headless Chromium, waits for render completion, and proceeds to data extraction

#### Scenario: Invalid or unreachable URL
- **WHEN** user submits an invalid URL or a URL that cannot be reached (timeout, DNS failure, 4xx/5xx)
- **THEN** system returns an error response with a human-readable message explaining the failure

#### Scenario: Redirect handling
- **WHEN** the target URL redirects to another URL
- **THEN** system follows redirects (up to 5 hops) and analyzes the final destination page

### Requirement: REQ-AE-002 Screenshot Capture
The system SHALL capture a full-page screenshot of the rendered page in PNG format for use by the AI Vision analysis layer.

#### Scenario: Full-page screenshot
- **WHEN** page rendering is complete
- **THEN** system captures a full-page screenshot (viewport width 1440px) and stores it temporarily for AI Vision processing

#### Scenario: Mobile screenshot
- **WHEN** page rendering is complete
- **THEN** system also captures a mobile viewport screenshot (375px width) for responsive design analysis

### Requirement: REQ-AE-003 DOM Extraction
The system SHALL extract structured DOM data from the rendered page for use by the scoring system and custom rule engine.

#### Scenario: DOM data extraction
- **WHEN** page rendering is complete
- **THEN** system extracts: all headings (h1-h6) with text, all links with href, all images with src/alt, all forms with fields, all buttons/CTAs with text, meta tags, OG tags, structured data (JSON-LD), and page text content

#### Scenario: Section detection
- **WHEN** DOM data is extracted
- **THEN** system identifies page sections by semantic HTML landmarks, common class names, and content patterns (hero, features, testimonials, pricing, FAQ, footer, etc.)

### Requirement: REQ-AE-004 Lighthouse Audit
The system SHALL run Google Lighthouse programmatically via its Node API on the loaded page to generate performance, accessibility, best practices, and SEO scores.

#### Scenario: Lighthouse audit execution
- **WHEN** page URL is provided
- **THEN** system runs Lighthouse with categories [performance, accessibility, best-practices, seo] and returns category scores (0-100) plus individual audit results

#### Scenario: Lighthouse timeout
- **WHEN** Lighthouse audit exceeds 45 seconds
- **THEN** system aborts the audit and returns partial results with a warning that performance data may be incomplete

### Requirement: REQ-AE-005 AI Vision Analysis
The system SHALL send the full-page screenshot to an AI Vision API (Claude or GPT-4o) to analyze visual design quality, layout, and aesthetics.

#### Scenario: Vision analysis execution
- **WHEN** full-page screenshot is captured
- **THEN** system sends the screenshot to AI Vision API with a structured prompt requesting scores and feedback on: color harmony, typography, whitespace, visual hierarchy, brand consistency, and overall design quality

#### Scenario: Vision API failure
- **WHEN** AI Vision API call fails or times out
- **THEN** system marks the design score as "unavailable" and completes the report with the remaining 6 dimensions

### Requirement: REQ-AE-007 Pa11y Accessibility Audit
The system SHALL run Pa11y programmatically on the loaded page to generate detailed WCAG 2.1 AA violation reports with specific issue codes, selectors, and remediation context — complementing Lighthouse's coarser accessibility score.

#### Scenario: Pa11y audit execution
- **WHEN** page URL is provided
- **THEN** system runs Pa11y with `standard: 'WCAG2AA'` and `runner: 'axe'`, returning an array of issues each containing: code, type (error/warning/notice), message, selector, and context snippet

#### Scenario: Pa11y timeout or failure
- **WHEN** Pa11y audit exceeds 20 seconds or crashes
- **THEN** system falls back to Lighthouse accessibility data only and marks Pa11y results as unavailable

### Requirement: REQ-AE-008 HAR Capture and Resource Analysis
The system SHALL capture a HAR (HTTP Archive) file via Puppeteer CDP during page load to analyze resource loading patterns, total transfer size, and request waterfall data.

#### Scenario: HAR data capture
- **WHEN** page loading begins
- **THEN** system enables CDP Network domain, records all network requests/responses, and produces a HAR-like object containing: total requests count, total transfer size (bytes), requests by type (document, script, stylesheet, image, font, other), largest resources (top 5 by size), and third-party request count

#### Scenario: Resource analysis
- **WHEN** HAR data is captured
- **THEN** system computes: number of render-blocking resources, unused JavaScript percentage estimate (via Coverage API), total image weight, and whether images use modern formats (WebP/AVIF)

### Requirement: REQ-AE-009 Extended Performance Metrics
The system SHALL extract additional performance metrics beyond Lighthouse using Puppeteer Performance API and CDP, inspired by puppeteer-webperf recipes.

#### Scenario: Extended metrics collection
- **WHEN** page rendering is complete
- **THEN** system extracts via `page.evaluate()` and CDP: `performance.getEntriesByType('resource')` count and total duration, `PerformanceObserver` long task count (tasks > 50ms), DOM node count, DOM max depth, and total event listener count

#### Scenario: CSS complexity analysis
- **WHEN** DOM data is extracted
- **THEN** system evaluates: total stylesheet count, total CSS rules count (via `document.styleSheets`), number of `!important` declarations, and inline style count — inspired by YellowLabTools front-end quality checks

### Requirement: REQ-AE-006 Analysis Orchestration
The system SHALL orchestrate the full analysis pipeline and return a unified result object containing all extracted data, scores, and raw audit results.

#### Scenario: Complete analysis pipeline
- **WHEN** user submits a URL for analysis
- **THEN** system executes in order: page load (with HAR capture via CDP) → screenshot capture → DOM extraction + extended metrics → Lighthouse audit ∥ Pa11y audit (parallel) → AI Vision analysis → result aggregation, completing within 60 seconds

#### Scenario: Partial failure resilience
- **WHEN** any single analysis layer fails (e.g., Lighthouse timeout, Vision API error)
- **THEN** system continues with remaining layers and returns a partial report with clear indicators of which dimensions have incomplete data
