/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import axios from "axios";

import axiosInstance, {
  setTokenGetter,
  setHandleTokens,
  setHandleLogout,
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
  setAuthTokens: (accessToken: string, refreshToken: string) => Promise<void>;
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

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    setHandleTokens(() => refreshTokens());
  }, []);

  useEffect(() => {
    setHandleLogout(() => logout());
  }, []);

  const refreshTokens = async () => {
    const refreshToken = await getSecureStoreKey("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token");
    }
    const baseURL = process.env.EXPO_PUBLIC_API_URL;
    const { data } = await axios.post(`${baseURL}/auth/refresh-token`, {
      refreshToken,
    });
    await setAuthTokens(data.result.accessToken, data.result.refreshToken);
    return {
      accessToken: data.result.accessToken,
      refreshToken: data.result.refreshToken,
    };
  };

  const loadUser = async () => {
    try {
      setLoading(true);
      const [accessToken, refreshToken] = await Promise.all([
        getSecureStoreKey("accessToken"),
        getSecureStoreKey("refreshToken"),
      ]);
      await setAuthTokens(accessToken!, refreshToken!);
      const { data } = await axiosInstance.get("/users/info");
      setUserData(data.result.user, true);
    } catch (error) {
      console.log(getErrorMessage(error), "error");
      await clearAuthState();
    } finally {
      setLoading(false);
    }
  };

  const setAuthTokens = async (accessToken: string, refreshToken: string) => {
    setTokenGetter(() => ({
      accessToken,
      refreshToken,
    }));
    await Promise.all([
      setSecureStoreKey("accessToken", accessToken),
      setSecureStoreKey("refreshToken", refreshToken),
    ]);
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
        setAuthTokens,
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
