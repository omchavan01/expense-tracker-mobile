import "react-native-reanimated";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { ThemeProvider, useTheme } from "@/contexts/theme-provider";
import { AuthProvider } from "@/contexts/auth-provider";
import "@/global.css";

const queryClient = new QueryClient();

const AppContent = () => {
  const { theme } = useTheme();
  return (
    <GluestackUIProvider mode={theme!}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <Slot />
        </KeyboardProvider>
      </SafeAreaProvider>
    </GluestackUIProvider>
  );
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
