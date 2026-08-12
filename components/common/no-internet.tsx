import React from "react";
import { Linking, Text, View } from "react-native";

import { Button, ButtonText } from "@/components/ui/button";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const NoInternet = ({ text }: { text?: string }) => {
  return (
    <View className="absolute bottom-0 z-50 w-full">
      <View className="mx-4 mb-4 flex-row items-center rounded-xl bg-background-800 px-4 py-3">
        <MaterialCommunityIcons name="wifi-alert" size={20} color="#FF9900" />
        <View className="ml-3 mr-2 flex-1">
          <Text className="text-sm font-medium text-typography-0">
            Internet required
          </Text>
          <Text className="text-xs text-typography-300">
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
