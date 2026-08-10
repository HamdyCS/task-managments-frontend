Create the frontend **OAuth / Provider Authentication Callback page** for the Task Management application.

Use the **`/frontend-design` skill** to implement the page and follow the project's existing design system, architecture, components, typography, spacing, colors, dark/light mode, and authentication patterns.

### Context

The backend handles the entire OAuth/provider authentication flow:

1. User clicks "Login with Provider".
2. Provider authentication happens.
3. Backend receives the provider callback.
4. Backend authenticates the user.
5. Backend generates the Access Token and Refresh Token.
6. Backend stores both tokens in **HttpOnly cookies**.
7. Backend redirects the browser to the frontend callback URL.
8. The frontend callback page must verify the authenticated session and then redirect the user to the application.

The frontend **must NOT receive, read, or store tokens from the URL**.

### Page Route

Create:

`/auth/callback`

Use the project's existing routing conventions.

### Page Responsibility

This is a temporary transition page, not a normal authentication screen.

When the user lands on `/auth/callback`:

1. Display a minimal authentication/loading state.
2. Call the existing **current-user / authenticated-user endpoint** using the project's existing API/service architecture.
3. The browser must send the authentication cookies automatically.
4. If the request succeeds:

   * Update/sync the existing authentication state using the project's current auth mechanism.
   * Redirect the user to the appropriate authenticated landing page, preferably `/dashboard` if that is the existing convention.
5. If authentication fails:

   * Handle the error gracefully.
   * Redirect the user back to `/login`.
   * Preserve an appropriate error indication if the project's existing authentication flow supports query parameters or notifications.

### UI Requirements

The page should be intentionally minimal because it should normally only be visible for a very short time.

Design it as a polished full-page authentication transition state:

* Center the content vertically and horizontally.

* Reuse the application's existing logo/brand.

* Use the existing design system instead of introducing new colors or visual language.

* Support both **Light Mode and Dark Mode**.

* Use a subtle loading indicator/spinner or appropriate existing loading component.

* Main text:

  **Signing you in...**

* Supporting text:

  **Please wait while we complete your authentication.**

* Keep the visual hierarchy clean and premium.

* Avoid unnecessary cards, forms, navigation, footer, or complex illustrations.

* Do not make this page look like the Login page.

* The page should feel like a seamless transition between the provider and the application.

### Error State

If the authentication verification fails before redirecting to `/login`, provide a graceful fallback state if the existing architecture allows it.

Use the project's existing notification/toast/error handling system rather than introducing a new notification library.

Example:

* "Authentication failed"
* "We couldn't complete your sign in. Please try again."

Then redirect to `/login`.

### Architecture

Follow the project's existing architecture strictly.

Do NOT put API calls directly inside the page if the project already uses:

`service → custom hook → component`

Use the existing authentication service and hooks.

Reuse existing:

* Auth service
* Current-user query/hook
* Authentication state/store
* React Query configuration
* Router/navigation utilities
* Loading components
* Error handling
* Toast/notification system
* Layout/design components

Do not create duplicate authentication logic.

### Important Security Requirements

* Never read Access Token or Refresh Token from query parameters.
* Never store tokens in localStorage/sessionStorage.
* Never expose tokens in frontend state.
* Authentication is cookie-based.
* The browser should send the HttpOnly cookies to the API according to the project's existing Axios/fetch configuration.
* Do not modify the backend authentication flow.
* Do not change the existing cookie implementation.

### Implementation

Before coding:

1. Inspect the existing project structure.
2. Inspect the existing authentication implementation.
3. Find the current-user/authentication endpoint.
4. Find the existing auth service.
5. Find the existing authentication hook/state.
6. Find the existing loading and error UI components.
7. Inspect the router and determine the correct authenticated landing route.
8. Inspect existing Login/Register pages to ensure the callback page belongs visually to the same design system.

Then implement `/auth/callback` using the project's existing patterns.

Do not introduce unnecessary dependencies.

Do not refactor unrelated code.

After implementation, verify:

* `/auth/callback` route works.
* Existing authentication cookies are used.
* Current user is fetched correctly.
* Successful authentication redirects correctly.
* Failed authentication redirects to login.
* No token is exposed in the URL.
* No token is stored in frontend storage.
* Light/Dark mode works.
* TypeScript/build/lint errors are resolved.

Use `/frontend-design` skill for the visual implementation and make the final result production-ready.
