import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import config from "../config";
import { refreshToken } from "../services/authService";

//for auth endpoints
export const authApi = axios.create({
  baseURL: config.BaseApiURl,
  withCredentials: true,
});

//for all endpoints need access token and refresh token
export const api = axios.create({
  baseURL: config.BaseApiURl,
  withCredentials: true,
});

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
let isRefreshing = false;

interface FailedQueueItem {
  resolve: (value?: unknown) => void;
  reject: (error?: any) => void;
}

let failedQueue: FailedQueueItem[] = [];

function processQueue(error: any | null) {
  failedQueue.forEach((promise) => {
    if (error) {
      // رفض ال promise
      promise.reject(error);
    } else {
      // نفذ ال promise
      promise.resolve(null);
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    //get original request
    const originalRequest = error.config as CustomAxiosRequestConfig;

    //if not 401 or no request or request is already retried
    if (
      !originalRequest ||
      !error.response ||
      originalRequest._retry ||
      error.response.status !== 401
    ) {
      //return error
      return Promise.reject(error);
    }

    //if already refreshing (add request to queue)
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        //add request to queue
        //بعلق ال request في قائمة ال requests
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          //retry request
          return api(originalRequest);
        })
        .catch((err) => {
          //send error
          return Promise.reject(err);
        });
    }

    //mark request as retried
    originalRequest._retry = true;

    //set refreshing to true
    isRefreshing = true;

    //refresh token
    try {
      await refreshToken();

      //retry all failed requests
      processQueue(null);

      //retry request
      return api(originalRequest);
    } catch (error) {
      //process queue with error
      processQueue(error);

      //return error
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);
