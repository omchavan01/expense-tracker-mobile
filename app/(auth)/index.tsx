import { StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";

import AuthAnimation from "@/assets/images/auth-animation.json";
import { Button, ButtonText } from "@/components/ui/button";
import NoInternet from "@/components/common/no-internet";
import { useHaptics } from "@/utils/lib/haptics";
import { useNetInfo } from "@/contexts/net-info-provider";

const AuthIndex = () => {
  const router = useRouter();
  const { impactHaptics } = useHaptics();
  const { isConnected } = useNetInfo();

  return (
    <SafeAreaView className="flex-1 bg-primary-950">
      <StatusBar barStyle="light-content" backgroundColor="#321A5C" />
      <View className="flex-1 items-center justify-center py-28">
        <Text className="text-2xl font-semibold text-white">
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
        <View className="flex w-full flex-col items-center gap-5">
          <Button
            variant="solid"
            size="xl"
            className="w-[75%] rounded-full bg-primary-500"
            onPress={() => {
              router.push("/create-account");
            }}
            disabled={!isConnected}
            onPressIn={() => impactHaptics("light")}
          >
            <ButtonText size="md" className="text-white">
              Create Account
            </ButtonText>
          </Button>
          <Button
            variant="outline"
            size="xl"
            className="w-[75%] rounded-full border-white"
            onPress={() => {
              router.push("/login");
            }}
            disabled={!isConnected}
            onPressIn={() => impactHaptics("light")}
          >
            <ButtonText size="md" className="text-white">
              Login
            </ButtonText>
          </Button>
        </View>
      </View>
      {!isConnected && <NoInternet />}
    </SafeAreaView>
  );
};

export default AuthIndex;
