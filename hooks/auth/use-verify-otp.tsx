import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  VerifyOTPType,
  defaultVerifyOTPValues,
  verifyOTPSchema,
} from "@/utils/schemas/auth/auth-schema";
import axiosInstance from "@/utils/lib/axios";
import { useShowToast } from "@/utils/lib/show-toast";

const useVerifyOTP = () => {
  const { email } = useLocalSearchParams<{ email: string }>();
  const router = useRouter();
  const showToast = useShowToast();

  const {
    handleSubmit,
    setValue,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<VerifyOTPType>({
    resolver: zodResolver(verifyOTPSchema),
    defaultValues: {
      ...defaultVerifyOTPValues,
      email,
    },
  });

  const onVerifyOTP = async (payload: VerifyOTPType) => {
    try {
      const { data } = await axiosInstance.post("/auth/verify-otp", payload);
      showToast({
        title: data.message,
        type: "success",
      });
      router.replace({
        pathname: "/set-password",
        params: { email },
      });
    } catch (error: any) {
      setError("otp", {
        message: "",
      });
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      showToast({
        title: errorMessage,
        type: "error",
      });
    }
  };

  const handleResendOTP = async () => {
    try {
      const { data } = await axiosInstance.post("/auth/resend-otp", { email });
      showToast({
        title: data.message,
        type: "success",
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
    }
  };

  return {
    handleSubmit,
    onVerifyOTP,
    isSubmitting,
    setValue,
    errors,
    clearErrors,
    handleResendOTP,
  };
};

export default useVerifyOTP;
