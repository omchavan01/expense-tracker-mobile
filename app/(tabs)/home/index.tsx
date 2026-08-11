import { Text, View, Pressable } from "react-native";

import { useTheme } from "@/contexts/theme-provider";

const HomeIndex = () => {
  const { toggleTheme, theme } = useTheme();

  return (
    <View className="flex-1 px-4 bg-background-0">
      <Text className="text-typography-500">Theme: {theme}</Text>
      <Pressable
        onPress={toggleTheme}
        className="p-4 bg-secondary-500 w-40 rounded-md mt-4"
      >
        <Text>Toggle Theme</Text>
      </Pressable>
    </View>
  );
};

export default HomeIndex;
