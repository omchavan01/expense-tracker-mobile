import { StatusBar, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { Button, ButtonText } from "@/components/ui/button";
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
    <>
      <View className="flex-1 bg-white px-4">
        <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
        <KeyboardAwareScrollView
          className="mt-10"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-2xl font-bold mb-10">Login</Text>
          <View className="flex flex-col gap-4">
            <FormController
              control={control}
              name="email"
              label="Email"
              placeholder="Enter email address"
            />
            <FormController
              control={control}
              name="password"
              label="Password"
              placeholder="Enter password"
              isPassword={true}
            />
          </View>
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
            <ButtonText size="md">Login</ButtonText>
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
    </>
  );
};

export default Login;
