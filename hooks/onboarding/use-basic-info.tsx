import { useCallback, useMemo } from "react";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import axiosInstance from "@/utils/lib/axios";
import {
  defaultOnboardingBasicInfoValues,
  onboardingBasicInfoSchema,
  OnboardingBasicInfoType,
} from "@/utils/schemas/onboarding/onboarding-schema";
import { GenderEnum } from "@/utils/enum/gender-enum";
import { useHaptics } from "@/utils/lib/haptics";
import { useShowToast } from "@/utils/lib/show-toast";
import { getErrorMessage } from "@/utils/lib/error-helper";

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
    [setValue],
  );

  const formatDateToYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const onSubmit = async (payload: OnboardingBasicInfoType) => {
    const formattedPayload = {
      basicInfo: {
        ...payload,
        dateOfBirth: payload?.dateOfBirth
          ? formatDateToYYYYMMDD(payload.dateOfBirth)
          : undefined,
      },
    };
    try {
      const { data } = await axiosInstance.post(
        "/onboarding/basic-info",
        formattedPayload,
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
      showToast({
        title: getErrorMessage(error),
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
    [],
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
