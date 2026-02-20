## ADDED Requirements

### Requirement: Privacy Policy page exists
The system SHALL serve a Privacy Policy page at `/privacy` covering data collection, cookies, third-party services, and user rights.

#### Scenario: User visits privacy page
- **WHEN** a user navigates to `/privacy`
- **THEN** a complete privacy policy is displayed with sections for data collection, cookies, third-party services (Claude AI, Neon DB), and contact information

### Requirement: Terms of Service page exists
The system SHALL serve a Terms of Service page at `/terms` covering usage limits, acceptable use, refund policy, and liability.

#### Scenario: User visits terms page
- **WHEN** a user navigates to `/terms`
- **THEN** a complete terms of service is displayed

### Requirement: Footer links point to real pages
The system SHALL update footer links from `#` to `/privacy` and `/terms`.

#### Scenario: Footer links work
- **WHEN** a user clicks "Privacy" or "Terms" in the footer
- **THEN** they are navigated to the corresponding real page
