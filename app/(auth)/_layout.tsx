import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { NetInfoProvider } from "@/contexts/net-info-provider";

export default function AuthLayout() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <NetInfoProvider>
        <Stack
          screenOptions={{ headerShown: false, animation: "slide_from_right" }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="create-account" />
          <Stack.Screen name="verify-otp" />
          <Stack.Screen name="set-password" />
          <Stack.Screen name="login" />
        </Stack>
      </NetInfoProvider>
    </SafeAreaView>
  );
}
