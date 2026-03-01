import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import axiosInstance from "@/utils/lib/axios";
import {
  defaultOnboardingBasicInfoValues,
  onboardingBasicInfoSchema,
  OnboardingBasicInfoType,
} from "@/utils/schemas/onboarding/onboarding-schema";
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

  const currencyCodeValue = watch("currencyCode");
  const currentBalanceValue = watch("currentBalance");

  const handleCurrentBalanceBlur = useCallback(() => {
    const formatted = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(currentBalanceValue.replace(/,/g, "")));
    setValue("currentBalance", formatted);
  }, [currentBalanceValue, setValue]);

  const handleCurrencySelect = useCallback(
    (value: string) => {
      setValue("currencyCode", value);
    },
    [setValue],
  );

  const getCurrencyDetails = async () => {
    try {
      const { data } = await axiosInstance.get("/metadata/currencies");
      return data.result.map((item: any) => ({
        label: item.name,
        value: item.code,
      }));
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const { data: currencyOptions, isLoading: isCurrencyOptionsLoading } =
    useQuery({
      queryKey: ["currencyOptions"],
      queryFn: getCurrencyDetails,
    });

  const onSubmit = async (payload: OnboardingBasicInfoType) => {
    const formattedPayload = {
      basicInfo: payload,
    };
    console.log(JSON.stringify(formattedPayload, null, 2), "formattedPayload");
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
      console.log(getErrorMessage(error), "error");
      showToast({
        title: getErrorMessage(error),
        type: "error",
      });
      notificationHaptics("error");
    }
  };

  return {
    control,
    currencyCodeValue,
    handleCurrencySelect,
    handleCurrentBalanceBlur,
    handleSubmit,
    onSubmit,
    isSubmitting,
    currencyOptions,
    isCurrencyOptionsLoading,
  };
};

export default useOnboardingBasicInfo;
