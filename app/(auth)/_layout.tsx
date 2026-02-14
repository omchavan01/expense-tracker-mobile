import { Stack } from "expo-router";

import { NetInfoProvider } from "@/contexts/net-info-provider";

export default function AuthLayout() {
  return (
    <>
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
    </>
  );
}
