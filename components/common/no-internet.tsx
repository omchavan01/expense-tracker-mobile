import React from "react";
import { Linking, Text, View } from "react-native";

import { Button, ButtonText } from "@/components/ui/button";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const NoInternet = ({ text }: { text?: string }) => {
  return (
    <View className="absolute bottom-0 w-full z-50">
      <View className="mx-4 mb-4 rounded-xl bg-background-800 px-4 py-3 flex-row items-center">
        <MaterialCommunityIcons name="wifi-alert" size={20} color="#FF9900" />
        <View className="flex-1 ml-3 mr-2">
          <Text className="text-typography-0 text-sm font-medium">
            Internet required
          </Text>
          <Text className="text-typography-300 text-xs">
            {text ? `Connect to continue ${text}` : "Connect to continue"}
          </Text>
        </View>
        <Button
          size="sm"
          variant="outline"
          className="border-outline-300"
          onPress={() => Linking.openSettings()}
        >
          <ButtonText className="text-typography-100">Settings</ButtonText>
        </Button>
      </View>
    </View>
  );
};

export default NoInternet;
