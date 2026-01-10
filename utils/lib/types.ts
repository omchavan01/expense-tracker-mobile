import { Control, Path } from "react-hook-form";

export interface BaseControllerProps<T extends Record<string, any>> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  isMandatory?: boolean;
  isDisabled?: boolean;
  className?: string;
}
export interface FormControllerProps<T extends Record<string, any>>
  extends BaseControllerProps<T> {
  isPassword?: boolean;
}

export interface DropdownControllerProps<T extends Record<string, any>>
  extends BaseControllerProps<T> {
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
}

export interface DropdownOption {
  label: string;
  value: string;
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
