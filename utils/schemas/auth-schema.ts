import { z } from "zod";

import { emailSchema, passwordSchema } from "./form-schema";

//Create Account Schema
const createAccountSchema = z.object({
  email: emailSchema,
});

type CreateAccountType = z.infer<typeof createAccountSchema>;

const defaultCreateAccountValues: CreateAccountType = {
  email: "",
};

//Login Schema
const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

type LoginType = z.infer<typeof loginSchema>;

const defaultLoginValues: LoginType = {
  email: "",
  password: "",
};

export {
  createAccountSchema,
  CreateAccountType,
  defaultCreateAccountValues,
  loginSchema,
  LoginType,
  defaultLoginValues,
};
