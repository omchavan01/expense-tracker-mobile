import { createContext, useContext, useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

interface NetInfoContextType {
  isConnected: boolean;
}

export const NetInfoContext = createContext<NetInfoContextType | undefined>(
  undefined,
);

export const NetInfoProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected!);
    });
    return () => unsubscribe();
  }, []);

  return (
    <NetInfoContext.Provider value={{ isConnected }}>
      {children}
    </NetInfoContext.Provider>
  );
};

export const useNetInfo = () => {
  const context = useContext(NetInfoContext);
  if (context === undefined) {
    throw new Error("useNetInfo must be used within a NetInfoProvider");
  }
  return context;
};
