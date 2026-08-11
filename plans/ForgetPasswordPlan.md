Implement the complete Forgot Password flow in the existing frontend application.

IMPORTANT:
This is a FRONTEND-ONLY implementation.
The backend APIs are already implemented and available.
Do NOT modify, create, or change any backend code.
Use the existing API layer/services/hooks and existing project architecture wherever possible.

REFERENCE DESIGN:
Use the attached/current Forget Password screenshot as the exact visual reference.

The existing Forget Password page already has the desired authentication layout.

DO NOT redesign the page.

The goal is to keep the exact same authentication layout and visual design, while making the right-side authentication form a 3-step flow.

==================================================
CORE REQUIREMENT
==================================================

There must be ONE Forget Password page/component.

Do NOT create three separate pages/routes for:

- Send OTP
- Check OTP
- Reset Password

Instead, keep them inside the same Forget Password page.

The LEFT SIDE of the authentication layout must remain completely unchanged.

Only the RIGHT SIDE form content changes according to the current step.

Conceptually:

ForgetPasswordPage
├── Existing Auth Layout
│
├── LeftPanel
│   └── KEEP EXACTLY AS CURRENT DESIGN
│
└── RightPanel
    ├── SendOtpStep
    ├── CheckOtpStep
    └── ResetPasswordStep

The right panel should render only the current step.

==================================================
FLOW
==================================================

The complete flow must be:

Login
   ↓
Forget Password
   ↓
Send OTP
   ↓
API success
   ↓
Check OTP
   ↓
API success
   ↓
Reset Password
   ↓
API success
   ↓
Toast success
   ↓
Login

Detailed behavior:

1. User opens Forget Password.
2. The initial step is SEND OTP.
3. User enters their email.
4. User clicks the Send OTP button.
5. Call the existing backend Send OTP API.
6. If the API succeeds:
   - Show the Check OTP step automatically.
   - Do not navigate to another page.
7. If the API fails:
   - Stay on Send OTP.
   - Show the existing application's error toast mechanism.
8. User enters the 6-digit OTP.
9. User submits the OTP.
10. Call the existing Check OTP API.
11. If the API succeeds:
    - Automatically show Reset Password.
12. If the API fails:
    - Stay on Check OTP.
    - Show an error toast.
13. User enters the new password and confirmation password.
14. Submit Reset Password.
15. If the API succeeds:
    - Show a success toast.
    - Navigate to the existing Login page.
16. If the API fails:
    - Stay on Reset Password.
    - Show an error toast.

==================================================
STEP 1 — SEND OTP
==================================================

The first step should contain:

Title:
"نسيت كلمة المرور؟"

Supporting text explaining that the user should enter their email to receive a verification code.

Email input:

Label:
"البريد الإلكتروني"

Placeholder should follow the existing application's design conventions.

Primary button:
"إرسال رمز التحقق"

The form must:

- Validate that the email is required.
- Validate email format using the project's existing validation approach.
- Prevent submission while the API request is pending.
- Show the existing loading state/spinner used by the application.
- Use the existing toast/error handling system.

After successful API response:
Move automatically to Check OTP.

Do NOT navigate to another route.

==================================================
STEP 2 — CHECK OTP
==================================================

The second step must stay inside the exact same right-side panel.

Design an OTP verification form matching the existing authentication design.

Title should communicate:

"تحقق من رمز التحقق"

Supporting text should explain that a verification code was sent to the entered email.

OTP input:

Use six separate inputs:

[ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ]

Requirements:

- Exactly 6 digits.
- Numbers only.
- Each input accepts one digit.
- Automatically move focus to the next input after entering a digit.
- Backspace should move focus to the previous input when appropriate.
- Support pasting the complete 6-digit OTP.
- Do not allow non-numeric characters.
- Keep the OTP value as one logical value for API submission.
- Properly handle validation when the OTP is incomplete.

Add a countdown timer for Resend OTP.

Example:

"إعادة إرسال الرمز خلال 00:45"

When the countdown reaches zero:

Show:

"إعادة إرسال الرمز"

The user can then request a new OTP.

When Resend OTP is clicked:

- Call the existing Send OTP API again using the existing email.
- Restart the countdown.
- Clear/reset the OTP inputs if appropriate.
- Show success/error toast according to the API response.
- Do not leave the current Check OTP step.

The countdown must not create memory leaks.

Make sure timers are properly cleaned up when the component unmounts or the step changes.

==================================================
STEP 3 — RESET PASSWORD
==================================================

The third step should use the same visual design as the existing Forget Password / authentication form.

Fields:

1. New Password
2. Confirm Password

Both password fields should support:

- Show/hide password.
- Existing application's password input styling.
- Required validation.
- Password confirmation validation.
- Existing password validation rules if they already exist in the project.

Primary button:

"إعادة تعيين كلمة المرور"

When submitted:

- Disable the button while the request is pending.
- Show the existing loading state.
- Call the existing Reset Password API.
- Use the existing API/service implementation.

IMPORTANT:

There is NO frontend token handling required.

Do not introduce JWT/reset-token logic if the existing backend flow does not require it.

Use the existing API contract exactly as implemented in the project.

==================================================
NAVIGATION / BACK BUTTON
==================================================

Every step should contain the existing authentication back/navigation action.

The behavior must be:

Back → Login

IMPORTANT:

The back button should ALWAYS return directly to the Login page.

It should NOT behave like:

Check OTP → Send OTP

or:

Reset Password → Check OTP

The user must return to Login immediately.

Use the application's existing routing/navigation conventions.

Do not create new routes unless the existing architecture requires the Forget Password route itself.

==================================================
SUCCESS / ERROR HANDLING
==================================================

Use the application's existing toast/notification system.

Do NOT introduce another toast library.

For API failures:

- Show an error toast.
- Keep the user on the current step.
- Do not reset the whole flow.

For successful OTP sending:

- Move to Check OTP.

For successful OTP verification:

- Move to Reset Password.

For successful password reset:

- Show a success toast.
- Navigate to Login.

Example success message:

"تم تغيير كلمة المرور بنجاح"

Example error message:

"حدث خطأ، يرجى المحاولة مرة أخرى"

Use the project's existing API error response/message handling if available instead of hardcoding generic messages unnecessarily.

==================================================
STATE MANAGEMENT
==================================================

Implement the flow using clean local state or the project's existing form/state management approach.

A simple conceptual state is:

type ForgotPasswordStep =
  | "sendOtp"
  | "checkOtp"
  | "resetPassword";

The Forget Password page should own the current step.

Example conceptual flow:

const [step, setStep] = useState<ForgotPasswordStep>("sendOtp");

Keep the user's email available across the three steps.

The OTP should also be available when needed.

Do not store unnecessary sensitive data globally.

Do not use Redux/global state unless the existing architecture already requires it.

==================================================
FORMS
==================================================

Before implementing new form logic, inspect the existing project.

Reuse:

- Existing form library
- Existing validation library
- Existing Input components
- Existing Button components
- Existing password input
- Existing toast system
- Existing API hooks/services
- Existing loading patterns
- Existing typography
- Existing spacing/design tokens

Do not duplicate existing components unnecessarily.

==================================================
DESIGN REQUIREMENTS
==================================================

The screenshot is the primary visual reference.

Preserve the current:

- Authentication layout
- Left-side image
- Left-side branding
- WorkPilot branding
- Right-side panel
- Card dimensions
- Borders
- Border radius
- Typography
- Font sizes
- Spacing
- Input styling
- Button styling
- Icons
- Background
- Dark/light theme behavior
- Responsive behavior

DO NOT redesign the authentication page.

The only visual change should be the content of the right-side authentication form based on the current step.

The three steps should look like they belong to the exact same authentication flow.

==================================================
TRANSITIONS
==================================================

Use a subtle transition when changing between:

Send OTP
→
Check OTP
→
Reset Password

The transition should be smooth and professional.

Do NOT make the transition exaggerated or distracting.

The overall layout should not jump or resize unnecessarily.

If Framer Motion is already used in the project, reuse it.

Otherwise use the existing project approach.

==================================================
RESPONSIVENESS
==================================================

Maintain the existing responsive authentication layout.

Do not break mobile/tablet/desktop behavior.

The OTP inputs must remain properly aligned and usable on small screens.

The right panel content should remain vertically and horizontally consistent with the current design.

==================================================
ACCESSIBILITY
==================================================

Implement proper:

- Labels
- Input types
- autocomplete attributes where appropriate
- Keyboard navigation
- Focus management
- Disabled states
- Error messages

For OTP:

- Keyboard navigation between inputs.
- Correct focus behavior.
- Support paste.
- Do not trap the keyboard focus.

==================================================
IMPORTANT IMPLEMENTATION PROCESS
==================================================

Before changing code:

1. Inspect the existing Forget Password page.
2. Inspect the existing Login page.
3. Inspect the authentication layout/components.
4. Inspect the existing API services/hooks for:
   - Send OTP
   - Check OTP
   - Reset Password
5. Inspect the existing DTO/types for these requests.
6. Inspect the existing toast implementation.
7. Inspect the existing form/validation approach.
8. Inspect the existing routing configuration.
9. Inspect existing reusable authentication inputs/buttons.

Then implement the feature using the existing architecture.

Do not invent API endpoint names or request DTO shapes.

Do not create fake/mock APIs.

Do not modify the backend.

Do not introduce unnecessary dependencies.

==================================================
EXPECTED FINAL ARCHITECTURE
==================================================

Keep the implementation clean and maintainable.

A reasonable structure could be:

ForgetPassword/
├── ForgetPasswordPage.tsx
├── components/
│   ├── SendOtpForm.tsx
│   ├── CheckOtpForm.tsx
│   └── ResetPasswordForm.tsx
└── ...

But first inspect the existing project structure and follow its conventions instead of blindly creating this structure.

The three forms can be separate components if that makes the code cleaner, but they MUST render inside the SAME Forget Password page/layout.

There must NOT be three separate routes/pages.

==================================================
FINAL ACCEPTANCE CRITERIA
==================================================

The implementation is complete only if:

[ ] Forget Password remains one page/layout.
[ ] Left side remains unchanged.
[ ] Right side initially shows Send OTP.
[ ] Email input works.
[ ] Send OTP API is called correctly.
[ ] Successful Send OTP automatically switches to Check OTP.
[ ] Failed Send OTP shows an error toast and stays on the same step.
[ ] OTP has exactly 6 separate inputs.
[ ] OTP supports keyboard navigation.
[ ] OTP supports paste.
[ ] OTP accepts digits only.
[ ] Countdown works.
[ ] Resend OTP works.
[ ] Countdown resets after resend.
[ ] Successful OTP verification automatically switches to Reset Password.
[ ] Failed OTP verification shows an error toast.
[ ] Reset Password contains New Password + Confirm Password.
[ ] Password visibility toggles work.
[ ] Password validation works.
[ ] Reset Password API is called correctly.
[ ] Successful reset shows a success toast.
[ ] Successful reset redirects to Login.
[ ] Failed reset shows an error toast and stays on Reset Password.
[ ] Back button from ANY step goes directly to Login.
[ ] No separate routes are created for the three steps.
[ ] Existing API layer is reused.
[ ] Existing toast system is reused.
[ ] Existing form/validation conventions are reused.
[ ] Existing design system is preserved.
[ ] Dark mode remains correct.
[ ] Light mode remains correct.
[ ] Responsive behavior remains correct.
[ ] No backend code is modified.
[ ] No unnecessary dependencies are added.
[ ] No mock API implementation is introduced.

After implementation, run the project's existing type-check/lint/build commands if available and fix any errors caused by the implementation.