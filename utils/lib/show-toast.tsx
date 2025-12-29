import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";
import { ToastProps } from "./types";

export const useShowToast = () => {
  const toast = useToast();

  return ({
    title,
    description,
    type = "muted",
    variant = "solid",
  }: ToastProps) => {
    toast.show({
      id: Math.random().toString(),
      placement: "top",
      duration: 2000,
      render: ({ id }) => {
        return (
          <Toast nativeID={`toast-${id}`} action={type} variant={variant}>
            <ToastTitle>{title}</ToastTitle>
            {description && <ToastDescription>{description}</ToastDescription>}
          </Toast>
        );
      },
    });
  };
};
