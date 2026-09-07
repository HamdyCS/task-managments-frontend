# Task Breakdown: Account Settings

## Constitution Compliance

Ensure all tasks comply with WorkPilot Constitution principles:

- **Type Safety First**: All tasks include TypeScript type definitions
- **Component Composition**: Tasks respect component boundaries and composition patterns
- **Internationalization**: Tasks include i18n string extraction
- **Accessibility**: Tasks include accessibility verification steps
- **Performance**: Tasks include performance impact assessment
- **Security**: Tasks include security review where applicable
- **Documentation**: Tasks include documentation updates

## Phase 1: Setup — API Layer & Configuration

**Goal**: Establish the API foundation for all account settings features.

- [X] T001 Add account settings endpoints to `src/config.ts` under `auth`: `updateProfile`, `changeEmail.sendEmail`, `changeEmail.confirm`, `resetPassword.sendEmail`, `resetPassword.reset`, `deleteAccount.sendOtp`, `deleteAccount.resendOtp`, `deleteAccount.delete`
- [X] T002 [P] Create `src/dtos/auth/UpdateProfileDto.ts` — `{ firstName: string; lastName: string; dateOfBirth: string }`
- [X] T003 [P] Create `src/dtos/auth/ChangeEmailDto.ts` — `{ token: string; newEmail: string }`
- [X] T004 [P] Create `src/dtos/auth/DeleteAccountDto.ts` — `{ email: string; otp: string }`

## Phase 2: Foundational — Service Functions & Hooks

**Goal**: Build the service layer and React Query hooks that all user stories depend on.

- [X] T005 Add `updateProfile(dto)` function to `src/services/authService.ts` — PUT `/auth`
- [X] T006 [P] Add `sendChangeEmail(email)` function to `src/services/authService.ts` — POST `/auth/change-email/send-email?email=`
- [X] T007 [P] Add `confirmChangeEmail(dto)` function to `src/services/authService.ts` — POST `/auth/change-email`
- [X] T008 [P] Add `sendPasswordResetEmail()` function to `src/services/authService.ts` — POST `/auth/reset-password/send-email`
- [X] T009 [P] Add `deleteAccountSendOtp(email)` function to `src/services/authService.ts` — POST `/auth/delete-account/send-otp`
- [X] T010 [P] Add `deleteAccountResendOtp(email)` function to `src/services/authService.ts` — POST `/auth/delete-account/resend-otp`
- [X] T011 [P] Add `deleteAccount(dto)` function to `src/services/authService.ts` — DELETE `/auth/delete-account`
- [X] T012 Create `src/hooks/auth/useUpdateProfile.ts` — mutation hook, invalidates `["currentUser"]` on success
- [X] T013 [P] Create `src/hooks/auth/useSendChangeEmail.ts` — mutation hook for sending change-email email
- [X] T014 [P] Create `src/hooks/auth/useConfirmChangeEmail.ts` — mutation hook, invalidates `["currentUser"]` on success
- [X] T015 [P] Create `src/hooks/auth/useSendPasswordResetEmail.ts` — mutation hook for sending password reset email
- [X] T016 [P] Create `src/hooks/auth/useDeleteAccountSendOtp.ts` — mutation hook for sending delete-account OTP
- [X] T017 [P] Create `src/hooks/auth/useDeleteAccountResendOtp.ts` — mutation hook for resending delete-account OTP
- [X] T018 [P] Create `src/hooks/auth/useDeleteAccount.ts` — mutation hook, clears auth state and navigates on success

## Phase 3: User Story 1 — Personal Information

**Goal**: As an authenticated workspace user, I want to view and update my personal information (first name, last name, date of birth) so that my profile stays accurate across the platform.

**Independent Test Criteria**:
- User can view current first name, last name, and date of birth
- User can edit and save changes
- Updated values appear immediately across the application
- Validation errors shown for required fields and age < 18

- [X] T019 [US1] Create `src/components/account-settings/PersonalInformationSection.tsx` — Formik form with first name, last name, date of birth fields (age >= 18 validation), uses `useUpdateProfile` hook
- [X] T020 [US1] Create `src/pages/dashboard/AccountSettingsPage.tsx` — page wrapper with title "Account Settings", renders PersonalInformationSection as first section

## Phase 4: User Story 2 — Email Change

**Goal**: As an authenticated workspace user, I want to change my email address via a confirmation-link flow so that I can update my contact information without exposing sensitive tokens.

**Independent Test Criteria**:
- User sees current email as read-only
- User can enter new email and submit
- "Check your email" confirmation displayed
- Verification page auto-submits token from URL
- Success/failure state shown
- No OTP input in this flow

- [X] T021 [US2] Create `src/components/account-settings/EmailSection.tsx` — read-only email display + button to trigger change-email flow, uses `useSendChangeEmail` hook
- [X] T022 [US2] Create `src/components/account-settings/ChangeEmailForm.tsx` — form to enter new email, shows "check your email" state after submission
- [X] T023 [P] [US2] Create `src/components/account-settings/AccountActionResult.tsx` — reusable success/failure result component for verification flows
- [X] T024 [US2] Create `src/pages/auth/ChangeEmailPage.tsx` — reads `token` + `email` from URL, auto-submits verification via `useConfirmChangeEmail`, shows AccountActionResult

## Phase 5: User Story 3 — Password Reset

**Goal**: As an authenticated workspace user, I want to request a password reset via an email-link flow so that I can securely update my credentials without entering my current password.

**Independent Test Criteria**:
- User clicks "Update Password" and sees "check your email"
- Reset page shows new password + repeat password fields
- Token read from URL and submitted with new password
- Success/failure state shown
- No OTP input, no current-password field

- [X] T025 [US3] Create `src/components/account-settings/PasswordSection.tsx` — button to trigger password reset email via `useSendPasswordResetEmail`, shows "check your email" state
- [X] T026 [US3] Create `src/pages/auth/ResetPasswordPage.tsx` — reads `token` from URL, shows Formik form with new password + repeat password, submits via service function, shows AccountActionResult

## Phase 6: User Story 4 — Delete Account

**Goal**: As an authenticated workspace user, I want to delete my account through a confirmation dialog followed by OTP verification so that destructive actions are protected against accidental or unauthorized execution.

**Independent Test Criteria**:
- Delete section is visually distinct (danger styling)
- Confirmation dialog appears before action
- 6-digit OTP sent to email after confirmation
- User can enter OTP and delete account
- User can resend OTP
- After deletion, user is logged out and redirected
- Auth state cleared

- [X] T027 [P] [US4] Create `src/components/account-settings/OtpInput.tsx` — 6-digit numeric OTP input with auto-focus between fields
- [X] T028 [US4] Create `src/components/account-settings/DeleteAccountSection.tsx` — danger-styled section with confirmation dialog, OTP input flow, uses `useDeleteAccountSendOtp`, `useDeleteAccountResendOtp`, `useDeleteAccount` hooks

## Phase 7: Routing & Navigation

**Goal**: Wire up all routes and navigation entries.

**Depends on**: All user story phases (T019–T028)

- [X] T029 Add `/dashboard/account` route to `src/routes/dashboard/DashboardRoutes.tsx`
- [X] T030 [P] Add `/reset-password` and `/change-email` routes at root level (alongside existing auth routes in `src/routes/auth/AuthRoutes.tsx`)
- [X] T031 [P] Add "Settings" link to `src/components/dashboard/sidebar/DashboardSidebar.tsx` using `FiSettings` icon and `t("dashboard.sidebar.settings")` translation
- [X] T032 [P] Fix navbar "Account Settings" link in `src/components/website/navbars/Navbar.tsx` to point to `/dashboard/account`

## Phase 8: Translations & i18n

**Goal**: Add all English and Arabic translation keys.

**Depends on**: All user story phases (T019–T028)

- [X] T033 Add English translation keys under `dashboard.accountSettings` in `src/i18n/locales/en/common.json` — personal info labels, email section, password section, delete account, validation messages, OTP, success/failure messages
- [X] T034 [P] Add Arabic translation keys under `dashboard.accountSettings` in `src/i18n/locales/ar/common.json`
- [X] T035 [P] Add translation keys for verification pages (change-email result, reset-password form) in both `en/common.json` and `ar/common.json`

## Phase 9: Polish & Cross-Cutting Concerns

**Goal**: Verify quality, accessibility, RTL, responsiveness, and security.

**Depends on**: All previous phases

- [X] T036 Verify RTL layout renders correctly for all sections — form labels, inputs, buttons, icons, dialogs flip correctly
- [X] T037 [P] Verify responsive layout on mobile (< 768px), tablet (768px–1024px), desktop viewports
- [X] T038 Run `npm run lint` and fix any issues
- [X] T039 Run `npm run build` to verify TypeScript compilation
- [X] T040 Verify no sensitive data in console logs or localStorage (passwords, OTPs, tokens)
- [X] T041 Verify existing Forget Password OTP flow is not modified or duplicated

## Dependencies

```
Phase 1 (Setup) ─────────────────────────────────────────┐
    │                                                      │
    ▼                                                      │
Phase 2 (Foundation) ─────────────────────────────────────┤
    │                                                      │
    ├──► Phase 3 (US1: Personal Info) ──┐                 │
    ├──► Phase 4 (US2: Email Change) ───┤                 │
    ├──► Phase 5 (US3: Password Reset) ─┤                 │
    └──► Phase 6 (US4: Delete Account) ─┘                 │
                    │                                      │
                    ▼                                      │
            Phase 7 (Routing) ◄────────────────────────────┘
                    │
                    ▼
            Phase 8 (Translations)
                    │
                    ▼
            Phase 9 (Polish)
```

**User Story Independence**: Phases 3–6 (user stories) can be implemented in parallel after Phase 2 is complete. Each story is independently testable.

## Parallel Execution Examples

### After Phase 2 completes, launch in parallel:
- **Agent A**: Phase 3 (US1: Personal Information)
- **Agent B**: Phase 4 (US2: Email Change)
- **Agent C**: Phase 5 (US3: Password Reset)
- **Agent D**: Phase 6 (US4: Delete Account)

### Within each user story, parallel tasks:
- US1: T019 and T020 are sequential (T020 depends on T019)
- US2: T021, T022, T023 can run in parallel; T024 depends on T023
- US3: T025 and T026 are sequential
- US4: T027 and T028 are sequential (T028 depends on T027)

### After Phase 7, parallel tasks:
- T033, T034, T035 can run in parallel

### Phase 9 parallel tasks:
- T036, T037 can run in parallel

## Implementation Strategy

### MVP Scope (User Story 1: Personal Information)
The Personal Information section is the simplest and most self-contained. Implementing T001–T005, T012, T019–T020, T029, T033–T034, T036–T039 delivers a working, testable feature.

### Incremental Delivery Order
1. **MVP**: Personal Information (US1) — lowest risk, immediate value
2. **Email Change** (US2) — depends on email infrastructure, moderate complexity
3. **Password Reset** (US3) — similar pattern to US2, can reuse AccountActionResult
4. **Delete Account** (US4) — highest risk (destructive action), implement last
5. **Routing & Navigation** (Phase 7) — wire everything together
6. **Translations** (Phase 8) — can be done incrementally with each story
7. **Polish** (Phase 9) — final verification pass

## Definition of Done

- [X] All tasks completed
- [ ] Code review approved
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] All user stories independently testable via quickstart.md scenarios
- [ ] RTL layout verified for all sections
- [ ] Responsive layout verified
- [ ] No sensitive data exposed in console/localStorage
- [ ] Existing Forget Password flow unmodified
