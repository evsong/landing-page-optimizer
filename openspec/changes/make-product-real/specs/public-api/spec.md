## ADDED Requirements

### Requirement: API Key management
The system SHALL allow Agency users to generate and view an API key in Settings.

#### Scenario: Agency user generates API key
- **WHEN** an Agency user clicks "Generate API Key" in Settings
- **THEN** a unique API key is created, saved to the database, and displayed once

#### Scenario: Non-Agency user cannot generate API key
- **WHEN** a FREE or PRO user visits Settings
- **THEN** the API key section is not shown

### Requirement: Public analyze endpoint
The system SHALL expose POST `/api/v1/analyze` accepting a URL and returning analysis results, authenticated via API key in the `Authorization` header.

#### Scenario: Valid API key submits URL
- **WHEN** a request with valid Agency API key sends `{ "url": "https://example.com" }`
- **THEN** the system runs the full analysis pipeline and returns JSON results

#### Scenario: Invalid or missing API key
- **WHEN** a request has no or invalid API key
- **THEN** the server returns 401 Unauthorized

### Requirement: Public reports listing endpoint
The system SHALL expose GET `/api/v1/reports` returning the user's analysis history, authenticated via API key.

#### Scenario: Agency user lists reports
- **WHEN** a request with valid API key calls GET `/api/v1/reports`
- **THEN** the server returns a JSON array of the user's analysis reports

### Requirement: API rate limiting
The system SHALL limit API requests to 10 per minute per API key.

#### Scenario: Rate limit exceeded
- **WHEN** an API key makes more than 10 requests in one minute
- **THEN** the server returns 429 Too Many Requests
