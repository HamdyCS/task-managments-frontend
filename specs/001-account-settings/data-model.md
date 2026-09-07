# Data Model: Account Settings

## Entities

### UserDto (existing)

The existing user entity fetched via `GET /api/auth`. No changes to this entity.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique user identifier |
| `email` | `string` | User's email address |
| `firstName` | `string` | User's first name |
| `lastName` | `string` | User's last name |
| `dateOfBirth` | `string` | ISO 8601 date string (YYYY-MM-DD) |
| `role` | `Role` | "Owner" \| "ProjectManager" \| "Member" |

**Source**: `src/dtos/auth/UserDto.ts`

### UpdateProfileDto (new)

DTO for `PUT /api/auth` profile update request.

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `firstName` | `string` | Yes | Non-empty, trimmed |
| `lastName` | `string` | Yes | Non-empty, trimmed |
| `dateOfBirth` | `string` | Yes | Valid ISO 8601 date (YYYY-MM-DD), age must be >= 18 |

**Source**: `src/dtos/auth/UpdateProfileDto.ts` (new)

### ChangeEmailRequestDto (new)

DTO for `POST /api/auth/change-email` confirmation request.

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `token` | `string` | Yes | Non-empty (read from URL query param) |
| `newEmail` | `string` | Yes | Valid email format (read from URL query param) |

**Source**: `src/dtos/auth/ChangeEmailDto.ts` (new)

### DeleteAccountDto (new)

DTO for `DELETE /api/auth/delete-account` request.

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `email` | `string` | Yes | Non-empty, valid email |
| `otp` | `string` | Yes | Exactly 6 numeric digits |

**Source**: `src/dtos/auth/DeleteAccountDto.ts` (new)

### SendOtpEmailDto (new)

DTO for `POST /api/auth/delete-account/send-otp` and `resend-otp` requests.

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `email` | `string` | Yes | Non-empty, valid email |

**Note**: Reuses the shape of the existing `SendOtpDto` from `ForgetPasswordDto.ts`, but is used in a different context (account deletion vs. forget password). Consider reusing `SendOtpDto` if the shape matches exactly.

## State Transitions

### Profile Update Flow

```
IDLE → SUBMITTING → SUCCESS
                    → ERROR → IDLE (user retries)
```

No persistent state transitions. On success, the React Query `["currentUser"]` cache is invalidated and refetched.

### Email Change Flow

```
IDLE → SUBMITTING_SEND_EMAIL → CHECK_EMAIL
                                  → EXPIRED (link expired)
CONFIRMING → SUCCESS
           → ERROR (invalid/expired token)
```

**States**:
- `IDLE`: User sees current email + "Change Email" button
- `SUBMITTING_SEND_EMAIL`: Loading while sending confirmation email
- `CHECK_EMAIL`: "Check your email" message displayed
- `CONFIRMING`: Verification page auto-submitting token
- `SUCCESS`: Email changed, current-user cache invalidated
- `ERROR`: Link invalid/expired or operation failed

### Password Reset Flow

```
IDLE → SUBMITTING_SEND_EMAIL → CHECK_EMAIL
                                  → EXPIRED (link expired)
FORM → SUBMITTING_RESET → SUCCESS
                        → ERROR (invalid/expired token)
```

**States**:
- `IDLE`: User sees "Update Password" button
- `SUBMITTING_SEND_EMAIL`: Loading while sending reset email
- `CHECK_EMAIL`: "Check your email" message displayed
- `FORM`: Reset password form (new password + repeat password)
- `SUBMITTING_RESET`: Loading while resetting password
- `SUCCESS`: Password updated
- `ERROR`: Link invalid/expired or operation failed

### Delete Account Flow

```
IDLE → CONFIRM_DIALOG → CONFIRMED → SENDING_OTP → OTP_INPUT
                                                    → RESENDING_OTP → OTP_INPUT
DELETE_SUBMITTING → SUCCESS (auth cleared, redirect)
                  → ERROR (invalid OTP) → OTP_INPUT
```

**States**:
- `IDLE`: User sees danger-styled "Delete Account" section
- `CONFIRM_DIALOG`: ConfirmDialog open
- `CONFIRMED`: Dialog confirmed, sending OTP
- `SENDING_OTP`: Loading while sending OTP
- `OTP_INPUT`: OTP input form visible
- `RESENDING_OTP`: Loading while resending OTP
- `DELETE_SUBMITTING`: Loading while deleting account
- `SUCCESS`: Account deleted, auth cleared, redirected to `/`
- `ERROR`: Invalid OTP, user can retry

## Relationships

```
UserDto ──(fetched by)── useCurrentUser hook
    │
    ├──(updated by)── UpdateProfileDto → PUT /api/auth → invalidate ["currentUser"]
    │
    ├──(email changed by)── ChangeEmailRequestDto → POST /api/auth/change-email → invalidate ["currentUser"]
    │
    └──(deleted by)── DeleteAccountDto → DELETE /api/auth/delete-account → clearUser() + removeQueries
```

## Validation Rules

### Personal Information

| Rule | Field | Condition | Message Key |
|------|-------|-----------|-------------|
| Required | firstName | Empty | `accountSettings.validation.firstNameRequired` |
| Required | lastName | Empty | `accountSettings.validation.lastNameRequired` |
| Required | dateOfBirth | Empty | `accountSettings.validation.dateOfBirthRequired` |
| Valid date | dateOfBirth | Not a valid date | `accountSettings.validation.dateOfBirthInvalid` |
| Minimum age | dateOfBirth | Age < 18 years | `accountSettings.validation.ageMinimum` |

### Email Change

| Rule | Field | Condition | Message Key |
|------|-------|-----------|-------------|
| Required | newEmail | Empty | `accountSettings.validation.emailRequired` |
| Valid email | newEmail | Invalid format | `accountSettings.validation.emailInvalid` |
| Same email | newEmail | Equals current email | `accountSettings.validation.emailSameAsCurrent` |

### Password Reset

| Rule | Field | Condition | Message Key |
|------|-------|-----------|-------------|
| Required | newPassword | Empty | `accountSettings.validation.passwordRequired` |
| Min length | newPassword | < 8 characters | `accountSettings.validation.passwordMinLength` |
| Required | repeatPassword | Empty | `accountSettings.validation.repeatPasswordRequired` |
| Match | repeatPassword | ≠ newPassword | `accountSettings.validation.passwordMismatch` |

### Delete Account OTP

| Rule | Field | Condition | Message Key |
|------|-------|-----------|-------------|
| Required | otp | Empty | `accountSettings.validation.otpRequired` |
| Exact length | otp | ≠ 6 digits | `accountSettings.validation.otpLength` |
| Numeric only | otp | Contains non-digit | `accountSettings.validation.otpNumeric` |
