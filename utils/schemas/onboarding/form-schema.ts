import { z } from "zod";

import { GenderEnum } from "@/utils/enum/gender-enum";
import { IncomeCycleEnum } from "@/utils/enum/income-cycle-enum";
import { countryList } from "@/constants/json/country-list";

const firstNameSchema = z.string().trim().min(1, {
  message: "First name is required",
});

const lastNameSchema = z.string().trim().optional();

const dateOfBirthSchema = z
  .date()
  .optional()
  .refine((val) => val !== undefined, {
    message: "Please select a date",
  })
  .refine(
    (val) => {
      if (!val) return false;
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

const jobTitleSchema = z.string().trim().min(1, {
  message: "Job title is required",
});

const companyNameSchema = z.string().trim().min(1, {
  message: "Company name is required",
});

const countrySchema = z
  .enum(countryList.map((country) => country.value))
  .optional()
  .refine((val) => val !== undefined, {
    message: "Please select a country",
  });

const incomeCycleSchema = z
  .enum([
    IncomeCycleEnum.DAILY,
    IncomeCycleEnum.WEEKLY,
    IncomeCycleEnum.BIWEEKLY,
    IncomeCycleEnum.MONTHLY,
    IncomeCycleEnum.QUARTERLY,
    IncomeCycleEnum.YEARLY,
  ])
  .optional()
  .refine((val) => val !== undefined, {
    message: "Please select an income cycle",
  });

const incomeSchema = z
  .string()
  .trim()
  .min(1, {
    message: "Income amount is required",
  })
  .refine((val) => Number(val) > 0, {
    message: "Income amount must be greater than 0",
  })
  .refine((val) => Number(val) < 1000000000, {
    message: "Income amount must be less than 1 billion",
  });

const categoryNameSchema = z
  .string()
  .trim()
  .min(1, { message: "Category name is required" })
  .min(3, { message: "Category name must be at least 3 characters" })
  .max(20, { message: "Category name must be at most 20 characters" })
  .transform((value) => value.replace(/\s+/g, " "));

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

export {
  today,
  minDOB,
  maxDOB,
  firstNameSchema,
  lastNameSchema,
  dateOfBirthSchema,
  genderSchema,
  jobTitleSchema,
  companyNameSchema,
  countrySchema,
  incomeCycleSchema,
  incomeSchema,
  categoryNameSchema,
};
