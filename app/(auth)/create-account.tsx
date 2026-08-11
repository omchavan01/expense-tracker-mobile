import { useRouter } from "expo-router";
import { StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import Header from "@/components/common/header";
import FormController from "@/components/common/controllers/form-controller";
import NoInternet from "@/components/common/no-internet";
import useCreateAccount from "@/hooks/auth/use-create-account";
import { useNetInfo } from "@/contexts/net-info-provider";

const CreateAccount = () => {
  const router = useRouter();
  const { isConnected } = useNetInfo();
  const { control, handleSubmit, onSubmit, isSubmitting } = useCreateAccount();

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
          <Header title="Create Account" />
          <FormController
            control={control}
            name="email"
            label="Email"
            placeholder="Enter email address"
            isMandatory={false}
          />
        </KeyboardAwareScrollView>
        <View className="py-10 w-full flex justify-center items-center">
          <Button
            onPress={handleSubmit(onSubmit)}
            variant="solid"
            size="xl"
            className="rounded-full w-[75%] bg-primary-600"
            disabled={isSubmitting || !isConnected}
          >
            {isSubmitting && <ButtonSpinner className="text-white" />}
            <ButtonText size="md">
              {isSubmitting ? "Sending OTP" : "Create Account"}
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
              Already have an account? Login
            </ButtonText>
          </Button>
        </View>
      </View>
      {!isConnected && <NoInternet text="creating your account" />}
    </SafeAreaView>
  );
};

export default CreateAccount;
