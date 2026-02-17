## ADDED Requirements

### Requirement: REQ-US-001 User Authentication
The system SHALL support user authentication via NextAuth with email magic link and Google OAuth providers.

#### Scenario: Email magic link login
- **WHEN** user enters their email and clicks "Sign In"
- **THEN** system sends a magic link email and authenticates the user upon clicking the link

#### Scenario: Google OAuth login
- **WHEN** user clicks "Sign in with Google"
- **THEN** system redirects to Google OAuth flow and creates/links the user account upon successful authentication

#### Scenario: Session management
- **WHEN** user is authenticated
- **THEN** system maintains a session cookie and provides the user's plan, email, and ID to all authenticated API routes

### Requirement: REQ-US-002 Three-Tier Plan Gating
The system SHALL enforce feature access based on the user's subscription plan: FREE, PRO, or AGENCY.

#### Scenario: FREE plan limits
- **WHEN** user is on FREE plan
- **THEN** system allows 3 analyses per calendar month, shows only summary suggestions (top 3), and locks comparison, PDF export, and copy rewrite features

#### Scenario: FREE plan limit reached
- **WHEN** FREE user has used 3 analyses this month and attempts another
- **THEN** system shows an upgrade prompt with PRO and AGENCY plan benefits

#### Scenario: PRO plan access
- **WHEN** user is on PRO plan
- **THEN** system allows unlimited analyses, full AI suggestions with copy rewrites, and history tracking. Comparison and PDF export remain locked.

#### Scenario: AGENCY plan access
- **WHEN** user is on AGENCY plan
- **THEN** system allows all features: unlimited analyses, full suggestions, comparison, PDF export with white-label, and API access

### Requirement: REQ-US-003 Stripe Payment Integration
The system SHALL integrate Stripe for subscription management (checkout, billing portal, webhooks).

#### Scenario: Upgrade to PRO
- **WHEN** user clicks "Upgrade to PRO" ($5.99/month)
- **THEN** system redirects to Stripe Checkout, and upon successful payment, updates the user's plan to PRO

#### Scenario: Upgrade to AGENCY
- **WHEN** user clicks "Upgrade to AGENCY" ($49/month)
- **THEN** system redirects to Stripe Checkout, and upon successful payment, updates the user's plan to AGENCY

#### Scenario: Subscription cancellation
- **WHEN** user cancels their subscription via Stripe billing portal
- **THEN** system downgrades the user to FREE plan at the end of the current billing period

#### Scenario: Webhook processing
- **WHEN** Stripe sends a webhook event (checkout.session.completed, customer.subscription.updated, customer.subscription.deleted)
- **THEN** system updates the user's plan status in the database accordingly

### Requirement: REQ-US-004 Rate Limiting
The system SHALL enforce rate limits to prevent abuse: FREE users 3/month, PRO/AGENCY users 60/hour.

#### Scenario: FREE monthly limit
- **WHEN** FREE user exceeds 3 analyses in a calendar month
- **THEN** system returns 429 status with upgrade prompt

#### Scenario: Hourly rate limit
- **WHEN** any user exceeds 60 analyses per hour
- **THEN** system returns 429 status with "Please wait" message and retry-after header
