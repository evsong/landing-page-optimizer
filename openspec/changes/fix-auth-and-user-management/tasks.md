## 1. Auth Config Cleanup

- [x] 1.1 Remove GoogleProvider from NextAuth config (route.ts), delete google-related imports
- [x] 1.2 Remove Google sign-in button from signin page, keep only email magic link form
- [x] 1.3 Add /auth/verify page showing "Check your email" message after magic link sent

## 2. Session-Aware Navbar

- [x] 2.1 Create Navbar client component (src/components/Navbar.tsx) with useSession — unauthenticated: Sign In + Get Started; authenticated: email + Dashboard + Sign Out
- [x] 2.2 Replace hardcoded navbar in page.tsx with Navbar component
- [x] 2.3 Add Navbar to layout.tsx or relevant pages for consistent rendering

## 3. Auth Middleware

- [x] 3.1 Create src/middleware.ts to protect /dashboard, /settings, /report/:path*, /compare

## 4. User Settings Page

- [x] 4.1 Create /settings page (src/app/settings/page.tsx) showing user email, plan, monthly analysis count
- [x] 4.2 Add API route or inline query to fetch user usage data

## 5. Verify & Polish

- [ ] 5.1 Test full flow: visit homepage → sign in via magic link → verify navbar changes → visit settings → sign out
- [ ] 5.2 Ensure all protected routes redirect to signin when unauthenticated
