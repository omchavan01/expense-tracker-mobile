import { useCallback, useMemo } from "react";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import axiosInstance from "@/utils/lib/axios";
import {
  defaultOnboardingOccupationInfoValues,
  onboardingOccupationInfoSchema,
  OnboardingOccupationInfoType,
} from "@/utils/schemas/onboarding/onboarding-schema";
import { IncomeCycleEnum } from "@/utils/enum/income-cycle-enum";
import { countryList } from "@/assets/json/country-list";
import { useHaptics } from "@/utils/lib/haptics";
import { useShowToast } from "@/utils/lib/show-toast";

const useOnboardingOccupationInfo = () => {
  const router = useRouter();
  const showToast = useShowToast();
  const { notificationHaptics } = useHaptics();
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<OnboardingOccupationInfoType>({
    resolver: zodResolver(onboardingOccupationInfoSchema),
    defaultValues: defaultOnboardingOccupationInfoValues,
  });

  const incomeCycleValue = watch("incomeCycle");
  const countryValue = watch("country");

  const handleIncomeCycleSelect = useCallback(
    (value: IncomeCycleEnum) => {
      setValue("incomeCycle", value);
    },
    [setValue]
  );

  const handleCountrySelect = useCallback(
    (value: string) => {
      setValue("country", value);
    },
    [setValue]
  );

  const onSubmit = async (payload: OnboardingOccupationInfoType) => {
    const formattedPayload = {
      occupationInfo: {
        ...payload,
      },
    };
    try {
      const { data } = await axiosInstance.post(
        "/onboarding/occupation-info",
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

  const incomeCycleOptions = useMemo(
    () => [
      { label: "Daily", value: IncomeCycleEnum.DAILY },
      { label: "Weekly", value: IncomeCycleEnum.WEEKLY },
      { label: "Biweekly", value: IncomeCycleEnum.BIWEEKLY },
      { label: "Monthly", value: IncomeCycleEnum.MONTHLY },
      { label: "Quarterly", value: IncomeCycleEnum.QUARTERLY },
      { label: "Yearly", value: IncomeCycleEnum.YEARLY },
    ],
    []
  );

  const countryOptions = useMemo(() => countryList, []);

  return {
    control,
    handleSubmit,
    onSubmit,
    isSubmitting,
    incomeCycleOptions,
    incomeCycleValue,
    handleIncomeCycleSelect,
    countryOptions,
    countryValue,
    handleCountrySelect,
  };
};

export default useOnboardingOccupationInfo;
