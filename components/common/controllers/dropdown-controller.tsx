import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Keyboard, Pressable, View } from "react-native";

import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelAstrick,
  FormControlLabelText,
} from "@/components/ui/form-control";
import {
  AlertCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@/components/ui/icon";
import { Input, InputField, InputIcon } from "@/components/ui/input";
import { cn } from "@/utils/lib/cn";
import { useHaptics } from "@/utils/lib/haptics";
import { DropdownControllerProps } from "@/utils/lib/types";

const DropdownController = <T extends Record<string, any>>({
  control,
  name,
  label,
  placeholder,
  isMandatory = true,
  isDisabled,
  className,
  bottomSheetRef,
  options,
}: DropdownControllerProps<T>) => {
  const [isPressed, setIsPressed] = useState(false);
  const { impactHaptics } = useHaptics();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedOption = options?.find(
          (option) => option.value === field.value,
        );
        return (
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
                isReadOnly
                isDisabled={isDisabled}
                className={cn("h-14 rounded-lg", className)}
              >
                <InputField
                  placeholder={placeholder}
                  value={selectedOption?.label}
                  editable={false}
                />
                <View
                  className="absolute right-2"
                  style={{ opacity: isPressed ? 0.5 : 1 }}
                >
                  <InputIcon
                    as={isPressed ? ChevronUpIcon : ChevronDownIcon}
                    size="sm"
                  />
                </View>
              </Input>

              <Pressable
                onPress={() => {
                  Keyboard.dismiss();
                  impactHaptics("light");
                  bottomSheetRef.current?.expand();
                }}
                onPressIn={() => {
                  setIsPressed(true);
                }}
                onPressOut={() => {
                  setIsPressed(false);
                }}
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
        );
      }}
    />
  );
};

export default DropdownController;
