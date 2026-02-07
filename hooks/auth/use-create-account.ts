import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";

import {
  CreateAccountType,
  createAccountSchema,
  defaultCreateAccountValues,
} from "@/utils/schemas/auth/auth-schema";
import axiosInstance from "@/utils/lib/axios";
import { useShowToast } from "@/utils/lib/show-toast";
import { useHaptics } from "@/utils/lib/haptics";
import { getErrorMessage } from "@/utils/lib/error-helper";

const useCreateAccount = () => {
  const router = useRouter();
  const showToast = useShowToast();
  const { notificationHaptics } = useHaptics();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateAccountType>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: defaultCreateAccountValues,
  });

  const onSubmit = async (payload: CreateAccountType) => {
    try {
      const { data } = await axiosInstance.post("/auth/send-otp", payload);
      showToast({
        title: data.message,
        type: "success",
      });
      router.push({
        pathname: "/verify-otp",
        params: { email: payload.email },
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

export default useCreateAccount;
