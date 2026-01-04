import React, { useState } from "react";
import { Controller } from "react-hook-form";

import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelAstrick,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField, InputIcon } from "../ui/input";
import { EyeIcon, EyeOffIcon, AlertCircleIcon } from "../ui/icon";
import { FormControllerProps } from "@/utils/lib/types";
import { cn } from "@/utils/lib/cn";
import { Pressable } from "react-native";

const FormController = <T extends Record<string, string>>({
  control,
  name,
  label,
  placeholder,
  isMandatory = true,
  isPassword = false,
  isDisabled,
  className,
}: FormControllerProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormControl isInvalid={!!fieldState.error}>
          <FormControlLabel>
            <FormControlLabelText>{label}</FormControlLabelText>
            {isMandatory && (
              <FormControlLabelAstrick className="text-red-500">
                {" *"}
              </FormControlLabelAstrick>
            )}
          </FormControlLabel>
          <Input
            isDisabled={isDisabled}
            className={cn("h-14 rounded-lg", className)}
          >
            <InputField
              placeholder={placeholder}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              secureTextEntry={isPassword && !showPassword}
            />
            {isPassword && (
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-2"
              >
                <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} size="sm" />
              </Pressable>
            )}
          </Input>

          {fieldState.error && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} size="sm" />
              <FormControlErrorText>
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
