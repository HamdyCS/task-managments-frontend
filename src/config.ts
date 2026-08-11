const BaseApiURl = import.meta.env.VITE_BASE_API_URL;

const config = {
  BaseApiURl,
  auth: {
    register: `/auth/register-user`,
    login: `/auth/login`,
    currentUser: `/auth`,
    googleLogin: `/auth/login-user-with-google`,
    refreshToken: `/auth/refresh-token`,
    confirmEmail: `/auth/confirm-email`,
    forgetPassword: {
      sendOtp: `/auth/forget-password/send-otp`,
      resendOtp: `/auth/forget-password/resend-otp`,
      reset: `/auth/forget-password`,
    },
  },
};

export default config;
