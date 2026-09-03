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
    all: (page: number, pageSize: number) =>
      `/workspaces/all?pageNumber=${page}&pageSize=${pageSize}`,
    single: (id: number) => `/workspaces/${id}`,
    create: `/workspaces`,
    update: (id: number) => `/workspaces/${id}`,
    delete: (id: number) => `/workspaces/${id}`,
    myRole: (id: number) => `/workspaces/${id}/my-role`,
    dashboard: (id: number) => `/workspaces/${id}/dashboard`,
    allUsers: (id: number, page: number, pageSize: number) =>
      `/workspaces/${id}/all-users?pageNumber=${page}&pageSize=${pageSize}`,
  },
  project: {
    all: (workspaceId: number, pageNumber?: number, pageSize?: number) => {
      let url = `/workspaces/${workspaceId}/projects`;
      if (pageNumber !== undefined && pageSize !== undefined) {
        url += `?pageNumber=${pageNumber}&pageSize=${pageSize}`;
      }
      return url;
    },
    single: (workspaceId: number, projectId: number) =>
      `/workspaces/${workspaceId}/projects/${projectId}`,
    create: (workspaceId: number) => `/workspaces/${workspaceId}/projects`,
    update: (workspaceId: number, projectId: number) =>
      `/workspaces/${workspaceId}/projects/${projectId}`,
    delete: (workspaceId: number, projectId: number) =>
      `/workspaces/${workspaceId}/projects/${projectId}`,
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
  workspaceInvite: {
    byId: (id: number) => `/workspace-invites/${id}`,
    myReceived: (page: number, pageSize: number) =>
      `/workspace-invites/all-my-invites?pageNumber=${page}&pageSize=${pageSize}`,
    mySent: (page: number, pageSize: number) =>
      `/workspace-invites/all-my-send-invites?pageNumber=${page}&pageSize=${pageSize}`,
    create: `/workspace-invites`,
    accept: (id: number) => `/workspace-invites/${id}/accept`,
    reject: (id: number) => `/workspace-invites/${id}/reject`,
  },
  notification: {
    all: (page: number, pageSize: number) =>
      `/notifications/all?pageNumber=${page}&pageSize=${pageSize}`,
    unread: (page: number, pageSize: number) =>
      `/notifications/all/unread?pageNumber=${page}&pageSize=${pageSize}`,
    markRead: (id: number) => `/notifications/${id}/read`,
  },
  reports: {
    workspace: (workspaceId: number) =>
      `/workspaces/${workspaceId}/reports`,
    workspacePdf: (workspaceId: number) =>
      `/workspaces/${workspaceId}/reports/pdf/download`,
    projectTasksByStatus: (workspaceId: number, projectId: number) =>
      `/workspaces/${workspaceId}/reports/projects/${projectId}/tasks-by-status`,
    projectTasksByPriority: (workspaceId: number, projectId: number) =>
      `/workspaces/${workspaceId}/reports/projects/${projectId}/tasks-by-priority`,
    projectMemberPerformance: (
      workspaceId: number,
      projectId: number,
      memberId: string,
    ) =>
      `/workspaces/${workspaceId}/reports/projects/${projectId}/members/${memberId}/performance`,
    memberPerformance: (workspaceId: number, memberId: string) =>
      `/workspaces/${workspaceId}/reports/members/${memberId}/performance`,
  },
};

export default config;
