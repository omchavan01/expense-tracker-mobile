import { TextInputProps } from "react-native";
import { Control, Path } from "react-hook-form";
import BottomSheet from "@gorhom/bottom-sheet";

export interface BaseControllerProps<T extends Record<string, any>> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  isMandatory?: boolean;
  isDisabled?: boolean;
  className?: string;
  inputProps?: TextInputProps;
}
export interface FormControllerProps<
  T extends Record<string, any>,
> extends BaseControllerProps<T> {
  isPassword?: boolean;
  showIcon?: boolean;
  showLabel?: boolean;
  leftIcon?: React.ElementType;
  rightIcon?: React.ElementType;
  onLeftIconPress?: () => void;
  onRightIconPress?: () => void;
}

export interface DropdownControllerProps<
  T extends Record<string, any>,
> extends BaseControllerProps<T> {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  options: DropdownOption[];
}

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownSheetProps<T> {
  title: string;
  options: DropdownOption[];
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  snapPointsList?: string[];
  selectedValue: T;
  onSelect: (value: T) => void;
  searchEnabled?: boolean;
  isScrollable?: boolean;
}

export interface ToastProps {
  title: string;
  description?: string;
  type?: "success" | "error" | "warning" | "info" | "muted";
  variant?: "solid" | "outline";
}

export interface HapticsProps {
  impactType: "light" | "medium" | "heavy" | "soft" | "rigid";
  notificationType: "success" | "warning" | "error";
}
