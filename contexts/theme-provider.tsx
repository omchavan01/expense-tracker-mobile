import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemeEnum } from "@/utils/enum/theme-enum";

interface ThemeContextType {
  theme: ThemeEnum;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeEnum>(ThemeEnum.LIGHT);

  const getSavedTheme = async () => {
    const savedTheme = await AsyncStorage.getItem("theme");
    setTheme(savedTheme as ThemeEnum);
  };

  useEffect(() => {
    getSavedTheme();
  }, []);

  const toggleTheme = () => {
    const newTheme =
      theme === ThemeEnum.LIGHT ? ThemeEnum.DARK : ThemeEnum.LIGHT;
    setTheme(newTheme);
    AsyncStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
