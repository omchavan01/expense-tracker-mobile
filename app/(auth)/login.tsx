import { ScrollView, StatusBar, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { Button, ButtonText } from "@/components/ui/button";
import FormController from "@/components/common/form-controller";
import useLogin from "@/hooks/auth/use-login";

const Login = () => {
  const router = useRouter();
  const { control, handleSubmit, onSubmit } = useLogin();

  return (
    <View className="flex-1 bg-white px-4">
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <ScrollView className="mt-10">
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
      </ScrollView>
      <View className="mb-10 w-full flex justify-center items-center">
        <Button
          onPress={handleSubmit(onSubmit)}
          variant="solid"
          size="lg"
          className="rounded-full bg-primary-700 w-[75%]"
        >
          <ButtonText size="md">Login</ButtonText>
        </Button>
        <Button
          onPress={() => {
            router.push("/create-account");
          }}
          variant="link"
        >
          <ButtonText size="xs" className="text-typography-400">
            Don&apos;t have an account? Sign up
          </ButtonText>
        </Button>
      </View>
    </View>
  );
};

export default Login;
