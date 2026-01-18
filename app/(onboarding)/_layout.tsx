import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { NetInfoProvider } from "@/contexts/net-info-provider";

export default function OnboardingLayout() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <SafeAreaView className="flex-1 bg-white">
        <NetInfoProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding-basic-info" />
            <Stack.Screen name="onboarding-occupation-info" />
          </Stack>
        </NetInfoProvider>
      </SafeAreaView>
    </>
  );
}
