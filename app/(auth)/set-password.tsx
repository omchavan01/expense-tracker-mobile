import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import FormController from "@/components/common/controllers/form-controller";
import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import NoInternet from "@/components/common/no-internet";
import useSetPassword from "@/hooks/auth/use-set-password";
import { useHaptics } from "@/utils/lib/haptics";
import { useNetInfo } from "@/contexts/net-info-provider";

const SetPassword = () => {
  const { isConnected } = useNetInfo();
  const { impactHaptics } = useHaptics();
  const { control, handleSubmit, onSubmit, isSubmitting } = useSetPassword();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-white px-4">
        <KeyboardAwareScrollView
          className="mt-10"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-2xl font-bold mb-10">Set Your Password</Text>
          <View className="flex flex-col gap-4">
            <FormController
              control={control}
              name="password"
              label="Password"
              placeholder="Enter password"
              isPassword={true}
              isMandatory={false}
            />
            <FormController
              control={control}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Enter confirm password"
              isPassword={true}
              isMandatory={false}
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
            {isSubmitting && <ButtonSpinner className="text-white" />}
            <ButtonText size="md">
              {isSubmitting ? "Setting password" : "Set Password"}
            </ButtonText>
          </Button>
        </View>
      </View>
      {!isConnected && <NoInternet text="setting your password" />}
    </SafeAreaView>
  );
};

export default SetPassword;
