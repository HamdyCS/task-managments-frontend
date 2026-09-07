# Research: Account Settings

## Technical Context Resolutions

### 1. How should profile updates be handled?

**Decision**: Use `PUT /api/auth` with `{ firstName, lastName, dateOfBirth }` body. Invalidate `["currentUser"]` React Query cache on success.

**Rationale**: The backend already provides this endpoint (BackendReadme.md §1.8). The existing `useCurrentUser` hook fetches from `GET /api/auth` with query key `["currentUser"]`. Invalidating this key triggers a refetch, which dispatches `setUser` to Redux via the existing `useEffect` in `useCurrentUser.ts`.

**Alternatives considered**:
- Dispatching `setUser` directly with the updated data: Risky because the backend response shape may differ from what we construct. Letting React Query refetch ensures consistency.
- Optimistic update: Not worth the complexity for a settings page with low mutation frequency.

### 2. How should the email change flow work?

**Decision**: Two-step email-token flow:
1. User enters new email → `POST /api/auth/change-email/send-email?email={newEmail}` → "Check your email" state
2. User clicks email link → `/change-email?token=...&email=...` page auto-reads token + email → `POST /api/auth/change-email` with `{ token, newEmail }` → success/failure

**Rationale**: Backend provides dedicated endpoints (§1.14, §1.15). No OTP is used for email change per spec clarification. Token is sent as URL query parameter.

**Alternatives considered**:
- OTP-based flow: Explicitly excluded by spec and backend design.
- Manual token entry: Explicitly excluded by spec — token comes from URL only.

### 3. How should the password reset flow work?

**Decision**: Email-token flow:
1. User clicks "Update Password" → `POST /api/auth/reset-password/send-email` → "Check your email" state
2. User clicks email link → `/reset-password?token=...` page shows new password + repeat password form → `POST /api/auth/reset-password` with `{ token, newPassword }` → success/failure

**Rationale**: Backend provides dedicated endpoints (§1.12, §1.13). The existing forget-password OTP flow (§1.9-§1.11) is a separate authentication flow and must NOT be modified or duplicated.

**Alternatives considered**:
- Reusing the existing forget-password OTP flow: Would conflate authentication and account-settings flows. The backend has separate endpoints for each.

### 4. How should account deletion work?

**Decision**: Confirmation dialog → OTP verification → delete:
1. User clicks "Delete Account" → `ConfirmDialog` with danger styling
2. On confirm → `POST /api/auth/delete-account/send-otp` with `{ email }`
3. User enters 6-digit OTP → `DELETE /api/auth/delete-account` with `{ email, otp }`
4. On success → clear auth state, navigate to `/`

**Rationale**: Backend provides OTP-based deletion (§1.16-§1.18). Delete endpoint is "Anonymous (requires auth cookie)" — meaning it clears cookies on success. The existing `useLogout` pattern dispatches `clearUser()` and removes queries, which should be replicated.

**Alternatives considered**:
- Token-based deletion: Not supported by backend.
- Single-click deletion: Violates spec requirement for confirmation + second factor.

### 5. Where should the `/reset-password` and `/change-email` routes live?

**Decision**: Add as root-level routes alongside existing auth routes (in `AuthRoutes.tsx` or a new route config). These must be accessible without the dashboard layout since users click email links.

**Rationale**: Users may not be logged in when they click email links (e.g., password reset from a different device). These routes should use a minimal layout (similar to auth pages) or no layout.

**Alternatives considered**:
- Adding inside `DashboardRoutes`: Would require dashboard authentication, which may not be appropriate for token-based flows.

### 6. How should the sidebar navigation be updated?

**Decision**: Add a "Settings" entry to the sidebar's "Main" section using `FiSettings` icon and existing `t("dashboard.sidebar.settings")` translation key. Link to `/dashboard/account`.

**Rationale**: The design mockup shows Settings at the bottom of the sidebar. The translation key already exists. The navbar already links to `/settings` (dead link) — fix this to `/dashboard/account`.

**Alternatives considered**:
- Adding Settings to the "Analytics" section: Inappropriate — settings is not analytics.
- Adding a separate section: Would add visual clutter for a single item.

### 7. What form library should be used?

**Decision**: Use Formik + Yup, following the existing auth pages pattern (LoginPage, RegisterPage).

**Rationale**: The project already uses Formik + Yup for forms (LoginPage.tsx, RegisterPage.tsx). Introducing a new form library would violate the principle of following existing conventions.

**Alternatives considered**:
- React Hook Form: Not currently used in the project. Would introduce inconsistency.
- Plain React state + manual validation: Would duplicate validation logic that Formik + Yup provides.

### 8. How should the 6-digit OTP input work?

**Decision**: Build a custom `OtpInput` component with 6 individual input fields that auto-focus to the next field on input. Each field accepts only numeric digits.

**Rationale**: No existing OTP input component exists in the project. The existing forget-password OTP flow uses individual input fields (CheckOtpStep.tsx). Build a clean, reusable version.

**Alternatives considered**:
- Single input with max length: Less user-friendly, harder to validate individual digits.
- Third-party OTP library: Would add a dependency not currently in the project.

## Best Practices Found

### React Query Cache Invalidation Pattern

From `useLogin.ts`:
```ts
queryClient.invalidateQueries({ queryKey: ["currentUser"] });
```
This is the established pattern for triggering a refetch of the current user after state-changing operations.

### Mutation Hook Pattern

All mutation hooks follow:
```ts
export default function useXxx(opts: MutationCallBack<TData, TError>) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isError } = useMutation<TData, TError, TInput>({
    mutationKey: ["xxx"],
    mutationFn: serviceFunction,
    onSuccess: (data) => {
      // cache invalidation
      opts.onSuccess?.(data);
    },
    onError: (error) => {
      opts.onError?.(error);
    },
  });
  return { mutateAsync, isPending, isError, error };
}
```

### Toast Pattern

```ts
import { toast } from "sonner";
toast.success(t("translation.key"));
toast.error(t("translation.key"));
```

### Form Input Pattern (Dashboard)

```tsx
<input
  className="w-full h-10 px-3 bg-muted border border-border rounded-lg text-sm text-card-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
/>
```

### RTL Support

All directional classes use `ltr:` and `rtl:` prefixes:
- `ltr:ml-[260px] rtl:mr-[260px]`
- `ltr:rounded-r-lg ltr:border-l-4 rtl:rounded-l-lg rtl:border-r-4`
