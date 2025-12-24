import { Control, Path } from "react-hook-form";

export interface FormControllerProps<T extends Record<string, string>> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  isPassword?: boolean;
  isDisabled?: boolean;
  className?: string;
}
