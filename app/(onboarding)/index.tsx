import React from "react";
import { useLocalSearchParams } from "expo-router";

import OnboardingBasicInfo from "./onboarding-basic-info";
import OnboardingOccupationInfo from "./onboarding-occupation-info";

const OnboardingIndex = () => {
  const { onboardingStep } = useLocalSearchParams();

  switch (onboardingStep) {
    case "0":
      return <OnboardingBasicInfo />;
    case "1":
      return <OnboardingOccupationInfo />;
    default:
      return <OnboardingBasicInfo />;
  }
};

export default OnboardingIndex;
