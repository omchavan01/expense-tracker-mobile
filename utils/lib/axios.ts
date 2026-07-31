import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: {
  resolve: (tokens: { accessToken: string; refreshToken: string }) => void;
  reject: (err: any) => void;
}[] = [];
let getTokenFromContext:
  | (() => { accessToken: string; refreshToken: string } | null)
  | null = null;
let handleTokens:
  | (() => Promise<{ accessToken: string; refreshToken: string }>)
  | null = null;
let handleLogout: (() => Promise<void>) | null = null;

export const setTokenGetter = (
  getter: () => { accessToken: string; refreshToken: string } | null,
) => {
  getTokenFromContext = getter;
};
export const setHandleTokens = (
  callback: () => Promise<{ accessToken: string; refreshToken: string }>,
) => {
  handleTokens = callback;
};
export const setHandleLogout = (callback: () => Promise<void>) => {
  handleLogout = callback;
};

const processQueue = (
  error: any,
  tokens: { accessToken: string; refreshToken: string } | null = null,
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(tokens!);
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
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh-token") &&
      !originalRequest.url?.includes("/auth/logout")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (tokens) => {
              originalRequest.headers = originalRequest.headers ?? {};
              originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
              resolve(axiosInstance(originalRequest));
            },
            reject: (err: any) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const tokens = await handleTokens?.();
        processQueue(null, tokens);
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${tokens?.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        await handleLogout?.();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
