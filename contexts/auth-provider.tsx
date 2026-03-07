/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import axios from "axios";

import axiosInstance, {
  setTokenGetter,
  setHandleUnauthorized,
  setLogoutUnauthorized,
} from "@/utils/lib/axios";
import {
  deleteSecureStoreKey,
  getSecureStoreKey,
  setSecureStoreKey,
} from "@/utils/lib/secure-store";
import { getErrorMessage } from "@/utils/lib/error-helper";
import { User } from "@/utils/lib/types";

interface AuthContextType {
  loading: boolean;
  user: User | null;
  setUserData: (userData: any, isAuthenticated: boolean) => void;
  setAuthTokensAndExpiry: (
    accessToken: string,
    refreshToken: string,
    accessTokenExpiresAt: string,
    refreshTokenExpiresAt: string,
  ) => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const setUserData = (updates: any | null, isAuthenticated?: boolean) => {
    setUser((prev: User | null) => {
      if (!updates) return null;

      return {
        userData: {
          ...(prev?.userData ?? {}),
          ...updates,
        },
        isAuthenticated: isAuthenticated ?? prev?.isAuthenticated ?? false,
      };
    });
  };

  const refreshAccessToken = async () => {
    const refreshToken = await getSecureStoreKey("refreshToken");

    const baseURL = process.env.EXPO_PUBLIC_API_URL;

    const { data } = await axios.post(`${baseURL}/auth/refresh-token`, {
      refreshToken,
    });
    await setAuthTokensAndExpiry(
      data.result.accessToken,
      data.result.refreshToken,
      data.result.accessTokenExpiresAt,
      data.result.refreshTokenExpiresAt,
    );
    return data.result.accessToken;
  };

  const loadUser = async () => {
    try {
      setLoading(true);
      const [
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
        refreshTokenExpiresAt,
      ] = await Promise.all([
        getSecureStoreKey("accessToken"),
        getSecureStoreKey("refreshToken"),
        getSecureStoreKey("accessTokenExpiresAt"),
        getSecureStoreKey("refreshTokenExpiresAt"),
      ]);

      if (!accessToken || !refreshToken) return;

      await setAuthTokensAndExpiry(
        accessToken,
        refreshToken,
        accessTokenExpiresAt!,
        refreshTokenExpiresAt!,
      );

      // Refresh access token if it is expired within 1 minute
      if (Date.now() >= new Date(accessTokenExpiresAt!).getTime() - 60_000) {
        await refreshAccessToken();
      }

      const { data } = await axiosInstance.get("/users/info");
      setUserData(data.result.user, true);
    } catch (error) {
      console.log(getErrorMessage(error), "error");
      await clearAuthState();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    setHandleUnauthorized(() => refreshAccessToken());
  }, []);

  useEffect(() => {
    setLogoutUnauthorized(() => logout());
  }, []);

  const setAuthTokensAndExpiry = async (
    accessToken: string,
    refreshToken: string,
    accessTokenExpiresAt: string,
    refreshTokenExpiresAt: string,
  ) => {
    await Promise.all([
      setSecureStoreKey("accessToken", accessToken),
      setSecureStoreKey("refreshToken", refreshToken),
      setSecureStoreKey("accessTokenExpiresAt", accessTokenExpiresAt),
      setSecureStoreKey("refreshTokenExpiresAt", refreshTokenExpiresAt),
    ]);
    setTokenGetter(() => ({
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    }));
  };

  const login = async () => {
    try {
      const { data } = await axiosInstance.get("/users/info");
      setUserData(data.result.user, true);
    } catch (error) {
      console.log(getErrorMessage(error), "error");
    }
  };

  const clearAuthState = async () => {
    setUserData(null, false);
    setTokenGetter(() => null);
    await Promise.all([
      deleteSecureStoreKey("accessToken"),
      deleteSecureStoreKey("refreshToken"),
      deleteSecureStoreKey("accessTokenExpiresAt"),
      deleteSecureStoreKey("refreshTokenExpiresAt"),
    ]);
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.log(getErrorMessage(error), "error");
    } finally {
      await clearAuthState();
      router.replace("/(auth)");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        user,
        setUserData,
        setAuthTokensAndExpiry,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
