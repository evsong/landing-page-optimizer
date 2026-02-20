## ADDED Requirements

### Requirement: PDF report generation
The system SHALL generate a PDF document containing the full analysis report (scores, issues, suggestions) using `@react-pdf/renderer`.

#### Scenario: User downloads PDF
- **WHEN** a user clicks the PDF button on a report page
- **THEN** a PDF file downloads containing the 7-dimension scores, issue list, and AI suggestions

### Requirement: PDF API route
The system SHALL expose a GET `/api/report/[id]/pdf` endpoint that returns the PDF as a downloadable file.

#### Scenario: Authenticated user requests PDF
- **WHEN** an authenticated user requests `/api/report/[id]/pdf`
- **THEN** the server returns a PDF with `Content-Type: application/pdf`

#### Scenario: Unauthenticated request
- **WHEN** an unauthenticated user requests the PDF endpoint
- **THEN** the server returns 401 Unauthorized
