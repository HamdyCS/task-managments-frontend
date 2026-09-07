# Quickstart Validation Guide: Account Settings

## Prerequisites

- Node.js 18+ installed
- Backend API running (see `BackendReadme.md` for setup)
- `.env` configured with `VITE_BASE_API_URL` pointing to the backend
- Authenticated user session (logged in via the dashboard)

## Setup

```bash
npm install
npm run dev
```

Navigate to `http://localhost:5173/dashboard`

## Validation Scenarios

### Scenario 1: Access Account Settings

1. Log in to the dashboard
2. Click the user avatar in the navbar → click "Account settings"
   - **Expected**: Navigates to `/dashboard/account`
3. Alternatively, click "Settings" in the sidebar
   - **Expected**: Navigates to `/dashboard/account`
4. Verify the page displays four sections: Personal Information, Email Address, Password & Security, Delete Account
5. Verify "Delete Account" is the last section

### Scenario 2: Update Personal Information

1. Navigate to `/dashboard/account`
2. In the Personal Information section, verify current first name, last name, and date of birth are displayed
3. Change the first name to a new value
4. Click "Save" / "Update"
   - **Expected**: Loading spinner on the button
   - **Expected**: Success toast message
   - **Expected**: Updated first name appears in the navbar greeting
5. Leave the first name empty and submit
   - **Expected**: Validation error message
6. Set date of birth to a date that makes the user under 18 years old
   - **Expected**: Validation error message ("You must be at least 18 years old")
7. Set date of birth to a valid date (age >= 18) and submit
   - **Expected**: Success

### Scenario 3: Change Email Address

1. Navigate to `/dashboard/account`
2. In the Email Address section, verify the current email is displayed as read-only
3. Click the "Change Email" link/button
4. Enter a new email address
5. Click "Send Confirmation"
   - **Expected**: Loading state
   - **Expected**: "Check your email" confirmation message
6. Open the email inbox for the new address
7. Click the verification link in the email
   - **Expected**: Navigates to `/change-email?token=...&email=...`
   - **Expected**: Auto-submits verification
   - **Expected**: Shows success state ("Email changed successfully")
8. Navigate back to `/dashboard/account`
   - **Expected**: New email is displayed

### Scenario 4: Change Email — Invalid/Expired Link

1. Construct a URL with an invalid token: `/change-email?token=invalid&email=test@example.com`
   - **Expected**: Shows failure state ("Link invalid or expired")

### Scenario 5: Reset Password

1. Navigate to `/dashboard/account`
2. In the Password & Security section, click "Update Password"
   - **Expected**: Loading state
   - **Expected**: "Check your email" confirmation message
3. Open the email inbox
4. Click the reset link in the email
   - **Expected**: Navigates to `/reset-password?token=...`
   - **Expected**: Shows form with "New Password" and "Repeat Password" fields
5. Enter a new password in both fields (must match)
6. Click "Reset Password"
   - **Expected**: Loading state
   - **Expected**: Success state ("Password updated successfully")

### Scenario 6: Reset Password — Validation Errors

1. Navigate to `/reset-password?token=<valid-token>`
2. Enter a password shorter than 8 characters
   - **Expected**: Validation error
3. Enter different passwords in the two fields
   - **Expected**: "Passwords do not match" error
4. Leave fields empty and submit
   - **Expected**: Required field errors

### Scenario 7: Delete Account

1. Navigate to `/dashboard/account`
2. Scroll to the Delete Account section
   - **Expected**: Visually distinct danger styling (red border/background)
3. Click "Delete Account"
   - **Expected**: Confirmation dialog appears
4. Click "Cancel"
   - **Expected**: Dialog closes, no action taken
5. Click "Delete Account" again → click "Confirm"
   - **Expected**: Loading state
   - **Expected**: OTP input form appears (6 digits)
6. Enter an incorrect OTP → click "Delete"
   - **Expected**: Error message ("Invalid or expired OTP")
7. Click "Resend OTP"
   - **Expected**: Loading state
   - **Expected**: New OTP sent to email
8. Enter the correct 6-digit OTP → click "Delete"
   - **Expected**: Loading state
   - **Expected**: User is logged out
   - **Expected**: Redirected to `/` or login page
   - **Expected**: User can no longer access `/dashboard/account`

### Scenario 8: RTL Layout

1. Toggle language to Arabic using the language button
   - **Expected**: Page flips to RTL layout
   - **Expected**: Form labels, inputs, buttons, and icons are correctly aligned
   - **Expected**: Delete Account danger section maintains correct RTL alignment
   - **Expected**: OTP input fields flow correctly in RTL

### Scenario 9: Responsive Layout

1. Resize browser to mobile width (< 768px)
   - **Expected**: Sections stack vertically
   - **Expected**: Forms are full-width
   - **Expected**: Buttons are touch-friendly
2. Resize to tablet (768px - 1024px)
   - **Expected**: Layout adapts appropriately

### Scenario 10: Loading & Duplicate Submission Prevention

1. Navigate to `/dashboard/account`
2. In Personal Information, click "Save" rapidly multiple times
   - **Expected**: Only one request is sent (button disabled while pending)
3. In Email Address, click "Send Confirmation" while loading
   - **Expected**: Button is disabled during loading
4. In Delete Account, click through the flow
   - **Expected**: Each step shows loading state and disables interactive elements

## Build Verification

```bash
npm run lint
npm run build
```

- **Expected**: No lint errors
- **Expected**: TypeScript compilation succeeds with no errors
- **Expected**: Build completes successfully
