import BottomSheet from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import DropdownController from "@/components/common/controllers/dropdown-controller";
import FormController from "@/components/common/controllers/form-controller";
import DropdownSheet from "@/components/common/sheet/dropdown-sheet";
import NoInternet from "@/components/common/no-internet";
import useOnboardingOccupationInfo from "@/hooks/onboarding/use-occupation-info";
import { useNetInfo } from "@/contexts/net-info-provider";

const OnboardingOccupationInfo = () => {
  const countryBottomSheetRef = useRef<BottomSheet>(null);
  const incomeCycleBottomSheetRef = useRef<BottomSheet>(null);
  const { isConnected } = useNetInfo();
  const {
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
  } = useOnboardingOccupationInfo();
  return (
    <>
      <View className="flex-1 bg-white px-4">
        <KeyboardAwareScrollView
          className="mt-10"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-2xl font-bold mb-10">
            Occupation Information
          </Text>
          <View className="flex flex-col gap-4">
            <FormController
              control={control}
              name="jobTitle"
              label="Job Title"
              placeholder="Enter job title"
            />
            <FormController
              control={control}
              name="companyName"
              label="Company Name"
              placeholder="Enter company name"
              isMandatory={false}
            />
            <DropdownController
              control={control}
              name="country"
              label="Country"
              placeholder="Select country"
              bottomSheetRef={countryBottomSheetRef}
              options={countryOptions}
            />
            <DropdownController
              control={control}
              name="incomeCycle"
              label="Income Cycle"
              placeholder="Select income cycle"
              bottomSheetRef={incomeCycleBottomSheetRef}
              options={incomeCycleOptions}
            />
            <FormController
              control={control}
              name="income"
              label="Income"
              placeholder="Enter income"
              inputProps={{ keyboardType: "numeric" }}
            />
          </View>
        </KeyboardAwareScrollView>
        <View className="py-10 w-full flex justify-center items-center">
          <Button
            onPress={handleSubmit(onSubmit)}
            variant="solid"
            size="xl"
            className="rounded-full bg-primary-600 w-[75%]"
            disabled={isSubmitting || !isConnected}
          >
            {isSubmitting && <ButtonSpinner className="text-white" />}
            <ButtonText size="md">
              {isSubmitting ? "Submitting..." : "Continue"}
            </ButtonText>
          </Button>
        </View>
      </View>
      <DropdownSheet
        bottomSheetRef={countryBottomSheetRef}
        snapPointsList={["50%", "75%"]}
        options={countryOptions}
        title="Select Country"
        selectedValue={countryValue!}
        onSelect={handleCountrySelect}
        searchEnabled={true}
        isScrollable={true}
      />
      <DropdownSheet
        bottomSheetRef={incomeCycleBottomSheetRef}
        snapPointsList={["75%"]}
        options={incomeCycleOptions}
        title="Select Income Cycle"
        selectedValue={incomeCycleValue!}
        onSelect={handleIncomeCycleSelect}
      />
      {!isConnected && <NoInternet text="completing your occupation details" />}
    </>
  );
};

export default OnboardingOccupationInfo;
