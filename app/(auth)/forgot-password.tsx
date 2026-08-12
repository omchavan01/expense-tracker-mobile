import { useRouter } from "expo-router";
import { StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import Header from "@/components/common/header";
import FormController from "@/components/common/controllers/form-controller";
import NoInternet from "@/components/common/no-internet";
import useForgotPassword from "@/hooks/auth/use-forgot-password";
import { useNetInfo } from "@/contexts/net-info-provider";

const ForgotPassword = () => {
  const router = useRouter();
  const { isConnected } = useNetInfo();
  const { control, handleSubmit, onSubmit, isSubmitting } = useForgotPassword();

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
          <Header title="Forgot Password" />
          <FormController
            control={control}
            name="email"
            label="Email"
            placeholder="Enter email address"
            isMandatory={false}
          />
        </KeyboardAwareScrollView>
        <View className="flex w-full items-center justify-center py-10">
          <Button
            onPress={handleSubmit(onSubmit)}
            variant="solid"
            size="xl"
            className="w-[75%] rounded-full bg-primary-600"
            disabled={isSubmitting || !isConnected}
          >
            {isSubmitting && <ButtonSpinner className="text-white" />}
            <ButtonText size="md">
              {isSubmitting ? "Sending OTP" : "Continue"}
            </ButtonText>
          </Button>
          <Button
            onPress={() => {
              router.push("/login");
            }}
            variant="link"
            disabled={!isConnected}
          >
            <ButtonText size="xs" className="text-typography-400">
              Remember your password? Login
            </ButtonText>
          </Button>
        </View>
      </View>
      {!isConnected && <NoInternet text="resetting your password" />}
    </SafeAreaView>
  );
};

export default ForgotPassword;
