import React from "react";
import { useLocalSearchParams } from "expo-router";

import OnboardingBasicInfo from "./onboarding-basic-info";
import OnboardingOccupationInfo from "./onboarding-occupation-info";
import OnboardingCategoryInfo from "./onboarding-category-info";

const OnboardingIndex = () => {
  const { onboardingStep } = useLocalSearchParams();

  switch (onboardingStep) {
    case "0":
      return <OnboardingBasicInfo />;
    case "1":
      return <OnboardingOccupationInfo />;
    case "2":
      return <OnboardingCategoryInfo />;
    default:
      return <OnboardingBasicInfo />;
  }
};

export default OnboardingIndex;
