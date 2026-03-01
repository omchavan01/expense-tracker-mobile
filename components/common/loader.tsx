import { ActivityIndicatorProps, ColorValue } from "react-native";

import { Spinner } from "@/components/ui/spinner";

export const Loader = ({
  size = "large",
  color = "white",
}: {
  size?: ActivityIndicatorProps["size"];
  color?: ColorValue;
}) => {
  return <Spinner size={size} color={color} />;
};
