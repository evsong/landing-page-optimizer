## ADDED Requirements

### Requirement: REQ-FE-001 Landing Page
The system SHALL display a marketing landing page with Hero section (URL input + analyze CTA), feature highlights (7 dimensions), pricing table (FREE/PRO/AGENCY), FAQ, and footer.

#### Scenario: Hero URL input
- **WHEN** visitor enters a URL in the hero input and clicks "Analyze"
- **THEN** system navigates to the analysis loading state and begins the analysis pipeline

#### Scenario: Pricing display
- **WHEN** visitor scrolls to pricing section
- **THEN** system displays 3 plan cards (FREE $0, PRO $5.99/mo, AGENCY $49/mo) with feature comparison and CTA buttons

### Requirement: REQ-FE-002 Analysis Report Page
The system SHALL display a comprehensive analysis report with overall score ring chart, 7-dimension score bars, issue list, and AI suggestions.

#### Scenario: Report display
- **WHEN** analysis is complete and user navigates to /report/[id]
- **THEN** system displays: overall score as animated ring chart with letter grade, 7 dimension scores as horizontal bars with color coding (green/yellow/red), expandable issue list per dimension, and AI suggestion cards

#### Scenario: Loading state
- **WHEN** analysis is in progress
- **THEN** system displays a progress indicator showing current analysis step (Loading page → Running audits → AI analysis → Generating report)

#### Scenario: Locked sections
- **WHEN** FREE user views a report
- **THEN** system shows detailed AI suggestions and copy rewrites as blurred/locked with upgrade prompts

### Requirement: REQ-FE-003 Comparison Page
The system SHALL display a side-by-side comparison of two landing page analyses for AGENCY users.

#### Scenario: Comparison view
- **WHEN** AGENCY user completes a comparison analysis
- **THEN** system displays two reports side by side with per-dimension score comparison, winner indicators, and AI-generated comparison summary

### Requirement: REQ-FE-004 User Dashboard
The system SHALL display a dashboard with analysis history, score trends, remaining quota, and account settings.

#### Scenario: Dashboard view
- **WHEN** authenticated user navigates to /dashboard
- **THEN** system displays: analysis history list (URL, score, date), score trend chart for re-analyzed URLs, remaining analyses count (FREE users), and plan/billing info

### Requirement: REQ-FE-005 Responsive Design
The system SHALL be fully responsive across desktop (1440px+), tablet (768px), and mobile (375px) viewports.

#### Scenario: Mobile report view
- **WHEN** user views a report on a mobile device
- **THEN** system stacks dimension scores vertically, collapses suggestion cards, and maintains readability of all text and charts

### Requirement: REQ-FE-006 Dark Mode
The system SHALL support dark mode as the default theme with an optional light mode toggle.

#### Scenario: Default dark mode
- **WHEN** user visits the site for the first time
- **THEN** system renders in dark mode with appropriate contrast ratios meeting WCAG AA standards
