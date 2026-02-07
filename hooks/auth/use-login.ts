import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";

import {
  loginSchema,
  LoginType,
  defaultLoginValues,
} from "@/utils/schemas/auth/auth-schema";
import axiosInstance from "@/utils/lib/axios";
import { useShowToast } from "@/utils/lib/show-toast";
import { useAuth } from "@/contexts/auth-provider";
import { useHaptics } from "@/utils/lib/haptics";
import { getErrorMessage } from "@/utils/lib/error-helper";

const useLogin = () => {
  const router = useRouter();
  const showToast = useShowToast();
  const { notificationHaptics } = useHaptics();
  const { setAuthTokensAndExpiry } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: defaultLoginValues,
  });

  const onSubmit = async (payload: LoginType) => {
    try {
      const { data } = await axiosInstance.post("/auth/login", payload);
      setAuthTokensAndExpiry(
        data.result.accessToken,
        data.result.refreshToken,
        data.result.accessTokenExpiresAt,
        data.result.refreshTokenExpiresAt,
      );
      showToast({
        title: data.message,
        type: "success",
      });
      notificationHaptics("success");
      if (data.result.isOnboardingCompleted) router.replace("/(logged)");
      else
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

  return { control, handleSubmit, onSubmit, isSubmitting };
};

export default useLogin;
