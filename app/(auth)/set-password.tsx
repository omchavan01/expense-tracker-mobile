import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import FormController from "@/components/common/controllers/form-controller";
import { Button, ButtonText } from "@/components/ui/button";
import useSetPassword from "@/hooks/auth/use-set-password";
import { useHaptics } from "@/utils/lib/haptics";

const SetPassword = () => {
  const { control, handleSubmit, onSubmit, isSubmitting } = useSetPassword();
  const { impactHaptics } = useHaptics();

  return (
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
          />
          <FormController
            control={control}
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Enter confirm password"
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
          disabled={isSubmitting}
        >
          <ButtonText size="md">Set Password</ButtonText>
        </Button>
      </View>
    </View>
  );
};

export default SetPassword;
