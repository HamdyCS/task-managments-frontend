const BaseApiURl = import.meta.env.VITE_BASE_API_URL;
const SignalRUrl = import.meta.env.VITE_SIGNALR_URL;

const config = {
  BaseApiURl,
  SignalRUrl,
  auth: {
    register: `/auth/register-user`,
    login: `/auth/login`,
    currentUser: `/auth`,
    googleLogin: `/auth/login-user-with-google`,
    refreshToken: `/auth/refresh-token`,
    logout: `/auth/logout`,
    confirmEmail: `/auth/confirm-email`,
    forgetPassword: {
      sendOtp: `/auth/forget-password/send-otp`,
      resendOtp: `/auth/forget-password/resend-otp`,
      reset: `/auth/forget-password`,
    },
  },
  workspace: {
    all: `/workspaces/all`,
    dashboard: (id: number) => `/workspaces/${id}/dashboard`,
  },
  notification: {
    all: (page: number, pageSize: number) =>
      `/notifications/all?pageNumber=${page}&pageSize=${pageSize}`,
    unread: (page: number, pageSize: number) =>
      `/notifications/all/unread?pageNumber=${page}&pageSize=${pageSize}`,
    markRead: (id: number) => `/notifications/${id}/read`,
  },
};

export default config;
