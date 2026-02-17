## ADDED Requirements

### Requirement: REQ-CC-001 Side-by-Side Comparison
The system SHALL allow AGENCY users to analyze two URLs and display results in a side-by-side comparison view.

#### Scenario: Two-URL comparison
- **WHEN** AGENCY user submits two URLs for comparison
- **THEN** system runs the full analysis pipeline on both URLs and returns a comparison object with per-dimension scores for each URL

#### Scenario: Comparison summary
- **WHEN** comparison analysis is complete
- **THEN** system generates an AI-powered summary highlighting: which page wins on each dimension, key strengths/weaknesses of each, and top 3 recommendations for the user's page to beat the competitor

### Requirement: REQ-CC-002 Plan Gating for Comparison
The system SHALL restrict competitor comparison to AGENCY plan users only.

#### Scenario: Non-AGENCY user attempts comparison
- **WHEN** a FREE or PRO user attempts to use the comparison feature
- **THEN** system shows a locked state with upgrade prompt explaining the AGENCY plan benefit

#### Scenario: AGENCY user access
- **WHEN** an AGENCY user navigates to the comparison page
- **THEN** system shows the dual-URL input form and allows unlimited comparisons
