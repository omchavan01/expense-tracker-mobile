import * as Haptics from "expo-haptics";

import { HapticsProps } from "./types";

const impactMap: Record<
  HapticsProps["impactType"],
  Haptics.ImpactFeedbackStyle
> = {
  light: Haptics.ImpactFeedbackStyle.Light,
  medium: Haptics.ImpactFeedbackStyle.Medium,
  heavy: Haptics.ImpactFeedbackStyle.Heavy,
  soft: Haptics.ImpactFeedbackStyle.Soft,
  rigid: Haptics.ImpactFeedbackStyle.Rigid,
};

const notificationMap: Record<
  HapticsProps["notificationType"],
  Haptics.NotificationFeedbackType
> = {
  success: Haptics.NotificationFeedbackType.Success,
  warning: Haptics.NotificationFeedbackType.Warning,
  error: Haptics.NotificationFeedbackType.Error,
};

export const useHaptics = () => {
  const impactHaptics = (type: HapticsProps["impactType"]) => {
    return Haptics.impactAsync(impactMap[type]);
  };

  const notificationHaptics = (type: HapticsProps["notificationType"]) => {
    return Haptics.notificationAsync(notificationMap[type]);
  };

  return {
    impactHaptics,
    notificationHaptics,
  };
};
