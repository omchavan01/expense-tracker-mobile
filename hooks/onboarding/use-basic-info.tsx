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

  const currencyValue = watch("currency");

  const handleCurrencySelect = useCallback(
    (value: string) => {
      setValue("currency", value);
    },
    [setValue],
  );

  const currencyDetails = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(
        "https://restcountries.com/v3.1/all?fields=currencies",
      );
      const currencyMap = new Map();

      data.forEach((item: any) => {
        if (!item.currencies) return;

        Object.entries(item.currencies).forEach(
          ([code, details]: [string, any]) => {
            if (!currencyMap.has(code)) {
              const capitalizedName = details.name
                .split(" ")
                .map(
                  (word: string) =>
                    word.charAt(0).toUpperCase() + word.slice(1),
                )
                .join(" ");
              currencyMap.set(code, {
                label: `${code} - ${capitalizedName}`,
                value: code,
              });
            }
          },
        );
      });

      const sortedCurrencies = Array.from(currencyMap.values()).sort((a, b) => {
        return a.label.localeCompare(b.label);
      });
      return sortedCurrencies;
    } catch (error) {
      console.error(error);
      return [];
    }
  }, []);

  const { data: currencyOptions, isLoading: isCurrencyOptionsLoading } =
    useQuery({
      queryKey: ["currencyOptions"],
      queryFn: currencyDetails,
    });

  const onSubmit = async (payload: OnboardingBasicInfoType) => {
    const formattedPayload = {
      basicInfo: payload,
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

  return {
    control,
    currencyValue,
    handleCurrencySelect,
    handleSubmit,
    onSubmit,
    isSubmitting,
    currencyOptions,
    isCurrencyOptionsLoading,
  };
};

export default useOnboardingBasicInfo;
