import { z } from "zod";

const firstNameSchema = z.string().trim().min(1, {
  message: "First name is required",
});

const lastNameSchema = z.string().trim().optional();

const currencySchema = z.string().trim().min(1, {
  message: "Currency is required",
});

const currentMoneyInAccountSchema = z.string().trim().min(1, {
  message: "Current account balance is required.",
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
  currencySchema,
  currentMoneyInAccountSchema,
  categoryNameSchema,
};
