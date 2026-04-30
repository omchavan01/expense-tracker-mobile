import { StatusBar, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import Header from "@/components/common/header";
import FormController from "@/components/common/controllers/form-controller";
import NoInternet from "@/components/common/no-internet";
import useLogin from "@/hooks/auth/use-login";
import { useHaptics } from "@/utils/lib/haptics";
import { useNetInfo } from "@/contexts/net-info-provider";

const Login = () => {
  const router = useRouter();
  const { isConnected } = useNetInfo();
  const { impactHaptics } = useHaptics();
  const { control, handleSubmit, onSubmit, isSubmitting } = useLogin();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-white px-4">
        <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
        <KeyboardAwareScrollView
          className="mt-10"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <Header title="Login" />
          <View className="flex flex-col gap-4">
            <FormController
              control={control}
              name="email"
              label="Email"
              placeholder="Enter email address"
              isMandatory={false}
              inputProps={{
                keyboardType: "email-address",
              }}
            />
            <FormController
              control={control}
              name="password"
              label="Password"
              placeholder="Enter password"
              isPassword={true}
              isMandatory={false}
            />
          </View>
          <Button
            onPress={() => {
              router.push("/forgot-password");
            }}
            variant="link"
            disabled={!isConnected}
            className="flex justify-end -mt-2"
          >
            <ButtonText size="xs" className="text-typography-300">
              Forgot your password?
            </ButtonText>
          </Button>
        </KeyboardAwareScrollView>
        <View className="py-10 w-full flex justify-center items-center">
          <Button
            onPress={handleSubmit(onSubmit)}
            onPressIn={() => impactHaptics("light")}
            variant="solid"
            size="xl"
            className="rounded-full bg-primary-600 w-[75%]"
            disabled={isSubmitting || !isConnected}
          >
            {isSubmitting && <ButtonSpinner className="text-white" />}
            <ButtonText size="md">
              {isSubmitting ? "Logging in" : "Login"}
            </ButtonText>
          </Button>
          <Button
            onPress={() => {
              router.push("/create-account");
            }}
            variant="link"
            disabled={!isConnected}
          >
            <ButtonText size="xs" className="text-typography-400">
              Don&apos;t have an account? Sign up
            </ButtonText>
          </Button>
        </View>
      </View>
      {!isConnected && <NoInternet text="logging in" />}
    </SafeAreaView>
  );
};

export default Login;
