## ADDED Requirements

### Requirement: Middleware protects authenticated routes
Next.js middleware SHALL intercept requests to /dashboard, /settings, /report/:id, and /compare. Unauthenticated users SHALL be redirected to /auth/signin with a callbackUrl parameter.

#### Scenario: Unauthenticated user visits protected route
- **WHEN** unauthenticated user visits /dashboard
- **THEN** user is redirected to /auth/signin?callbackUrl=/dashboard

#### Scenario: Authenticated user visits protected route
- **WHEN** authenticated user visits /dashboard
- **THEN** request proceeds normally

### Requirement: Public routes remain accessible
Homepage (/), /auth/signin, /auth/verify, and /api routes SHALL NOT be blocked by middleware.

#### Scenario: Anyone visits homepage
- **WHEN** any user visits /
- **THEN** page loads without redirect
