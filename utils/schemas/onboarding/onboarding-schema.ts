import { z } from "zod";

import {
  firstNameSchema,
  lastNameSchema,
  currencySchema,
  currentMoneyInAccountSchema,
  categoryNameSchema,
} from "./form-schema";

const onboardingBasicInfoSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  currency: currencySchema,
  currentMoneyInAccount: currentMoneyInAccountSchema,
});

type OnboardingBasicInfoType = z.infer<typeof onboardingBasicInfoSchema>;

const defaultOnboardingBasicInfoValues: OnboardingBasicInfoType = {
  firstName: "",
  lastName: "",
  currency: "",
  currentMoneyInAccount: "",
};

const onboardingCategoryInfoSchema = z.object({
  categoryName: categoryNameSchema,
});

type OnboardingCategoryInfoType = z.infer<typeof onboardingCategoryInfoSchema>;

const defaultOnboardingCategoryInfoValues: OnboardingCategoryInfoType = {
  categoryName: "",
};

export {
  onboardingBasicInfoSchema,
  onboardingCategoryInfoSchema,
  OnboardingBasicInfoType,
  OnboardingCategoryInfoType,
  defaultOnboardingBasicInfoValues,
  defaultOnboardingCategoryInfoValues,
};
