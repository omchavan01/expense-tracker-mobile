import { createContext, useContext, useState } from "react";

import { setTokenGetter } from "@/utils/lib/axios";
import { setSecureStoreKey } from "@/utils/lib/secure-store";

interface AuthContextType {
  user: any;
  setUserData: (userData: any) => void;
  setAuthTokensAndExpiry: (
    accessToken: string,
    refreshToken: string,
    accessTokenExpiresAt: string,
    refreshTokenExpiresAt: string
  ) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  const setUserData = (userData: any) => {
    setUser((prev: any) => ({
      ...prev,
      ...userData,
    }));
  };

  const setAuthTokensAndExpiry = async (
    accessToken: string,
    refreshToken: string,
    accessTokenExpiresAt: string,
    refreshTokenExpiresAt: string
  ) => {
    setTokenGetter(() => ({
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    }));
    await setSecureStoreKey("accessToken", accessToken);
    await setSecureStoreKey("refreshToken", refreshToken);
    await setSecureStoreKey("accessTokenExpiresAt", accessTokenExpiresAt);
    await setSecureStoreKey("refreshTokenExpiresAt", refreshTokenExpiresAt);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUserData,
        setAuthTokensAndExpiry,
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
