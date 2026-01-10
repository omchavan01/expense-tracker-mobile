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

const useSetPassword = () => {
  const { email } = useLocalSearchParams<{ email: string }>();
  const router = useRouter();
  const showToast = useShowToast();
  const { setAuthTokensAndExpiry } = useAuth();
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
      setAuthTokensAndExpiry(
        data.result.accessToken,
        data.result.refreshToken,
        data.result.accessTokenExpiresAt,
        data.result.refreshTokenExpiresAt
      );

      router.replace({
        pathname: "/(onboarding)",
        params: {
          onboardingStep: String(data.result.onboardingStep),
        },
      });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      showToast({
        title: errorMessage,
        type: "error",
      });
      notificationHaptics("error");
    }
  };

  return { control, handleSubmit, onSubmit, isSubmitting };
};

export default useSetPassword;
