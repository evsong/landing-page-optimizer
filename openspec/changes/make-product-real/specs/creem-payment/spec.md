## ADDED Requirements

### Requirement: Creem checkout session
The system SHALL create a Creem checkout session when a user clicks a pricing CTA, redirecting them to Creem's hosted payment page.

#### Scenario: User upgrades to Pro
- **WHEN** an authenticated user clicks "Upgrade to Pro"
- **THEN** the system creates a Creem checkout session for the Pro product and redirects the user to the Creem payment URL

#### Scenario: Unauthenticated user clicks pricing CTA
- **WHEN** an unauthenticated user clicks a pricing CTA
- **THEN** they are redirected to `/auth/signin` first

### Requirement: Creem webhook handles payment events
The system SHALL process Creem webhook callbacks to update user plan status in the database.

#### Scenario: Successful subscription payment
- **WHEN** Creem sends a `checkout.completed` webhook
- **THEN** the user's plan is updated to PRO or AGENCY in the database

#### Scenario: Subscription cancelled
- **WHEN** Creem sends a `subscription.canceled` webhook
- **THEN** the user's plan is reverted to FREE

### Requirement: Stripe code removed
The system SHALL remove all Stripe-related code, dependencies, and environment variables.

#### Scenario: No Stripe references remain
- **WHEN** the codebase is searched for "stripe"
- **THEN** no functional references exist (only migration comments if needed)
