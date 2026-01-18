import { z } from "zod";

import {
  firstNameSchema,
  lastNameSchema,
  dateOfBirthSchema,
  genderSchema,
  jobTitleSchema,
  companyNameSchema,
  countrySchema,
  incomeCycleSchema,
  incomeSchema,
} from "./form-schema";

const onboardingBasicInfoSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  dateOfBirth: dateOfBirthSchema,
  gender: genderSchema,
});

type OnboardingBasicInfoType = z.infer<typeof onboardingBasicInfoSchema>;

const defaultOnboardingBasicInfoValues: OnboardingBasicInfoType = {
  firstName: "",
  lastName: "",
  dateOfBirth: undefined,
  gender: undefined,
};

const onboardingOccupationInfoSchema = z.object({
  jobTitle: jobTitleSchema,
  companyName: companyNameSchema,
  country: countrySchema,
  incomeCycle: incomeCycleSchema,
  income: incomeSchema,
});

type OnboardingOccupationInfoType = z.infer<
  typeof onboardingOccupationInfoSchema
>;

const defaultOnboardingOccupationInfoValues: OnboardingOccupationInfoType = {
  jobTitle: "",
  companyName: "",
  country: "",
  incomeCycle: undefined,
  income: "",
};

export {
  onboardingBasicInfoSchema,
  onboardingOccupationInfoSchema,
  OnboardingBasicInfoType,
  OnboardingOccupationInfoType,
  defaultOnboardingBasicInfoValues,
  defaultOnboardingOccupationInfoValues,
};
