import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { TextInput, TouchableOpacity } from "react-native";

import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelAstrick,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { Input, InputIcon, InputSlot } from "@/components/ui/input";
import { cn } from "@/utils/lib/cn";
import { FormControllerProps } from "@/utils/lib/types";

const FormController = <T extends Record<string, any>>({
  control,
  name,
  label,
  placeholder,
  className,
  inputProps,
  isMandatory = true,
  isPassword = false,
  isDisabled = false,
  showIcon = false,
  showLabel = true,
  leftIcon,
  rightIcon,
  onLeftIconPress,
  onRightIconPress,
}: FormControllerProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormControl isInvalid={!!fieldState.error}>
          {/* Show label if showLabel is true */}
          {showLabel && (
            <FormControlLabel>
              <FormControlLabelText>{label}</FormControlLabelText>
              {isMandatory && (
                <FormControlLabelAstrick className="text-red-500">
                  {" *"}
                </FormControlLabelAstrick>
              )}
            </FormControlLabel>
          )}

          {/* Show input */}
          <Input
            isDisabled={isDisabled}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            className={cn(
              `mb-1 mt-2 h-14 rounded-lg ${isFocus && "border border-primary-500"}`,
              className,
            )}
          >
            {/* Show left icon if showIcon is true and leftIcon is provided */}
            {showIcon && leftIcon && (
              <InputSlot>
                <TouchableOpacity onPress={onLeftIconPress}>
                  <InputIcon
                    as={leftIcon as React.ElementType}
                    size="sm"
                    className="left-2 mr-2"
                  />
                </TouchableOpacity>
              </InputSlot>
            )}

            <TextInput
              placeholder={placeholder}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              secureTextEntry={isPassword && !showPassword}
              className="h-full flex-1 pl-3 pr-10 placeholder:text-typography-500"
              {...inputProps}
            />

            {/* Show right icon if showIcon is true and rightIcon is provided */}
            {showIcon && rightIcon && (
              <InputSlot>
                <TouchableOpacity onPress={onRightIconPress}>
                  <InputIcon
                    as={rightIcon as React.ElementType}
                    size="sm"
                    className="right-2 ml-2"
                  />
                </TouchableOpacity>
              </InputSlot>
            )}

            {/* Show password toggle if isPassword is true */}
            {isPassword && (
              <InputSlot>
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-2 ml-2"
                >
                  <InputIcon
                    as={showPassword ? EyeIcon : EyeOffIcon}
                    size="sm"
                  />
                </TouchableOpacity>
              </InputSlot>
            )}
          </Input>

          {/* Show error if fieldState.error is true */}
          {fieldState.error && (
            <FormControlError className="flex-row items-start">
              <FormControlErrorIcon
                as={AlertCircleIcon}
                size="sm"
                style={{ marginTop: 2, marginRight: 3 }}
              />
              <FormControlErrorText className="flex-1 flex-shrink leading-tight">
                {fieldState.error?.message}
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>
      )}
    />
  );
};

export default FormController;
