import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

let getTokenFromContext:
  | (() => { accessToken: string; refreshToken: string } | null)
  | null = null;
let handleUnauthorized: (() => Promise<string>) | null = null;
let logoutUnauthorized: (() => Promise<void>) | null = null;

export const setTokenGetter = (
  getter: () => { accessToken: string; refreshToken: string } | null,
) => {
  getTokenFromContext = getter;
};

export const setHandleUnauthorized = (callback: () => Promise<string>) => {
  handleUnauthorized = callback;
};

export const setLogoutUnauthorized = (callback: () => Promise<void>) => {
  logoutUnauthorized = callback;
};

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  async (config) => {
    if (getTokenFromContext) {
      const getToken = getTokenFromContext();
      if (getToken && getToken.accessToken) {
        config.headers.Authorization = `Bearer ${getToken.accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh-token") &&
      !originalRequest.url?.includes("/auth/logout")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers = originalRequest.headers ?? {};
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject: (err: any) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        if (!handleUnauthorized) {
          await logoutUnauthorized?.();
          return Promise.reject(error);
        }
        const newToken = await handleUnauthorized?.();
        processQueue(null, newToken);
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        await logoutUnauthorized?.();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
