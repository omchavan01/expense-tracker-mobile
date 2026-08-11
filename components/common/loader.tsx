import { ActivityIndicatorProps, ColorValue } from "react-native";

import { Spinner } from "@/components/ui/spinner";

export const Loader = ({
  size = "large",
  color = "white",
  className,
}: {
  size?: ActivityIndicatorProps["size"];
  color?: ColorValue;
  className?: string;
}) => {
  return <Spinner size={size} color={color} className={className} />;
};
