# Account Settings Specification

## Specification Overview

### Feature Name

Account Settings

### Purpose

Authenticated workspace users need a centralized, self-service page to manage their personal identity, email address, password, and account lifecycle. The feature replaces fragmented profile-management touchpoints with a single, cohesive experience that respects the existing dashboard layout and supports English and Arabic with full RTL compliance.

### User Stories

- As an authenticated workspace user, I want to view and update my personal information (first name, last name, date of birth) so that my profile stays accurate across the platform.
- As an authenticated workspace user, I want to change my email address via a confirmation-link flow so that I can update my contact information without exposing sensitive tokens.
- As an authenticated workspace user, I want to request a password reset via an email-link flow so that I can securely update my credentials without entering my current password.
- As an authenticated workspace user, I want to delete my account through a confirmation dialog followed by OTP verification so that destructive actions are protected against accidental or unauthorized execution.

## Functional Requirements

### Core Functionality

- [ ] The Account Settings page is accessible at a dedicated route within the authenticated dashboard.
- [ ] The page uses the existing workspace-user dashboard layout without introducing a new layout shell.
- [ ] The page is organized into four clearly separated sections: Personal Information, Email Address, Password & Security, and Delete Account.
- [ ] A simple page title ("Account Settings") is displayed above the four sections.
- [ ] Delete Account is always the final section on the page.
- [ ] The feature is global to the authenticated user and does not depend on any workspace identifier.
- [ ] Components and patterns are modular and reusable so they can be adapted for an admin dashboard in the future.

### Personal Information

- [ ] The section displays the authenticated user's current first name, last name, and date of birth, populated from the existing current-user data source.
- [ ] Users can edit and submit updated first name, last name, and date of birth.
- [ ] On successful update, the existing current-user data cache is refreshed so the updated values are reflected throughout the application without requiring a page reload.
- [ ] Form validation follows the project's existing validation conventions for required fields and format rules.

### Email Address

- [ ] The section displays the user's current email address as a read-only field with a link or button beneath it to navigate to the change-email flow.
- [ ] Clicking the link/button opens the change-email flow where the user can enter a new email address.
- [ ] The change-email flow sends a confirmation email containing a verification link; no manual token entry is required.
- [ ] After submitting the change-email request, the user sees a "check your email" confirmation state.
- [ ] Clicking the confirmation link opens a dedicated verification page that reads the token and email from the URL parameters and automatically submits the verification request.
- [ ] The verification page displays a success or failure state after processing.
- [ ] On successful email change, the current-user data cache is refreshed.
- [ ] The flow does not use OTP at any point.

### Password & Security

- [ ] The section provides a mechanism to initiate a password update.
- [ ] Clicking the update-password action sends a password-reset email containing a verification link; no manual token entry is required.
- [ ] After requesting the password reset, the user sees a "check your email" confirmation state.
- [ ] Clicking the reset link opens a dedicated reset-password page that contains exactly two fields: new password and repeat password.
- [ ] The reset-password page reads the token from the URL parameters and submits the token along with the new password.
- [ ] Password validation follows the project's existing password-strength rules.
- [ ] The repeat-password field must match the new-password field.
- [ ] The page displays a success or failure state after processing.
- [ ] The flow does not use OTP, does not require the current password, and does not include any OTP input or resend-OTP functionality.

### Delete Account

- [ ] The section is visually styled to communicate that the action is destructive.
- [ ] Clicking the delete-account action opens a confirmation dialog that requires explicit user confirmation before proceeding.
- [ ] After confirmation, a 6-digit numeric OTP is sent to the user's email address.
- [ ] The user must enter the 6-digit numeric OTP to authorize the deletion.
- [ ] The user can request a resend of the OTP if the original was not received.
- [ ] On successful deletion, all authentication state is cleared, relevant data caches are invalidated, and the user is redirected to the appropriate public or authentication page.
- [ ] The user sees appropriate feedback after account deletion.

### Reusable Result Component

- [ ] A single reusable result component displays success and failure states for both the password-reset and email-change verification flows.
- [ ] The component differentiates between password-reset and email-change actions to show contextually appropriate messaging.
- [ ] Success messaging indicates the specific outcome (password updated, email changed).
- [ ] Failure messaging indicates the specific cause (invalid/expired link, operation failed).

### Dashboard Navigation

- [ ] An "Account Settings" entry is added to the existing workspace-user dashboard navigation sidebar or menu.
- [ ] The entry links to the Account Settings route.
- [ ] The entry uses an appropriate existing icon from the project's icon set.
- [ ] The entry text is translated for both English and Arabic.

## Non-Functional Requirements

### Performance

- The Account Settings page must load within 2 seconds on a standard broadband connection.
- Form submissions must provide feedback within 1 second of the request completing.
- No single operation on the page should block the UI for more than 3 seconds without a loading indicator.

### Accessibility

- All form fields must have associated labels and be keyboard navigable.
- Error messages must be announced to screen readers via appropriate ARIA attributes.
- The confirmation dialog for delete account must trap focus and be dismissible via keyboard.
- Password visibility toggles must be accessible via keyboard and announced to screen readers.
- Color contrast must meet WCAG 2.1 AA standards for all text and interactive elements.

### Internationalization

- All user-facing text must use translation keys; no hardcoded English or Arabic strings.
- The page must render correctly in both LTR (English) and RTL (阿拉伯语) layouts.
- Form alignment, input labels, buttons, icons, dialogs, and directional indicators must flip correctly in RTL mode.
- Date-of-birth input must respect locale-appropriate formatting conventions.

### Security

- Passwords, OTPs, tokens, and email-change tokens must never be stored in localStorage, Redux, or any persistent client-side state.
- Tokens must be read from the URL only at the moment they are needed for submission.
- No sensitive values (passwords, OTPs, tokens) must appear in browser console logs or application logs.
- The delete-account action requires OTP verification as a second factor of confirmation.
- The password-reset and email-change flows use email-based verification links rather than exposing tokens through UI input fields.

## Acceptance Criteria

### Personal Information

- [ ] User can view their current first name, last name, and date of birth on the Account Settings page.
- [ ] User can edit and save changes to first name, last name, and date of birth.
- [ ] After saving, the updated values appear immediately across the application without a page reload.
- [ ] Validation errors are shown when required fields are empty or format rules are violated.

### Email Change

- [ ] User can see their current email address displayed as a read-only field.
- [ ] A link or button beneath the email field navigates the user to the change-email flow.
- [ ] User can enter a new email address and submit the change request.
- [ ] A "check your email" confirmation is displayed after submission.
- [ ] Clicking the verification link in the email opens the change-email verification page.
- [ ] The verification page automatically processes the token and email from the URL.
- [ ] Success state is shown when the email is changed; the current-user data reflects the new email.
- [ ] Failure state is shown when the link is invalid, expired, or the operation fails.
- [ ] No OTP input exists anywhere in the email-change flow.

### Password Reset

- [ ] User can click an action to request a password-reset email.
- [ ] A "check your email" confirmation is displayed after submission.
- [ ] Clicking the reset link in the email opens the reset-password page.
- [ ] The reset-password page contains exactly two fields: new password and repeat password.
- [ ] The page reads the token from the URL and submits it with the new password.
- [ ] Password validation follows existing project rules.
- [ ] Success state is shown when the password is updated.
- [ ] Failure state is shown when the link is invalid, expired, or the operation fails.
- [ ] No OTP input, no current-password field, and no OTP resend exist in this flow.

### Delete Account

- [ ] The delete-account section is visually distinct and communicates destructiveness.
- [ ] A confirmation dialog appears before any deletion action is initiated.
- [ ] A 6-digit numeric OTP is sent to the user's email after confirmation.
- [ ] The user can enter the 6-digit numeric OTP to authorize deletion.
- [ ] The user can resend the OTP if needed.
- [ ] After successful deletion, the user is logged out and redirected to a public page.
- [ ] All authentication state and relevant caches are cleared after deletion.

### Cross-Cutting

- [ ] All user-facing text uses translation keys for English and Arabic.
- [ ] The page renders correctly in both LTR and RTL layouts.
- [ ] The page is responsive on desktop, tablet, and mobile viewports.
- [ ] Loading states are shown for all asynchronous operations.
- [ ] Duplicate form submissions are prevented while mutations are pending.
- [ ] Error messages are user-friendly and follow the project's existing error-display conventions.
- [ ] The existing forget-password OTP flow (outside this feature) is not modified or duplicated.

## Assumptions

- The existing workspace-user dashboard layout, navigation, and authentication flow are stable and available for integration.
- The existing current-user query/hook provides the authenticated user's id, email, first name, last name, and date of birth.
- The project already has form components, input components, button components, dialog components, and toast/notification mechanisms that can be reused.
- The project already has a ConfirmDialog component suitable for the delete-account confirmation.
- The project uses React Query for server-state management and has existing mutation and cache-invalidation patterns.
- The project has existing i18n configuration with English and Arabic locale files.
- The project has existing RTL/LTR layout support that can be leveraged without modification.
- The backend endpoints listed in the plan file are stable and available for integration.
- The backend sends verification emails with links pointing to the frontend routes specified in the plan.
- The backend Base64-url-encodes tokens in email links and the frontend must preserve them as-is from the URL.
- No OTP flow is used for email change or password reset; OTP is used exclusively for delete account.
- The feature route does not include a workspace identifier and is global to the authenticated user.

## Clarifications

### Session 2026-09-04

- Q: Should email be shown in Personal Information or only in the Email Address section? → A: Email is displayed as a read-only field with a link/button beneath it to navigate to the change-email flow. The Email Address section remains the sole location for the full email change workflow.
- Q: What is the expected OTP format for the delete-account flow? → A: 6-digit numeric OTP (0-9). The input must accept exactly 6 numeric digits.
- Q: Should the page include a header/title above the sections? → A: Yes, include a simple page title ("Account Settings") above the four sections. No subtitle or breadcrumb.
