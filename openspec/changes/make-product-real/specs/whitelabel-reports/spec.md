## ADDED Requirements

### Requirement: Agency users can set brand settings
The system SHALL allow Agency plan users to configure brand logo URL, company name, and brand color in Settings.

#### Scenario: Agency user saves brand settings
- **WHEN** an Agency user fills in logo URL, company name, and brand color in Settings
- **THEN** the values are saved to the database and used in future PDF exports

#### Scenario: Non-Agency user cannot access brand settings
- **WHEN** a FREE or PRO user visits Settings
- **THEN** the brand settings section is not shown

### Requirement: White-label PDF uses custom branding
The system SHALL render PDF reports with the user's brand settings (logo, name, color) instead of PageScore branding when available.

#### Scenario: Agency user downloads branded PDF
- **WHEN** an Agency user with brand settings downloads a PDF report
- **THEN** the PDF header shows their logo and company name instead of PageScore
