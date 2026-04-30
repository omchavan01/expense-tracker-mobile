import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useLocalSearchParams } from "expo-router";

import {
  SetPasswordType,
  setPasswordSchema,
  defaultSetPasswordValues,
} from "@/utils/schemas/auth/auth-schema";
import axiosInstance from "@/utils/lib/axios";
import { useShowToast } from "@/utils/lib/show-toast";
import { useAuth } from "@/contexts/auth-provider";
import { useHaptics } from "@/utils/lib/haptics";
import { getErrorMessage } from "@/utils/lib/error-helper";

const useSetPassword = () => {
  const { email, isResetPassword = "false" } = useLocalSearchParams<{
    email: string;
    isResetPassword?: string;
  }>();
  const router = useRouter();
  const showToast = useShowToast();
  const { setAuthTokens } = useAuth();
  const { notificationHaptics } = useHaptics();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SetPasswordType>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { ...defaultSetPasswordValues, email },
  });

  const onSubmit = async (payload: SetPasswordType) => {
    try {
      const { data } = await axiosInstance.post("/auth/set-password", payload);
      showToast({
        title: data.message,
        type: "success",
      });
      notificationHaptics("success");
      await setAuthTokens(data.result.accessToken, data.result.refreshToken);

      router.replace({
        pathname: "/(onboarding)",
        params: {
          onboardingStep: String(data.result.onboardingStep),
        },
      });
    } catch (error: any) {
      showToast({
        title: getErrorMessage(error),
        type: "error",
      });
      notificationHaptics("error");
    }
  };

  const handleResetPassword = async (payload: SetPasswordType) => {
    try {
      const { data } = await axiosInstance.post(
        "/auth/reset-password",
        payload,
      );
      showToast({
        title: data.message,
        type: "success",
      });
      notificationHaptics("success");
      router.replace("/login");
    } catch (error: any) {
      showToast({
        title: getErrorMessage(error),
        type: "error",
      });
      notificationHaptics("error");
    }
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    isSubmitting,
    handleResetPassword,
    isResetPassword: isResetPassword === "true" ? true : false,
  };
};

export default useSetPassword;
