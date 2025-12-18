import z from "zod";

export const accountInfoSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  timezone: z.string().min(1, "Please select a timezone"),
});

export const contactInfoSchema = z.object({
  primaryEmail: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().optional(),
  countryCode: z.string().optional(),
});

const emailField = z.string().email("Please enter a valid email address");

const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters");

export const loginSchema = z.object({
  email: emailField,
});

export const registerEmailSchema = z.object({
  email: emailField,
});

export const registerDetailsSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  password: passwordField,
});

export const passwordSchema = z.object({
  password: passwordField,
});

export const securitySchema = z
  .object({
    currentPassword: passwordField,
    newPassword: passwordField,
    confirmNewPassword: passwordField,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });
