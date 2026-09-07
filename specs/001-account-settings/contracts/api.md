# API Contracts: Account Settings

All endpoints are prefixed with `/api` (base URL from `VITE_BASE_API_URL`).

## 1. Update Profile

```
PUT /api/auth
```

**Auth**: Required (cookie)

**Request Body**:
```json
{
  "firstName": "Johnny",
  "lastName": "Doe",
  "dateOfBirth": "2000-01-01"
}
```

**Response**: `201 Created`
```json
{
  "id": "a1b2c3...",
  "email": "john@example.com",
  "firstName": "Johnny",
  "lastName": "Doe",
  "dateOfBirth": "2000-01-01",
  "role": "Member"
}
```

**Errors**:
- `400` — Validation error (missing/invalid fields)
- `401` — Unauthorized

---

## 2. Send Change-Email Confirmation

```
POST /api/auth/change-email/send-email?email={newEmail}
```

**Auth**: Required (cookie)

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | `string` | Yes | The new email address |

**Request Body**: None

**Response**: `204 No Content`

**Errors**:
- `400` — Invalid email format
- `409` — Email already in use
- `401` — Unauthorized

---

## 3. Confirm Email Change

```
POST /api/auth/change-email
```

**Auth**: Required (cookie)

**Request Body**:
```json
{
  "token": "<changeToken>",
  "newEmail": "new@example.com"
}
```

**Response**: `204 No Content`

**Errors**:
- `400` — Invalid or expired token
- `401` — Unauthorized

---

## 4. Send Password Reset Email

```
POST /api/auth/reset-password/send-email
```

**Auth**: Required (cookie)

**Request Body**: None

**Response**: `204 No Content`

**Errors**:
- `401` — Unauthorized

---

## 5. Reset Password

```
POST /api/auth/reset-password
```

**Auth**: Required (cookie)

**Request Body**:
```json
{
  "token": "<resetToken>",
  "newPassword": "NewPassword123!"
}
```

**Response**: `204 No Content`

**Errors**:
- `400` — Invalid or expired token
- `400` — Password does not meet strength requirements
- `401` — Unauthorized

---

## 6. Send Delete-Account OTP

```
POST /api/auth/delete-account/send-otp
```

**Auth**: Required (cookie)

**Request Body**:
```json
{
  "email": "john@example.com"
}
```

**Response**: `204 No Content`

**Errors**:
- `401` — Unauthorized

---

## 7. Resend Delete-Account OTP

```
POST /api/auth/delete-account/resend-otp
```

**Auth**: Required (cookie)

**Request Body**:
```json
{
  "email": "john@example.com"
}
```

**Response**: `204 No Content`

**Errors**:
- `401` — Unauthorized

---

## 8. Delete Account

```
DELETE /api/auth/delete-account
```

**Auth**: Required (cookie — note: marked "Anonymous" in backend docs but requires auth cookie)

**Request Body**:
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response**: `204 No Content` — Clears auth cookies

**Errors**:
- `400` — Invalid or expired OTP
- `401` — Unauthorized

---

## Frontend Routes

These are frontend routes (not backend endpoints) used in email verification links.

### Change Email Verification

```
/change-email?token={encodedToken}&email={newEmail}
```

- Token is Base64-url-encoded by the backend
- Frontend reads both `token` and `email` from URL query params
- Auto-submits `POST /api/auth/change-email` with `{ token, newEmail }`

### Reset Password

```
/reset-password?token={encodedToken}
```

- Token is Base64-url-encoded by the backend
- Frontend reads `token` from URL query params
- Shows form with new password + repeat password
- Submits `POST /api/auth/reset-password` with `{ token, newPassword }`

## Config Additions

New entries to add to `src/config.ts` under `auth`:

```ts
auth: {
  // ... existing endpoints
  updateProfile: `/auth`,
  changeEmail: {
    sendEmail: `/auth/change-email/send-email`,
    confirm: `/auth/change-email`,
  },
  resetPassword: {
    sendEmail: `/auth/reset-password/send-email`,
    reset: `/auth/reset-password`,
  },
  deleteAccount: {
    sendOtp: `/auth/delete-account/send-otp`,
    resendOtp: `/auth/delete-account/resend-otp`,
    delete: `/auth/delete-account`,
  },
}
```
