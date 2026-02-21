import React, { useState } from "react";
import { Keyboard, Platform, Pressable, View } from "react-native";
import { Controller } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";

import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelAstrick,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { AlertCircleIcon, CalendarDaysIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon } from "@/components/ui/input";
import { minDOB, maxDOB } from "@/utils/schemas/onboarding/form-schema";
import { DateControllerProps } from "@/utils/lib/types";
import { cn } from "@/utils/lib/cn";
import { useHaptics } from "@/utils/lib/haptics";

const DateController = <T extends Record<string, any>>({
  control,
  name,
  label,
  placeholder,
  isMandatory = true,
  isDisabled,
  className,
  bottomSheetRef,
  handleDateChange,
}: DateControllerProps<T>) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const { impactHaptics } = useHaptics();

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const formattedDate = field.value?.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
          return (
            <>
              <FormControl isInvalid={!!fieldState.error}>
                <FormControlLabel>
                  <FormControlLabelText>{label}</FormControlLabelText>
                  {isMandatory && (
                    <FormControlLabelAstrick className="text-red-500">
                      {" *"}
                    </FormControlLabelAstrick>
                  )}
                </FormControlLabel>
                <View className="relative">
                  <Input
                    isReadOnly={true}
                    isDisabled={isDisabled}
                    className={cn("h-14 rounded-lg", className)}
                  >
                    <InputField
                      placeholder={placeholder}
                      value={formattedDate}
                      editable={false}
                    />
                    <View
                      className="absolute right-2"
                      style={{ opacity: isPressed ? 0.5 : 1 }}
                    >
                      <InputIcon as={CalendarDaysIcon} size="sm" />
                    </View>
                  </Input>
                  <Pressable
                    onPress={() => {
                      if (Platform.OS === "android") setShowDatePicker(true);
                      else bottomSheetRef.current?.snapToIndex(0);
                    }}
                    onPressIn={() => {
                      Keyboard.dismiss();
                      setIsPressed(true);
                      impactHaptics("light");
                    }}
                    onPressOut={() => setIsPressed(false)}
                    disabled={isDisabled}
                    className="absolute top-0 left-0 right-0 bottom-0"
                  />
                </View>

                {fieldState.error && (
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} size="sm" />
                    <FormControlErrorText>
                      {fieldState.error?.message}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
              {showDatePicker && Platform.OS === "android" && (
                <DateTimePicker
                  mode="date"
                  value={field.value || maxDOB}
                  minimumDate={minDOB}
                  maximumDate={maxDOB}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    handleDateChange(event, selectedDate);
                  }}
                />
              )}
            </>
          );
        }}
      />
    </>
  );
};

export default DateController;
