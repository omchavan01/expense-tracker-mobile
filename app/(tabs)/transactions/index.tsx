import { Text, View, Pressable } from "react-native";

import { useTheme } from "@/contexts/theme-provider";

const TransactionsIndex = () => {
  const { toggleTheme, theme } = useTheme();
  return (
    <View className="flex-1 bg-background-0 px-4">
      <Text className="text-typography-500">Theme: {theme}</Text>
      <Pressable
        onPress={toggleTheme}
        className="mt-4 w-40 rounded-md bg-secondary-500 p-4"
      >
        <Text>Toggle Theme</Text>
      </Pressable>
    </View>
  );
};

export default TransactionsIndex;
