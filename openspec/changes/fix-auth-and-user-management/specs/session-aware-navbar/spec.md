## ADDED Requirements

### Requirement: Navbar displays login state
Navbar SHALL show different content based on user session status. When unauthenticated, show "Sign In" and "Get Started" buttons. When authenticated, show user email, Dashboard link, and Sign Out button.

#### Scenario: Unauthenticated user visits homepage
- **WHEN** user is not logged in
- **THEN** navbar displays "Sign In" link and "Get Started" button, both linking to /auth/signin

#### Scenario: Authenticated user visits homepage
- **WHEN** user is logged in with email "user@example.com"
- **THEN** navbar displays user email, "Dashboard" link, and "Sign Out" button
- **THEN** "Sign In" and "Get Started" buttons are NOT visible

#### Scenario: User clicks Sign Out
- **WHEN** authenticated user clicks "Sign Out" in navbar
- **THEN** session is destroyed and user is redirected to homepage
- **THEN** navbar reverts to unauthenticated state

### Requirement: Navbar is a shared component
Navbar SHALL be extracted as a reusable component used on homepage and all authenticated pages. It MUST use `useSession()` from next-auth/react for session state.

#### Scenario: Navbar renders on all pages
- **WHEN** any page loads
- **THEN** Navbar component is rendered from layout or page with consistent styling

### Requirement: Remove Google OAuth
Google OAuth provider SHALL be removed from NextAuth config and signin page. Only email magic link login SHALL remain.

#### Scenario: Signin page shows only email option
- **WHEN** user visits /auth/signin
- **THEN** only email input and "Send magic link" button are shown
- **THEN** no Google sign-in button is visible
