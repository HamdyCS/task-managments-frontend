const BaseApiURl = import.meta.env.VITE_BASE_API_URL;

const config = {
  BaseApiURl,
  auth: {
    login: `/auth/login`,
  },
};

export default config;
