import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";

import {
  defaultOnboardingBasicInfoValues,
  onboardingBasicInfoSchema,
  OnboardingBasicInfoType,
} from "@/utils/schemas/onboarding/onboarding-schema";
import axiosInstance from "@/utils/lib/axios";
import { GenderEnum } from "@/utils/enum/gender-enum";
import { useShowToast } from "@/utils/lib/show-toast";
import { useHaptics } from "@/utils/lib/haptics";

const useOnboardingBasicInfo = () => {
  const router = useRouter();
  const showToast = useShowToast();
  const { notificationHaptics } = useHaptics();
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<OnboardingBasicInfoType>({
    resolver: zodResolver(onboardingBasicInfoSchema),
    defaultValues: defaultOnboardingBasicInfoValues,
  });

  const genderValue = watch("gender");

  const handleGenderSelect = useCallback(
    (value: GenderEnum) => {
      setValue("gender", value);
    },
    [setValue]
  );

  const onSubmit = async (payload: OnboardingBasicInfoType) => {
    const formattedPayload = {
      basicInfo: {
        ...payload,
        dateOfBirth: payload?.dateOfBirth?.toISOString().split("T")[0],
      },
    };
    try {
      const { data } = await axiosInstance.post(
        "/onboarding/basic-info",
        formattedPayload
      );
      showToast({
        title: data.message,
        type: "success",
      });
      router.replace({
        pathname: "/(onboarding)",
        params: { onboardingStep: String(data.result.onboardingStep) },
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

  const genderOptions = useMemo(
    () => [
      { label: "Male", value: GenderEnum.MALE },
      { label: "Female", value: GenderEnum.FEMALE },
      { label: "Others", value: GenderEnum.OTHERS },
    ],
    []
  );

  return {
    control,
    handleSubmit,
    onSubmit,
    isSubmitting,
    genderOptions,
    genderValue,
    handleGenderSelect,
  };
};

export default useOnboardingBasicInfo;
