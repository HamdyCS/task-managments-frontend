const BaseApiURl = import.meta.env.VITE_BASE_API_URL;

const config = {
  BaseApiURl,
  auth: {
    login: `/auth/login`,
    currentUser: `/auth`,
    googleLogin: `/auth/login-user-with-google`,
    refreshToken: `/auth/refresh-token`,
  },
};

export default config;
