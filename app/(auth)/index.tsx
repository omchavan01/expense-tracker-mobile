import { StatusBar, Text, View } from "react-native";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";

import AuthAnimation from "@/assets/images/auth-animation.json";
import { Button, ButtonText } from "@/components/ui/button";
import { useHaptics } from "@/utils/lib/haptics";

const AuthIndex = () => {
  const router = useRouter();
  const { impactHaptics } = useHaptics();

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#321A5C" />
      <View className="bg-primary-950 flex-1 items-center justify-center">
        <Text className="text-white text-2xl absolute top-24 font-semibold">
          Take Control of Your Finances
        </Text>
        <LottieView
          source={AuthAnimation}
          autoPlay
          loop
          style={{
            width: "100%",
            height: "100%",
          }}
        />
        <View className="absolute bottom-12 w-full flex flex-col gap-5 items-center">
          <Button
            variant="solid"
            size="xl"
            className="rounded-full w-[75%] bg-primary-500"
            onPress={() => {
              router.push("/create-account");
            }}
            onPressIn={() => impactHaptics("light")}
          >
            <ButtonText size="md" className="text-white">
              Create Account
            </ButtonText>
          </Button>
          <Button
            variant="outline"
            size="xl"
            className="rounded-full w-[75%] border-white"
            onPress={() => {
              router.push("/login");
            }}
            onPressIn={() => impactHaptics("light")}
          >
            <ButtonText size="md" className="text-white">
              Login
            </ButtonText>
          </Button>
          <Button
            onPress={() => {
              router.push({
                pathname: "/(onboarding)",
                params: {
                  onboardingStep: "0",
                },
              });
            }}
          >
            <ButtonText size="md" className="text-white">
              Skip
            </ButtonText>
          </Button>
        </View>
      </View>
    </>
  );
};

export default AuthIndex;
