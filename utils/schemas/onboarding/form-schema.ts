import { GenderEnum } from "@/utils/enum/gender-enum";
import { z } from "zod";

const firstNameSchema = z.string().trim().min(1, {
  message: "First name is required",
});

const lastNameSchema = z.string().trim().optional();

const dateOfBirthSchema = z
  .date()
  .optional()
  .refine((val) => val !== undefined, {
    message: "Please select a date of birth",
  })
  .refine(
    (val) => {
      if (!val) return false;

      const today = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
      );

      const minDOB = new Date(
        today.getFullYear() - 120,
        today.getMonth(),
        today.getDate() + 1,
      );

      const maxDOB = new Date(
        today.getFullYear() - 13,
        today.getMonth(),
        today.getDate() - 1,
      );

      return val >= minDOB && val <= maxDOB;
    },
    {
      message: "You must be at least 13 years old",
    },
  );

const genderSchema = z
  .enum([GenderEnum.MALE, GenderEnum.FEMALE, GenderEnum.OTHERS])
  .optional()
  .refine((val) => val !== undefined, {
    message: "Please select a gender",
  });

export { firstNameSchema, lastNameSchema, dateOfBirthSchema, genderSchema };
