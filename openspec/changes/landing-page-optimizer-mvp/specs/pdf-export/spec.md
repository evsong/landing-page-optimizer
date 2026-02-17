## ADDED Requirements

### Requirement: REQ-PE-001 PDF Report Generation
The system SHALL generate a downloadable PDF report from analysis results for AGENCY plan users.

#### Scenario: Standard PDF export
- **WHEN** AGENCY user clicks "Export PDF" on a report page
- **THEN** system generates a PDF containing: overall score, 7-dimension breakdown, top issues, AI suggestions, page screenshot, and metadata (URL, date, analysis ID)

#### Scenario: White-label PDF
- **WHEN** AGENCY user has configured custom branding (logo, company name, colors)
- **THEN** system generates the PDF with the user's branding instead of default Landing Page Optimizer branding

### Requirement: REQ-PE-002 PDF Plan Gating
The system SHALL restrict PDF export to AGENCY plan users.

#### Scenario: Non-AGENCY user attempts export
- **WHEN** a FREE or PRO user clicks "Export PDF"
- **THEN** system shows an upgrade prompt for the AGENCY plan
