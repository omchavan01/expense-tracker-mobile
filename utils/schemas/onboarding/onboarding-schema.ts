import { z } from "zod";

import {
  firstNameSchema,
  lastNameSchema,
  currencySchema,
  currentBalanceSchema,
  categoryNameSchema,
} from "./form-schema";

const onboardingBasicInfoSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  currencyCode: currencySchema,
  currentBalance: currentBalanceSchema,
});

type OnboardingBasicInfoType = z.infer<typeof onboardingBasicInfoSchema>;

const defaultOnboardingBasicInfoValues: OnboardingBasicInfoType = {
  firstName: "",
  lastName: "",
  currencyCode: "",
  currentBalance: "",
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
