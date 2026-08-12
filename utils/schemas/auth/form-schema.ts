import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .refine(val => val.length > 0, {
    message: "Email is required",
  })
  .refine(val => z.email().safeParse(val).success, {
    message: "Invalid email address",
  });

const passwordSchema = z
  .string()
  .trim()
  .refine(val => val.length > 0, {
    message: "Password is required",
  })
  .min(8, {
    message: "Password must be at least 8 characters long",
  })
  .max(16, {
    message: "Password must be at most 16 characters long",
  })
  .refine(val => /[A-Z]/.test(val), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine(val => /[a-z]/.test(val), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine(val => /[0-9]/.test(val), {
    message: "Password must contain at least one number",
  })
  .refine(val => /[^A-Za-z0-9]/.test(val), {
    message: "Password must contain at least one special character",
  });

const confirmPasswordSchema = z
  .string()
  .trim()
  .refine(val => val.length > 0, {
    message: "Confirm password is required",
  });

const otpSchema = z
  .string()
  .trim()
  .refine(val => val.length > 0, {
    message: "OTP is required",
  })
  .length(4, {
    message: "OTP must be 4 digits long",
  });

export { confirmPasswordSchema, emailSchema, otpSchema, passwordSchema };
