import { Platform, StatusBar, Pressable } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { useNavigationState } from "@react-navigation/native";
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  ChartNoAxesCombined,
  Landmark,
  LayoutDashboard,
  Settings,
} from "lucide-react-native";
import { useTheme } from "@/contexts/theme-provider";
import { ThemeEnum } from "@/utils/enum/theme-enum";

const CustomTabBarButton = ({
  onPress,
  children,
  routeName,
}: BottomTabBarButtonProps & { routeName: string }) => {
  const navigationState = useNavigationState((state) => state);
  const router = useRouter();
  const isFocused =
    navigationState.routes[navigationState.index]?.name === routeName;

  const handlePress = (
    e: Parameters<NonNullable<BottomTabBarButtonProps["onPress"]>>[0],
  ) => {
    if (!isFocused) {
      if (
        e &&
        typeof e === "object" &&
        "preventDefault" in e &&
        typeof e.preventDefault === "function"
      ) {
        e.preventDefault();
      }
      const tabRoutes: Record<string, string> = {
        "home/index": "/(tabs)/home",
        "transactions/index": "/(tabs)/transactions",
        "analytics/index": "/(tabs)/analytics",
        "settings/index": "/(tabs)/settings",
      };
      const targetRoute = tabRoutes[routeName];
      if (targetRoute) {
        router.push(targetRoute as Parameters<typeof router.push>[0]);
      }
    } else if (onPress) {
      onPress(e);
    }
  };

  return (
    <Pressable className="items-center" onPress={handlePress}>
      {children}
    </Pressable>
  );
};

const TabsLayout = () => {
  const { theme } = useTheme();
  return (
    <>
      <StatusBar
        barStyle={theme === ThemeEnum.LIGHT ? "light-content" : "dark-content"}
      />
      <SafeAreaView className="flex-1 bg-background-0">
        <Tabs
          screenOptions={({ route }) => ({
            headerShown: false,
            animation: "shift",
            tabBarHideOnKeyboard: true,
            tabBarStyle: {
              height: 0,
              paddingTop: 12,
              borderTopColor: theme === ThemeEnum.LIGHT ? "#EFEFFE" : "#181719",
              marginBottom: Platform.OS === "ios" ? -10 : 0,
              backgroundColor: "bg-background-500",
            },
            tabBarButton: (props: BottomTabBarButtonProps) => (
              <CustomTabBarButton {...props} routeName={route.name} />
            ),
          })}
        >
          <Tabs.Screen
            name="home/index"
            options={{
              title: "",
              tabBarIcon: ({ focused }) =>
                focused ? (
                  <LayoutDashboard
                    size={18}
                    strokeWidth={2.3}
                    color={theme === ThemeEnum.LIGHT ? "#321A5C" : "#FFF"}
                  />
                ) : (
                  <LayoutDashboard
                    size={18}
                    color={theme === ThemeEnum.LIGHT ? "#000" : "#FFF"}
                  />
                ),
            }}
          />
          <Tabs.Screen
            name="transactions/index"
            options={{
              title: "",
              tabBarIcon: ({ focused }) =>
                focused ? (
                  <Landmark
                    size={18}
                    strokeWidth={2.3}
                    color={theme === ThemeEnum.LIGHT ? "#321A5C" : "#FFF"}
                  />
                ) : (
                  <Landmark
                    size={18}
                    color={theme === ThemeEnum.LIGHT ? "#000" : "#FFF"}
                  />
                ),
            }}
          />
          <Tabs.Screen
            name="analytics/index"
            options={{
              title: "",
              tabBarIcon: ({ focused }) =>
                focused ? (
                  <ChartNoAxesCombined
                    size={18}
                    strokeWidth={2.3}
                    color={theme === ThemeEnum.LIGHT ? "#321A5C" : "#FFF"}
                  />
                ) : (
                  <ChartNoAxesCombined
                    size={18}
                    color={theme === ThemeEnum.LIGHT ? "#000" : "#FFF"}
                  />
                ),
            }}
          />
          <Tabs.Screen
            name="settings/index"
            options={{
              title: "",
              tabBarIcon: ({ focused }) =>
                focused ? (
                  <Settings
                    size={18}
                    strokeWidth={2.3}
                    color={theme === ThemeEnum.LIGHT ? "#321A5C" : "#FFF"}
                  />
                ) : (
                  <Settings
                    size={18}
                    color={theme === ThemeEnum.LIGHT ? "#000" : "#FFF"}
                  />
                ),
            }}
          />
        </Tabs>
      </SafeAreaView>
    </>
  );
};

export default TabsLayout;
