# Feature: Account Settings

Implement a complete **Account Settings** feature inside the existing workspace-user dashboard.

## Important Context

The application already has an authenticated **Workspace User Dashboard** with an existing layout, components, API architecture, React Query patterns, forms, validation, i18n, RTL/LTR support, and authentication flow.

The new feature must integrate with the existing architecture and UI.

### Feature Route

```text
/dashboard/account
```

This page is **global to the currently authenticated user**.

It is NOT workspace-specific.

Do NOT add `workspaceId` to this route.

The same Account Settings components may later be reused/adapted for the Admin Dashboard, so keep the implementation modular and reusable.

---

# 1. Inspect the Existing Project First

Before implementing anything:

1. Inspect the existing frontend structure.
2. Inspect the current dashboard layout.
3. Inspect the existing navigation/sidebar.
4. Inspect existing forms.
5. Inspect existing input/button/card/dialog components.
6. Inspect `ConfirmDialog.tsx`.
7. Inspect existing React Query hooks and mutation patterns.
8. Inspect the current authenticated-user query/hook.
9. Inspect API/service organization.
10. Inspect validation/schema patterns.
11. Inspect toast/success/error handling.
12. Inspect existing authentication-related pages.
13. Inspect existing routing conventions.
14. Inspect i18n structure for Arabic and English.
15. Inspect the existing RTL/LTR implementation.

Reuse existing components and patterns whenever possible.

Do not invent a new architecture.

If an appropriate reusable component does not exist, create it.

Do not put the entire feature into one large page component.

---

# 2. Account Settings Page

Create:

```text
/dashboard/account
```

The page must use the existing **Workspace User Dashboard Layout**.

There must be no workspace dependency.

Organize the page into separate sections/cards.

The sections should be:

1. Personal Information
2. Email Address
3. Password & Security
4. Delete Account

**Delete Account must be the final section.**

---

# 3. Personal Information Section

Create a **Personal Information** section.

Fields:

- First Name
- Last Name
- Date of Birth

Use the existing authenticated user information.

The backend endpoint is:

```http
PUT /api/auth
```

Request:

```json
{
  "firstName": "Johnny",
  "lastName": "Doe",
  "dateOfBirth": "2000-01-01"
}
```

On success:

- Update or invalidate the existing current-user React Query cache.
- Ensure the updated name/date of birth is reflected throughout the application.
- Use the existing success feedback pattern.

Do not create a separate current-user state if the project already has one.

---

# 4. Email Address Section

Create a dedicated **Email Address** section.

Display the current authenticated user's email.

Allow the user to enter a new email.

## Email Change Flow

The flow is:

```text
Account Settings
        ↓
User enters new email
        ↓
Click Change Email
        ↓
POST /api/auth/change-email/send-email?email={newEmail}
        ↓
Backend sends confirmation email
        ↓
Show "Check your email" state/message
        ↓
User clicks the email link
        ↓
Frontend opens:
 /change-email?token=...&email=...
        ↓
Change Email page reads token + email
        ↓
POST /api/auth/change-email
        ↓
Success / Failure
```

### Request

```http
POST /api/auth/change-email/send-email?email={newEmail}
```

Then the confirmation endpoint:

```http
POST /api/auth/change-email
```

Body:

```json
{
  "token": "<changeToken>",
  "newEmail": "<emailFromUrl>"
}
```

## Important

Do NOT create an OTP flow for changing email.

The email-change flow uses an **email token only**.

Do NOT ask the user to manually enter the token.

The token and email come from the URL.

---

# 5. Change Email Verification Page

Create the frontend page for the email confirmation link.

Expected URL:

```text
/change-email?token=...&email=...
```

The page is responsible for:

1. Reading `token` from the URL.
2. Reading `email` from the URL.
3. Calling:

```http
POST /api/auth/change-email
```

with:

```json
{
  "token": "<token>",
  "newEmail": "<email>"
}
```

4. Handling loading state.
5. Handling success.
6. Handling failure.

On success:

- Invalidate/update the current-user query.
- Show the successful email-change result.

On failure:

- Show a proper failure state.
- Follow the existing project error UI.

The page should not require the user to enter the token manually.

---

# 6. Password & Security Section

Create a dedicated **Password & Security** section.

The password flow here uses an **email reset token**.

### IMPORTANT

There is **NO OTP in this password flow**.

Do not use the Forget Password OTP flow here.

The existing Forget Password OTP functionality belongs to the login/authentication flow and is already implemented separately.

For Account Settings, use only:

```http
POST /api/auth/reset-password/send-email
```

and:

```http
POST /api/auth/reset-password
```

## Correct Password Flow

```text
Account Settings
        ↓
User clicks Update Password
        ↓
POST /api/auth/reset-password/send-email
        ↓
Backend sends password reset email
        ↓
Show:
"Please check your email"
        ↓
User clicks email link
        ↓
Frontend opens:
/reset-password?token=...
        ↓
Reset Password page
        ↓
New Password
Repeat Password
        ↓
Validate passwords
        ↓
POST /api/auth/reset-password
        ↓
Success / Failure
```

There is:

- No OTP
- No current password field
- No OTP input
- No resend OTP

---

# 7. Reset Password Page

Create:

```text
/reset-password?token=...
```

The backend generates a URL similar to:

```text
{frontendUrl}/reset-password?token={encodedToken}
```

The backend Base64-url encodes the token:

```csharp
var encodedToken =
    WebEncoders.Base64UrlEncode(
        System.Text.Encoding.UTF8.GetBytes(token)
    );
```

The frontend must correctly read the token from the URL.

Do not unnecessarily decode/re-encode the token.

Preserve the token exactly as required by the backend contract.

## Reset Password Form

The page must contain exactly:

- New Password
- Repeat Password

It must:

- Validate the password using the project's existing password validation rules.
- Validate that the two passwords match.
- Submit the token + new password.

API:

```http
POST /api/auth/reset-password
```

Body:

```json
{
  "token": "<token>",
  "newPassword": "<newPassword>"
}
```

On success:

- Show password-reset success state.

On failure:

- Show password-reset failure state.

Do not add OTP functionality to this page.

---

# 8. Reusable Success / Failure Result

The Password Reset and Change Email flows should avoid duplicated success/failure UI.

If the project does not already have an appropriate reusable result component, create one.

For example:

```ts
type AccountActionType =
  | "reset-password"
  | "change-email";

type AccountActionResult =
  | "success"
  | "failure";
```

The component should be capable of displaying:

### Password Reset Success

A message indicating that the password was successfully updated.

### Password Reset Failure

A message indicating that the reset link is invalid/expired or the operation failed.

### Email Change Success

A message indicating that the email was successfully changed.

### Email Change Failure

A message indicating that the confirmation link is invalid/expired or the operation failed.

Use i18n for all text.

Do not create duplicated pages/components when one reusable result component can handle both flows cleanly.

---

# 9. Delete Account Section

The final section on the Account Settings page must be:

## Delete Account

This is a destructive action and must have clear danger styling.

Use the existing:

```text
ConfirmDialog.tsx
```

if it fits the existing design.

The user must NOT be able to delete the account with a single click.

---

# 10. Delete Account Flow

Unlike Password Reset and Email Change, **Delete Account uses OTP**.

The flow is:

```text
Delete Account
        ↓
Confirmation Dialog
        ↓
User confirms
        ↓
POST /api/auth/delete-account/send-otp
        ↓
OTP sent to user's email
        ↓
User enters OTP
        ↓
DELETE /api/auth/delete-account
        ↓
Account deleted
        ↓
Clear auth state
        ↓
Redirect to public/auth page
```

### Send OTP

```http
POST /api/auth/delete-account/send-otp
```

Body:

```json
{
  "email": "john@example.com"
}
```

### Resend OTP

```http
POST /api/auth/delete-account/resend-otp
```

Body:

```json
{
  "email": "john@example.com"
}
```

### Delete Account

```http
DELETE /api/auth/delete-account
```

Body:

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

After successful deletion:

- Clear/invalidate authentication state.
- Clear relevant React Query caches.
- Follow the existing application's logout behavior.
- Redirect to the appropriate public/auth page.
- Show success feedback if supported by the existing architecture.

---

# 11. Important Authentication Flow Separation

Keep these flows completely separate.

### Forget Password

Existing authentication flow:

```text
Forget Password
↓
OTP
↓
Reset Password
```

This already exists and is OUTSIDE this feature.

Do not modify or duplicate it.

### Account Settings → Password

```text
Update Password
↓
Send Reset Email
↓
Token
↓
/reset-password?token=...
↓
New Password + Repeat Password
↓
Reset Password API
```

No OTP.

### Account Settings → Email

```text
Change Email
↓
Send Confirmation Email
↓
Token + Email
↓
/change-email?token=...&email=...
↓
Change Email API
```

No OTP.

### Account Settings → Delete Account

```text
Delete Account
↓
Confirmation
↓
OTP
↓
Delete Account API
```

OTP is used ONLY here inside this feature.

---

# 12. Current User

The backend provides:

```http
GET /api/auth
```

Response:

```json
{
  "id": "a1b2c3...",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "2000-01-01"
}
```

Find the existing current-user query/hook.

Use it.

Do not create duplicate user state.

After:

- Personal information update
- Email change

invalidate/update the existing current-user query according to the project's React Query conventions.

---

# 13. API Layer

Follow the existing API/service architecture.

Do NOT call Axios/fetch directly from page components.

Add/use the appropriate API methods for:

```text
PUT    /api/auth
POST   /api/auth/change-email/send-email
POST   /api/auth/change-email
POST   /api/auth/reset-password/send-email
POST   /api/auth/reset-password
POST   /api/auth/delete-account/send-otp
POST   /api/auth/delete-account/resend-otp
DELETE /api/auth/delete-account
```

Use existing DTO/type conventions.

Do not create duplicate DTOs if equivalent types already exist.

---

# 14. React Query Hooks

Follow the existing React Query patterns.

Create dedicated mutation hooks if that matches the project's architecture.

Potential operations:

```text
useUpdateProfile()
useSendChangeEmail()
useConfirmChangeEmail()
useSendPasswordResetEmail()
useResetPassword()
useSendDeleteAccountOtp()
useResendDeleteAccountOtp()
useDeleteAccount()
```

Do not blindly create all of these if the existing project uses a different naming/organization pattern.

Inspect the codebase first.

Every mutation should properly handle:

- Loading
- Success
- Error
- Cache invalidation
- Duplicate submissions

---

# 15. Component Structure

Do NOT put everything into one `AccountPage.tsx`.

Use multiple components.

A possible structure:

```text
AccountPage
├── AccountHeader
├── PersonalInformationSection
│   └── PersonalInformationForm
├── EmailSection
│   └── ChangeEmailForm
├── PasswordSection
│   └── PasswordResetRequest
└── DeleteAccountSection
    ├── DeleteAccountConfirmation
    └── DeleteAccountOtp
```

And reusable pages/components:

```text
ResetPasswordPage
ChangeEmailPage
AccountActionResult
ResetPasswordForm
```

Adjust the exact structure based on the actual project.

The goal is:

- Small components
- Reusable components
- Clear responsibility
- No giant page component

---

# 16. Forms & Validation

Follow the existing form and validation pattern in the project.

Do not introduce a new form library if one already exists.

## Personal Information

Validate according to existing project conventions:

- First Name
- Last Name
- Date of Birth

## Email

Validate:

- Required
- Valid email
- Appropriate handling when the new email equals the current email

## Password

Validate:

- Required
- Existing password rules
- Repeat Password matches New Password

## Delete Account OTP

Validate according to the existing OTP implementation/pattern.

Do not reuse the Forget Password OTP implementation in a way that couples the two flows unnecessarily.

Reuse generic OTP UI/utilities if they already exist.

---

# 17. Internationalization

The project supports:

- English
- Arabic

Use the existing `react-i18next` setup.

Every user-facing string must have translations.

Add appropriate keys for:

- Account Settings
- Personal Information
- Email Address
- Password & Security
- Delete Account
- Update
- Save Changes
- Change Email
- Update Password
- Check Your Email
- Password Reset
- Email Change
- Verification
- Success
- Failure
- Invalid/Expired Token
- Password Mismatch
- Delete Account Warning
- Delete Account Confirmation
- OTP
- Resend OTP
- Account Deleted

Do not hardcode user-facing English or Arabic strings.

---

# 18. RTL / LTR

The feature must properly support:

```text
English → LTR
Arabic  → RTL
```

Pay special attention to:

- Section layout
- Form alignment
- Input alignment
- Icons
- Buttons
- Dialogs
- Password visibility icons
- OTP input
- Success/failure result UI
- Directional icons
- Margins/paddings
- Responsive spacing

Follow the project's existing RTL/LTR implementation.

Do not create a separate RTL system.

---

# 19. UI / Design

The feature must look like an existing part of the dashboard.

Reuse the existing:

- Cards
- Buttons
- Inputs
- Typography
- Dialogs
- Icons
- Loading indicators
- Toasts
- Error components

Do not introduce an unrelated visual design.

The sections should be clearly separated.

The Delete Account section should visually communicate that the action is destructive without breaking the existing design system.

The page must be responsive on:

- Desktop
- Tablet
- Mobile

---

# 20. Dashboard Navigation

Inspect the existing Workspace User Dashboard navigation.

Add:

```text
Account Settings
```

linking to:

```text
/dashboard/account
```

Use an appropriate existing icon.

Add translations.

Do not create another dashboard layout.

---

# 21. Routing

Add the Account Settings route:

```text
/dashboard/account
```

Add the token-based routes:

```text
/reset-password?token=...
/change-email?token=...&email=...
```

Inspect the existing router and authentication guards before implementing.

The token-based pages must not incorrectly require an authenticated session if the backend token is what authorizes the operation.

Do not add `workspaceId` to these routes unless the existing application's routing architecture absolutely requires it.

---

# 22. Error Handling

Use the project's existing error-handling system.

Handle at minimum:

### Profile

- Validation errors
- Unauthorized
- Server errors

### Email Change

- Invalid email
- Email already exists
- Invalid token
- Expired token
- Unauthorized/API errors

### Password Reset

- Invalid token
- Expired token
- Password validation errors
- API errors

### Delete Account

- Invalid OTP
- Expired OTP
- API errors
- Unauthorized errors

Do not expose raw backend errors if the existing project has a user-friendly error mapping system.

---

# 23. Loading States

Every asynchronous action must have an appropriate loading state.

Examples:

- Save profile
- Send email-change email
- Send password-reset email
- Verify email-change token
- Reset password
- Send delete-account OTP
- Resend delete-account OTP
- Delete account

Prevent duplicate submissions.

Disable relevant buttons while mutations are pending.

---

# 24. Security

Do not store sensitive values in persistent state.

Do not store:

- Passwords
- OTPs
- Reset tokens
- Email-change tokens

in:

- localStorage
- Redux
- persistent application state

Do not log:

- Passwords
- OTPs
- Tokens

The reset/change-email tokens should be read from the URL only when needed.

---

# 25. Final Verification

Before finishing the implementation, verify all of the following:

- [ ] `/dashboard/account` works.
- [ ] Page uses Workspace User Dashboard Layout.
- [ ] No workspace ID is required.
- [ ] Personal Information section works.
- [ ] Profile update calls `PUT /api/auth`.
- [ ] Current-user cache updates after profile update.
- [ ] Email section works.
- [ ] Email change uses email verification token.
- [ ] No OTP exists in the email-change flow.
- [ ] `/change-email?token=...&email=...` works.
- [ ] Change-email token is sent correctly to the backend.
- [ ] Email-change success/failure states work.
- [ ] Password section works.
- [ ] Password update sends reset email.
- [ ] No OTP exists in the password-reset flow.
- [ ] `/reset-password?token=...` works.
- [ ] Reset password form contains New Password + Repeat Password.
- [ ] Token + new password are sent to the API.
- [ ] Password-reset success/failure states work.
- [ ] Delete Account is the final section.
- [ ] Delete Account requires confirmation.
- [ ] Delete Account uses OTP.
- [ ] Send OTP works.
- [ ] Resend OTP works.
- [ ] Delete Account API works.
- [ ] Authentication state is cleared after deletion.
- [ ] User is redirected appropriately after deletion.
- [ ] Existing components are reused.
- [ ] New components are modular/reusable.
- [ ] Existing API architecture is followed.
- [ ] Existing React Query architecture is followed.
- [ ] Existing form/validation patterns are followed.
- [ ] Existing error handling is followed.
- [ ] English translations are added.
- [ ] Arabic translations are added.
- [ ] RTL works.
- [ ] LTR works.
- [ ] Responsive layout works.
- [ ] No sensitive information is logged.
- [ ] No duplicate current-user state is introduced.
- [ ] Existing Forget Password OTP flow is NOT modified or duplicated.

---

# Execution Instructions

First inspect the actual codebase and understand the existing architecture.

Then determine the exact files/components/hooks/routes that need to be created or modified.

Implement the feature using the existing project conventions.

Do not stop at planning; execute the complete implementation.

Do not assume that a component, hook, utility, or API service exists until you inspect the codebase.

If something required does not exist:

1. Create the smallest reusable abstraction needed.
2. Follow the existing project naming and folder conventions.
3. Keep the implementation modular.
4. Add a short explanatory comment only when the reason is not obvious.

Do not modify unrelated parts of the application.

At the end, provide a concise implementation summary containing:

1. Files created.
2. Files modified.
3. API integrations added.
4. Routes added.
5. Components/hooks created.
6. Translation keys added.
7. Important architectural decisions.
8. Any remaining issues or assumptions.