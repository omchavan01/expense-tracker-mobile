import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let getTokenFromContext:
  | (() => { accessToken: string; refreshToken: string } | null)
  | null = null;
let handleUnauthorized: (() => void) | null = null;

export const setTokenGetter = (
  getter: () => { accessToken: string; refreshToken: string } | null
) => {
  getTokenFromContext = getter;
};

export const setHandleUnauthorized = (callback: () => void) => {
  handleUnauthorized = callback;
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
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.message ?? "";
      if (errorMessage.toLowerCase().includes("token expired")) {
        handleUnauthorized?.();
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
