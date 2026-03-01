import { TextInputProps } from "react-native";
import { Control, Path } from "react-hook-form";
import BottomSheet from "@gorhom/bottom-sheet";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";

export interface BaseControllerProps<T extends Record<string, any>> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
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

export interface DateControllerProps<
  T extends Record<string, any>,
> extends BaseControllerProps<T> {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  handleDateChange: (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined,
  ) => void;
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
  isLoading?: boolean;
}

export interface DatePickerSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  value: Date;
  minDOB: Date;
  maxDOB: Date;
  onChange: (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined,
  ) => void;
}

export interface ToastProps {
  title: string;
  description?: string;
  type?: "success" | "error" | "warning" | "info" | "muted";
  variant?: "solid" | "outline";
  placement?:
    | "top"
    | "bottom"
    | "top left"
    | "top right"
    | "bottom left"
    | "bottom right";
}

export interface HapticsProps {
  impactType: "light" | "medium" | "heavy" | "soft" | "rigid";
  notificationType: "success" | "warning" | "error";
}

export type CategoryType = "expense" | "income";

export interface OnboardingCategoryOption extends DropdownOption {
  isSelected: boolean;
  categoryType: CategoryType;
}
export interface OnboardingCategoryBoxProps {
  categoryOptions: OnboardingCategoryOption[];
  handleSelectCategory: (option: OnboardingCategoryOption) => void;
  handleUnselectCategory: (option: OnboardingCategoryOption) => void;
  handleDeleteCategory: (option: OnboardingCategoryOption) => void;
  handleAddCategory: () => void;
  canUnselectOrDelete: boolean;
  canSelectMore: boolean;
  canCreateCategory: boolean;
}

export const PILL_COLOR_KEYS = [
  "emerald",
  "amber",
  "sky",
  "indigo",
  "mauve",
] as const;

export type PillColorKey = (typeof PILL_COLOR_KEYS)[number];

export interface PillStyleSet {
  pillSelected: string;
  pillUnselected: string;
  textSelected: string;
  textUnselected: string;
  iconSelected: string;
  iconUnselected: string;
}

export interface CategoryPillProps {
  category: OnboardingCategoryOption;
  index: number;
  canUnselectOrDelete: boolean;
  canSelectMore: boolean;
  onSelect: (option: OnboardingCategoryOption) => void;
  onUnselect: (option: OnboardingCategoryOption) => void;
  onDelete: (option: OnboardingCategoryOption) => void;
}

export interface NewCategoryModalProps<T extends Record<string, any>> {
  isOpen: boolean;
  control: Control<T>;
  name: Path<T>;
  handleCloseModal: () => void;
  handleCreateCategory: () => void | Promise<void>;
  handleClearCategoryName: () => void;
}
