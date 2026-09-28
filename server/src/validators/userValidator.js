import { z } from "zod";

const name = z
  .string({ error: "Name is required" })
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be at most 50 characters");

const email = z
  .string({ error: "Email is required" })
  .trim()
  .toLowerCase()
  .email("Invalid email format");

const password = z
  .string({ error: "Password is required" })
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters")
  .regex(/[A-Za-z]/, "Password must contain a letter")
  .regex(/\d/, "Password must contain a number");

export const signupSchema = z.object({ name, email, password });

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z
  .object({ name: name.optional(), email: email.optional() })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });