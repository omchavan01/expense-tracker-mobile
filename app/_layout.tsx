import "react-native-reanimated";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { ThemeProvider, useTheme } from "@/contexts/theme-provider";
import "@/global.css";

const AppContent = () => {
  const { theme } = useTheme();
  return (
    <GluestackUIProvider mode={theme}>
      <SafeAreaProvider>
        <Slot />
      </SafeAreaProvider>
    </GluestackUIProvider>
  );
};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
