## ADDED Requirements

### Requirement: REQ-HT-001 Analysis History Storage
The system SHALL store all analysis reports for authenticated users in the database with full results.

#### Scenario: Report persistence
- **WHEN** an authenticated user completes an analysis
- **THEN** system stores the full report (URL, scores, suggestions, screenshot URL, timestamp) in the database linked to the user's account

#### Scenario: Anonymous user
- **WHEN** an unauthenticated user completes an analysis
- **THEN** system shows the report but does NOT persist it, with a prompt to sign up to save future reports

### Requirement: REQ-HT-002 History Dashboard
The system SHALL display a list of past analyses on the user's dashboard, sorted by date.

#### Scenario: History list view
- **WHEN** authenticated user navigates to dashboard
- **THEN** system displays a paginated list of past analyses showing: URL, overall score, letter grade, date, and a link to view the full report

#### Scenario: Empty history
- **WHEN** user has no past analyses
- **THEN** system shows an empty state with a CTA to analyze their first URL

### Requirement: REQ-HT-003 Score Trend Tracking
The system SHALL display score trends when the same URL has been analyzed multiple times.

#### Scenario: Trend visualization
- **WHEN** a URL has been analyzed 2+ times by the same user
- **THEN** system displays a line chart showing overall score and per-dimension scores over time

#### Scenario: Re-analysis
- **WHEN** user clicks "Re-analyze" on a historical report
- **THEN** system runs a fresh analysis on the same URL and adds the new result to the trend data
