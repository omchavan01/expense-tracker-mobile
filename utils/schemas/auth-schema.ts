import { z } from "zod";

import {
  confirmPasswordSchema,
  emailSchema,
  otpSchema,
  passwordSchema,
} from "./form-schema";

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

//Verify OTP Schema
const verifyOTPSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
});

type VerifyOTPType = z.infer<typeof verifyOTPSchema>;

const defaultVerifyOTPValues: VerifyOTPType = {
  email: "",
  otp: "",
};

//Set Password Schema
const setPasswordSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

type SetPasswordType = z.infer<typeof setPasswordSchema>;

const defaultSetPasswordValues: SetPasswordType = {
  email: "",
  password: "",
  confirmPassword: "",
};

export {
  defaultCreateAccountValues,
  defaultVerifyOTPValues,
  defaultSetPasswordValues,
  defaultLoginValues,
  CreateAccountType,
  VerifyOTPType,
  SetPasswordType,
  LoginType,
  createAccountSchema,
  verifyOTPSchema,
  setPasswordSchema,
  loginSchema,
};
