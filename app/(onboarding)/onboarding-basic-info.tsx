import BottomSheet from "@gorhom/bottom-sheet";
import React, { useCallback, useRef } from "react";
import { Platform, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";

import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import DateController from "@/components/common/controllers/date-controller";
import DropdownController from "@/components/common/controllers/dropdown-controller";
import FormController from "@/components/common/controllers/form-controller";
import DropdownSheet from "@/components/common/sheet/dropdown-sheet";
import DatePickerSheet from "@/components/common/sheet/date-picker-sheet";
import NoInternet from "@/components/common/no-internet";
import useOnboardingBasicInfo from "@/hooks/onboarding/use-basic-info";
import { useNetInfo } from "@/contexts/net-info-provider";
import { minDOB, maxDOB } from "@/utils/schemas/onboarding/form-schema";

const OnboardingBasicInfo = () => {
  const bottomSheetRef = useRef<BottomSheet | null>(null);
  const dateBottomSheetRef = useRef<BottomSheet | null>(null);
  const { isConnected } = useNetInfo();
  const {
    control,
    setValue,
    handleSubmit,
    onSubmit,
    isSubmitting,
    dateOfBirthValue,
    genderOptions,
    genderValue,
    handleGenderSelect,
  } = useOnboardingBasicInfo();

  const handleDateChange = useCallback(
    (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
      if (event.type === "dismissed") return;
      if (selectedDate) {
        setValue("dateOfBirth", selectedDate);
      }
    },
    [setValue],
  );

  return (
    <>
      <View className="flex-1 bg-white px-4">
        <KeyboardAwareScrollView
          className="mt-10"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-2xl font-bold mb-10">Basic Information</Text>
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
            <DateController
              control={control}
              name="dateOfBirth"
              label="Date of Birth"
              placeholder="Select date of birth"
              bottomSheetRef={dateBottomSheetRef}
              handleDateChange={handleDateChange}
            />
            <DropdownController
              control={control}
              name="gender"
              label="Gender"
              placeholder="Select gender"
              bottomSheetRef={bottomSheetRef}
              options={genderOptions}
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
              {isSubmitting ? "Submitting" : "Continue"}
            </ButtonText>
          </Button>
        </View>
      </View>
      <DropdownSheet
        bottomSheetRef={bottomSheetRef}
        snapPointsList={["50%"]}
        options={genderOptions}
        title="Select Gender"
        selectedValue={genderValue!}
        onSelect={handleGenderSelect}
      />
      {Platform.OS === "ios" && (
        <DatePickerSheet
          bottomSheetRef={dateBottomSheetRef}
          value={dateOfBirthValue ?? maxDOB}
          minDOB={minDOB}
          maxDOB={maxDOB}
          onChange={handleDateChange}
        />
      )}
      {!isConnected && <NoInternet text="completing your basic details" />}
    </>
  );
};

export default OnboardingBasicInfo;
