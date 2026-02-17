## ADDED Requirements

### Requirement: REQ-SS-001 Seven-Dimension Scoring
The system SHALL compute scores across 7 dimensions, each rated 0-100: Structure Completeness, Visual Design, Copy Quality, Conversion Optimization, Technical Performance, SEO Basics, and Industry Benchmark.

#### Scenario: All dimensions scored
- **WHEN** analysis engine returns complete results
- **THEN** system computes a score (0-100) for each of the 7 dimensions

#### Scenario: Missing dimension data
- **WHEN** a dimension's source data is unavailable (e.g., AI Vision failed)
- **THEN** system marks that dimension as "N/A" and excludes it from the overall score calculation

### Requirement: REQ-SS-002 Overall Score Aggregation
The system SHALL compute a weighted overall score from the 7 dimension scores using configurable weights.

#### Scenario: Weighted overall score
- **WHEN** all 7 dimension scores are available
- **THEN** system computes overall score as weighted average with default weights: Structure 15%, Design 10%, Copy 15%, Conversion 20%, Performance 15%, SEO 15%, Benchmark 10%

#### Scenario: Letter grade assignment
- **WHEN** overall score is computed
- **THEN** system assigns a letter grade: A+ (95-100), A (90-94), B+ (85-89), B (75-84), C (60-74), D (40-59), F (0-39)

### Requirement: REQ-SS-003 Structure Completeness Score
The system SHALL detect the presence of key landing page sections and score completeness.

#### Scenario: Section detection scoring
- **WHEN** DOM extraction identifies page sections
- **THEN** system checks for: Hero (h1 + subtitle + CTA), Social Proof (logos/numbers), How It Works, Features, Testimonials, Pricing, FAQ, Lead Capture Form, Footer. Each present section adds points proportionally.

### Requirement: REQ-SS-004 Visual Design Score
The system SHALL score visual design quality based on AI Vision analysis of the page screenshot.

#### Scenario: Design scoring from AI Vision
- **WHEN** AI Vision returns design analysis
- **THEN** system extracts numeric sub-scores for: color harmony, typography, whitespace/spacing, visual hierarchy, and overall aesthetics, then averages them into the Design dimension score

### Requirement: REQ-SS-005 Copy Quality Score
The system SHALL score the quality of page copy using AI text analysis.

#### Scenario: Copy analysis
- **WHEN** DOM text content is extracted
- **THEN** system sends headline, subheadline, CTA text, and body copy to AI API for analysis of: clarity, persuasiveness, value proposition strength, CTA action-orientation, and grammar. Returns a 0-100 score.

### Requirement: REQ-SS-006 Conversion Optimization Score
The system SHALL score conversion optimization based on custom rule engine analysis of DOM elements.

#### Scenario: Conversion rules evaluation
- **WHEN** DOM data is available
- **THEN** system evaluates: CTA above the fold (yes/no), number of CTAs, form field count (fewer is better), trust signals present (badges, logos, stats), urgency elements, social proof strength. Each rule contributes to the dimension score.

### Requirement: REQ-SS-007 Technical Performance Score
The system SHALL derive the performance score from Lighthouse Performance category score enriched with HAR-based resource analysis and extended metrics from puppeteer-webperf.

#### Scenario: Performance score mapping
- **WHEN** Lighthouse audit and HAR capture complete
- **THEN** system uses Lighthouse Performance score (0-100) as the base, with penalty deductions for: excessive total transfer size (>3MB: -5pts), excessive request count (>80: -3pts), render-blocking resources (>5: -3pts), excessive DOM nodes (>1500: -2pts), long tasks (>3 tasks over 50ms: -2pts). Final score clamped to 0-100.

#### Scenario: Resource detail sub-metrics
- **WHEN** HAR data is available
- **THEN** system includes in the report details: total transfer size, request count by type, top 5 largest resources, third-party request percentage, and unused JS estimate — displayed as supplementary data in the Performance dimension

### Requirement: REQ-SS-008 SEO Basics Score
The system SHALL score SEO fundamentals by combining Lighthouse SEO score with custom checks.

#### Scenario: SEO scoring
- **WHEN** Lighthouse SEO audit and DOM extraction are complete
- **THEN** system evaluates: title tag (present, length 50-60 chars), meta description (present, length 150-160 chars), OG tags (title, description, image), heading hierarchy (single h1, proper nesting), image alt texts, canonical URL, structured data presence. Combined with Lighthouse SEO score.

### Requirement: REQ-SS-010 Accessibility Sub-Scoring
The system SHALL enrich the report with a detailed accessibility breakdown using Pa11y WCAG 2.1 AA results, surfaced as issues within the Structure and Performance dimensions.

#### Scenario: Pa11y issues integration
- **WHEN** Pa11y audit returns WCAG violations
- **THEN** system categorizes violations by severity (error → high, warning → medium, notice → low), includes them in the issues list with WCAG code references, and applies a penalty to the overall score: -2pts per error (max -10), -1pt per warning (max -5)

#### Scenario: Accessibility highlights in report
- **WHEN** Pa11y finds critical issues (missing alt text, insufficient contrast, missing form labels)
- **THEN** system surfaces these as high-severity issues in the report with specific CSS selectors and remediation guidance

### Requirement: REQ-SS-011 Front-End Quality Checks
The system SHALL evaluate front-end code quality using metrics inspired by YellowLabTools, surfaced as issues within relevant dimensions.

#### Scenario: CSS complexity evaluation
- **WHEN** extended metrics include CSS data
- **THEN** system flags: excessive CSS rules (>1000: warning), excessive !important usage (>20: warning), high inline style count (>50: warning), excessive DOM depth (>15 levels: warning). Issues are added to the Structure dimension.

#### Scenario: JavaScript health evaluation
- **WHEN** HAR and extended metrics include JS data
- **THEN** system flags: excessive JS transfer size (>500KB: warning), high event listener count (>200: warning), unused JS percentage (>40%: warning). Issues are added to the Performance dimension.

### Requirement: REQ-SS-009 Industry Benchmark Score
The system SHALL compare the page's scores against stored industry averages to produce a percentile ranking.

#### Scenario: Benchmark with sufficient data
- **WHEN** the page's industry is detected or user-specified AND the system has 50+ reports for that industry
- **THEN** system computes percentile rank for each dimension and overall score against the industry dataset

#### Scenario: Benchmark with insufficient data
- **WHEN** industry data has fewer than 50 reports
- **THEN** system compares against the global average of all analyzed pages and notes "limited industry data"
