## ADDED Requirements

### Requirement: Settings page displays user info
The system SHALL provide a /settings page showing the authenticated user's email, current plan, and monthly analysis usage.

#### Scenario: User views settings
- **WHEN** authenticated user visits /settings
- **THEN** page displays their email address, current plan (FREE/PRO/AGENCY), analysis count this month, and plan limits

### Requirement: Settings page is protected
The /settings page SHALL only be accessible to authenticated users.

#### Scenario: Unauthenticated user visits settings
- **WHEN** unauthenticated user visits /settings
- **THEN** user is redirected to /auth/signin
