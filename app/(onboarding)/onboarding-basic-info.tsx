import React, { useRef } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import BottomSheet from "@gorhom/bottom-sheet";

import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import Header from "@/components/common/header";
import FormController from "@/components/common/controllers/form-controller";
import DropdownController from "@/components/common/controllers/dropdown-controller";
import NoInternet from "@/components/common/no-internet";
import useOnboardingBasicInfo from "@/hooks/onboarding/use-basic-info";
import { useNetInfo } from "@/contexts/net-info-provider";
import DropdownSheet from "@/components/common/sheet/dropdown-sheet";

const OnboardingBasicInfo = () => {
  const currencyBottomSheetRef = useRef<BottomSheet>(null);
  const { isConnected } = useNetInfo();
  const {
    control,
    currencyCodeValue,
    handleCurrencySelect,
    handleCurrentBalanceBlur,
    handleSubmit,
    onSubmit,
    isSubmitting,
    currencyOptions,
    isCurrencyOptionsLoading,
  } = useOnboardingBasicInfo();

  return (
    <>
      <View className="flex-1 bg-white px-4">
        <KeyboardAwareScrollView
          className="mt-10"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <Header title="Basic Information" />
          <View className="flex flex-col gap-4">
            <FormController
              control={control}
              name="firstName"
              label="First Name"
              placeholder="Enter first name"
            />
            <FormController
              control={control}
              name="lastName"
              label="Last Name"
              placeholder="Enter last name"
              isMandatory={false}
            />
            <DropdownController
              control={control}
              name="currencyCode"
              label="Currency"
              placeholder="Select currency"
              bottomSheetRef={currencyBottomSheetRef}
              options={currencyOptions!}
            />
            <FormController
              control={control}
              name="currentBalance"
              label="Current account balance"
              placeholder="Enter your current account balance"
              inputProps={{
                keyboardType: "numeric",
                onBlur: handleCurrentBalanceBlur,
              }}
            />
          </View>
        </KeyboardAwareScrollView>
        <View className="flex w-full items-center justify-center py-10">
          <Button
            onPress={handleSubmit(onSubmit)}
            variant="solid"
            size="xl"
            className="w-[75%] rounded-full bg-primary-600"
            disabled={isSubmitting || !isConnected}
          >
            {isSubmitting && <ButtonSpinner className="text-white" />}
            <ButtonText size="md">
              {isSubmitting ? "Submitting" : "Continue"}
            </ButtonText>
          </Button>
        </View>
      </View>
      <DropdownSheet
        title="Currency"
        bottomSheetRef={currencyBottomSheetRef}
        options={currencyOptions!}
        selectedValue={currencyCodeValue}
        onSelect={handleCurrencySelect}
        isLoading={isCurrencyOptionsLoading}
        searchEnabled={true}
      />
      {!isConnected && <NoInternet text="completing your basic details" />}
    </>
  );
};

export default OnboardingBasicInfo;
