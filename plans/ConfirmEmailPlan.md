Create the **Confirm Email** page for the existing authentication flow.

## Route

Create the page at:

`/confirm-email?email=**&token=**`

The backend is already implemented. **Do not make any backend changes.**

The page must read both query parameters:

* `email`
* `token`

and use them with the **existing email-confirmation API**.

---

## Confirmation Flow

Implement the entire flow inside a single `ConfirmEmailPage`.

### 1. Loading State

When the page loads:

1. Read `email` and `token` from the URL query parameters.
2. Validate that both values exist.
3. If both exist, call the existing email-confirmation API.
4. Show a loading state while the confirmation request is running.
5. Prevent duplicate API requests.

If either parameter is missing, treat the confirmation as failed and do not call the API.

---

### 2. Success State

When the confirmation API succeeds, show a dedicated success state.

The success state should:

* Clearly indicate that the email was confirmed successfully.
* Use the existing authentication design system.
* Match the visual style of the existing Login and Register pages.
* Support both dark and light modes.
* Be responsive.

Primary action:

**Return to Login**

Navigate to:

`/login`

---

### 3. Failure State

If:

* `email` or `token` is missing,
* the token is invalid,
* the token is expired,
* the confirmation API returns an error,
* or the API request fails,

show a dedicated failure state.

The failure state should:

* Clearly indicate that email confirmation failed.
* Provide a short, user-friendly explanation.
* Never expose raw backend errors or technical details.
* Keep the user inside the authentication flow.

Primary action:

**Return to Register**

Navigate to:

`/register`

Do not add a "Resend Confirmation Email" action unless an existing frontend API/hook for resending confirmation emails already exists.

---

## Page States

Keep everything inside one page and one route:

```text id="w8xj41"
ConfirmEmailPage
├── Loading
├── Success
└── Failure
```

Do not create separate routes for success or failure.

The URL should remain:

`/confirm-email?email=...&token=...`

---

## API Integration

This is a **frontend-only task**.

Before implementing:

1. Inspect the existing frontend authentication API/services.
2. Find the existing email-confirmation API/hook.
3. Reuse the existing API client and project conventions.
4. Reuse the existing React Query/mutation pattern if the project uses it.
5. Follow the project's existing loading and error-handling patterns.
6. Do not create a new API endpoint.
7. Do not modify the backend.
8. Do not invent a new API contract.

---

## UI/UX

Inspect the existing `/login` and `/register` pages and authentication layout before implementing.

The Confirm Email page should:

* Reuse the existing authentication layout.
* Reuse existing shared UI components.
* Follow the existing typography, spacing, buttons, cards, icons, and design tokens.
* Support dark and light modes.
* Be fully responsive.
* Feel like a natural continuation of the Register → Confirmation Email flow.

### Loading

Show:

* Loading indicator.
* Short message such as:
  **"Confirming your email..."**

### Success

Show:

* Success visual/icon.
* Clear confirmation message.
* Primary **"Return to Login"** button.

### Failure

Show:

* Failure/error visual/icon.
* User-friendly message explaining that the confirmation link is invalid or expired when appropriate.
* Primary **"Return to Register"** button.

Keep the implementation clean, minimal, and consistent with the existing frontend architecture.
