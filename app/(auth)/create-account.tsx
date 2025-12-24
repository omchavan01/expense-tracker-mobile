import { StatusBar, View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import FormController from "@/components/common/form-controller";
import { Button, ButtonText } from "@/components/ui/button";
import useCreateAccount from "@/hooks/auth/use-create-account";

const CreateAccount = () => {
  const router = useRouter();
  const { control, handleSubmit, onSubmit } = useCreateAccount();

  return (
    <View className="flex-1 bg-white px-4">
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <ScrollView className="mt-10">
        <Text className="text-2xl font-bold mb-10">Create Account</Text>
        <FormController
          control={control}
          name="email"
          label="Email"
          placeholder="Enter email address"
        />
      </ScrollView>
      <View className="mb-10 w-full flex justify-center items-center">
        <Button
          onPress={handleSubmit(onSubmit)}
          variant="solid"
          size="lg"
          className="rounded-full bg-primary-700 w-[75%]"
        >
          <ButtonText size="md">Create Account</ButtonText>
        </Button>
        <Button
          onPress={() => {
            router.push("/login");
          }}
          variant="link"
        >
          <ButtonText size="xs" className="text-typography-400">
            Already have an account? Login
          </ButtonText>
        </Button>
      </View>
    </View>
  );
};

export default CreateAccount;
