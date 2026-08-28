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
    myRole: (id: number) => `/workspaces/${id}/my-role`,
    dashboard: (id: number) => `/workspaces/${id}/dashboard`,
    allUsers: (id: number) => `/workspaces/${id}/all-users`,
  },
  project: {
    all: (workspaceId: number) => `/workspaces/${workspaceId}/projects`,
  },
  task: {
    all: (workspaceId: number, projectId: number) =>
      `/workspaces/${workspaceId}/projects/${projectId}/tasks`,
    my: (workspaceId: number, projectId: number) =>
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/me`,
    single: (workspaceId: number, projectId: number, taskId: number) =>
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
    status: (workspaceId: number, projectId: number, taskId: number) =>
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/status`,
    selfStatus: (workspaceId: number, projectId: number, taskId: number) =>
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/me/status`,
    assign: (workspaceId: number, projectId: number, taskId: number) =>
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/assignments`,
    unassign: (
      workspaceId: number,
      projectId: number,
      taskId: number,
      userId: string,
    ) =>
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/assignments/${userId}`,
    comments: (workspaceId: number, projectId: number, taskId: number) =>
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/comments`,
    comment: (
      workspaceId: number,
      projectId: number,
      taskId: number,
      commentId: number,
    ) =>
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
    attachments: (workspaceId: number, projectId: number, taskId: number) =>
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/attachments`,
    attachment: (
      workspaceId: number,
      projectId: number,
      taskId: number,
      attachmentId: number,
    ) =>
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/attachments/${attachmentId}`,
    downloadAttachment: (
      workspaceId: number,
      projectId: number,
      taskId: number,
      attachmentId: number,
    ) =>
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/attachments/${attachmentId}/download`,
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
