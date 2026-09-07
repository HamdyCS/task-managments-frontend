# Implementation Plan: Account Settings

## Constitution Check

Before proceeding, verify this plan complies with the WorkPilot Constitution:

- [x] Type Safety First: All new code uses TypeScript with strict types. No `any` types introduced. DTOs co-located with usage.
- [x] Component Composition: New components are composable and single-responsibility. Each section is a separate component under 300 lines.
- [x] State Management: Uses React Query for server state (mutations + query invalidation). Local component state for form/UI. Redux consumed via existing `useAppSelector`.
- [x] Internationalization: All strings use i18n translation keys. Both `en` and `ar` locale files updated.
- [x] Accessibility: Form fields have labels, ARIA attributes, keyboard navigation. Password toggles are accessible. Dialog traps focus.
- [x] Performance: Lazy-loaded route. No bundle size impact. React Query cache invalidation avoids refetch overhead.
- [x] Security: No sensitive data in localStorage/Redux. Tokens read from URL only at submission time. No console logging of secrets.
- [x] Documentation: JSDoc on new service functions and hooks.

## Plan Overview

### Objective

Implement a centralized Account Settings page for authenticated workspace users, enabling them to manage their personal information, change their email address, update their password, and delete their account. The feature integrates with the existing dashboard layout and follows all established project conventions.

### Success Criteria

- [ ] `/dashboard/account` route renders the Account Settings page within the existing dashboard layout
- [ ] Personal Information section allows viewing and editing first name, last name, and date of birth
- [ ] Email Address section displays current email and supports email change via confirmation link flow
- [ ] Password & Security section supports password reset via email token flow
- [ ] Delete Account section supports account deletion via confirmation dialog + OTP verification
- [ ] All user-facing text is translated for English and Arabic
- [ ] Page renders correctly in both LTR and RTL layouts
- [ ] All async operations show loading states and prevent duplicate submissions
- [ ] Current-user cache is invalidated after profile update and email change

## Implementation Steps

### Phase 1: API Layer & Service Functions

**Duration**: ~30 minutes

**Tasks**:
1. Add account settings endpoints to `config.ts` under `auth`:
   - `updateProfile: /auth` (PUT)
   - `changeEmail.sendEmail: /auth/change-email/send-email`
   - `changeEmail.confirm: /auth/change-email`
   - `resetPassword.sendEmail: /auth/reset-password/send-email`
   - `resetPassword.reset: /auth/reset-password`
   - `deleteAccount.sendOtp: /auth/delete-account/send-otp`
   - `deleteAccount.resendOtp: /auth/delete-account/resend-otp`
   - `deleteAccount.delete: /auth/delete-account`
2. Create DTOs in `src/dtos/auth/`:
   - `UpdateProfileDto.ts` — `{ firstName, lastName, dateOfBirth }`
   - `ChangeEmailDto.ts` — `{ token, newEmail }`
   - `DeleteAccountDto.ts` — `{ email, otp }`
3. Add service functions to `authService.ts`:
   - `updateProfile(dto)` — PUT `/auth`
   - `sendChangeEmail(email)` — POST `/auth/change-email/send-email?email=`
   - `confirmChangeEmail(dto)` — POST `/auth/change-email`
   - `sendPasswordResetEmail()` — POST `/auth/reset-password/send-email`
   - `deleteAccountSendOtp(email)` — POST `/auth/delete-account/send-otp`
   - `deleteAccountResendOtp(email)` — POST `/auth/delete-account/resend-otp`
   - `deleteAccount(dto)` — DELETE `/auth/delete-account`

**Dependencies**: None

**Risks**: Backend endpoints may differ slightly from BackendReadme.md. Mitigation: Follow exact request/response shapes from the backend documentation.

### Phase 2: React Query Hooks

**Duration**: ~30 minutes

**Tasks**:
1. Create `src/hooks/auth/useUpdateProfile.ts` — mutation hook that invalidates `["currentUser"]` on success
2. Create `src/hooks/auth/useSendChangeEmail.ts` — mutation hook for sending change-email email
3. Create `src/hooks/auth/useConfirmChangeEmail.ts` — mutation hook that invalidates `["currentUser"]` on success
4. Create `src/hooks/auth/useSendPasswordResetEmail.ts` — mutation hook for sending password reset email
5. Create `src/hooks/auth/useDeleteAccountSendOtp.ts` — mutation hook for sending delete-account OTP
6. Create `src/hooks/auth/useDeleteAccountResendOtp.ts` — mutation hook for resending delete-account OTP
7. Create `src/hooks/auth/useDeleteAccount.ts` — mutation hook that clears auth state and navigates on success

**Dependencies**: Phase 1

**Risks**: Cache invalidation may not reflect updates immediately. Mitigation: Use `queryClient.invalidateQueries({ queryKey: ["currentUser"] })` following existing `useLogin` pattern.

### Phase 3: Account Settings Page & Sections

**Duration**: ~1 hour

**Tasks**:
1. Create `src/pages/dashboard/AccountSettingsPage.tsx` — page wrapper with title "Account Settings"
2. Create `src/components/account-settings/PersonalInformationSection.tsx` — Formik form with first name, last name, date of birth fields (age must be >= 18)
3. Create `src/components/account-settings/EmailSection.tsx` — read-only email display + link/button to change email flow
4. Create `src/components/account-settings/ChangeEmailForm.tsx` — form to enter new email, triggers send-email flow
5. Create `src/components/account-settings/PasswordSection.tsx` — button to trigger password reset email + "check your email" state
6. Create `src/components/account-settings/DeleteAccountSection.tsx` — danger-styled section with confirmation dialog + OTP input flow
7. Create `src/components/account-settings/OtpInput.tsx` — 6-digit numeric OTP input component

**Dependencies**: Phase 1, Phase 2

**Risks**: No reusable form input components exist. Mitigation: Use raw `<input>` with inline Tailwind following the existing dashboard input pattern (e.g., `WorkspaceFormDialog`).

### Phase 4: Token-Based Verification Pages

**Duration**: ~30 minutes

**Tasks**:
1. Create `src/pages/auth/ChangeEmailPage.tsx` — reads `token` + `email` from URL, auto-submits verification, shows success/failure result
2. Create `src/pages/auth/ResetPasswordPage.tsx` — reads `token` from URL, shows new password + repeat password form, submits to reset-password API
3. Create `src/components/account-settings/AccountActionResult.tsx` — reusable success/failure result component for both password-reset and email-change flows

**Dependencies**: Phase 1, Phase 2

**Risks**: Token format may need special handling. Mitigation: Backend Base64-url encodes tokens; read them directly from URL params without re-encoding.

### Phase 5: Routing & Navigation

**Duration**: ~15 minutes

**Tasks**:
1. Add `/dashboard/account` route to `DashboardRoutes.tsx`
2. Add `/reset-password` and `/change-email` routes (accessible without dashboard layout)
3. Add "Settings" link to `DashboardSidebar.tsx` using existing `FiSettings` icon and `t("dashboard.sidebar.settings")` translation
4. Fix the navbar `Account Settings` link to point to `/dashboard/account` instead of `/settings`

**Dependencies**: Phase 3, Phase 4

**Risks**: The `/reset-password` and `/change-email` routes must be accessible without the dashboard layout (users click email links while not necessarily in the dashboard). Mitigation: Add these routes at the root level alongside existing auth routes.

### Phase 6: Translations & i18n

**Duration**: ~20 minutes

**Tasks**:
1. Add English translation keys under `dashboard.accountSettings` in `en/common.json`
2. Add Arabic translation keys under `dashboard.accountSettings` in `ar/common.json`
3. Add translation keys for the verification pages (change-email result, reset-password form)

**Dependencies**: Phase 3, Phase 4

**Risks**: Missing translations for some edge-case messages. Mitigation: Cover all user-facing strings identified in the spec.

### Phase 7: Polish & Verification

**Duration**: ~20 minutes

**Tasks**:
1. Verify RTL layout renders correctly for all sections
2. Verify responsive layout on mobile/tablet/desktop
3. Run `npm run lint` and fix any issues
4. Run `npm run build` to verify TypeScript compilation
5. Verify no sensitive data in console logs or localStorage
6. Verify existing Forget Password OTP flow is not modified

**Dependencies**: All previous phases

**Risks**: Lint errors from new files. Mitigation: Follow existing code conventions exactly.

## Testing Strategy

### Unit Tests

- [ ] PersonalInformationForm validates required fields and age >= 18
- [ ] ChangeEmailForm validates email format
- [ ] ResetPasswordForm validates password match
- [ ] OtpInput accepts exactly 6 numeric digits
- [ ] AccountActionResult renders correct state for each action/result combination

### Integration Tests

- [ ] Account Settings page loads and displays current user data
- [ ] Profile update calls PUT /api/auth and invalidates currentUser cache
- [ ] Email change flow sends email and shows confirmation state
- [ ] Password reset flow sends email and shows confirmation state
- [ ] Delete account flow sends OTP, accepts OTP, and deletes account

### E2E Tests

- [ ] Full personal information update flow
- [ ] Full email change flow (including verification link)
- [ ] Full password reset flow (including reset link)
- [ ] Full delete account flow (including OTP)

## Rollback Plan

- [ ] Remove new routes from `DashboardRoutes.tsx`
- [ ] Remove new routes from `AuthRoutes.tsx` or root routes
- [ ] Remove "Settings" link from sidebar
- [ ] Revert navbar link to dead `/settings`
- [ ] Remove new service functions from `authService.ts`
- [ ] Remove new hooks from `src/hooks/auth/`
- [ ] Remove new components from `src/components/account-settings/`
- [ ] Remove new pages from `src/pages/`
- [ ] Remove new DTOs from `src/dtos/auth/`
- [ ] Remove new endpoints from `config.ts`
- [ ] Remove translation keys

## Post-Implementation Review

- [ ] Verify all success criteria met
- [ ] Run full lint and build
- [ ] Perform code review
- [ ] Verify existing Forget Password OTP flow is unmodified
- [ ] Verify no duplicate user state introduced
