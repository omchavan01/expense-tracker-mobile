import { z } from "zod";

import {
  firstNameSchema,
  lastNameSchema,
  dateOfBirthSchema,
  genderSchema,
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

export {
  defaultOnboardingBasicInfoValues,
  onboardingBasicInfoSchema,
  OnboardingBasicInfoType,
};
