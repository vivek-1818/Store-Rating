import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(20).max(60),
  email: z.string().email(),
  address: z.string().max(400),
  password: z.string().min(8).max(16).regex(/[A-Z]/).regex(/[^A-Za-z0-9]/),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8).max(16).regex(/[A-Z]/).regex(/[^A-Za-z0-9]/),
  address: z.string(),
  role: z.enum(["ADMIN", "USER", "STORE_OWNER"]),
});

export const createStoreSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  address: z.string(),
  ownerId: z.number(),
});

export const ratingSchema = z.object({
  storeId: z.number(),
  value: z.number().min(1).max(5),
});

export const passwordUpdateSchema = z.object({
  oldPassword: z.string().min(8).max(16).regex(/[A-Z]/).regex(/[^A-Za-z0-9]/),
  newPassword: z.string().min(8).max(16).regex(/[A-Z]/).regex(/[^A-Za-z0-9]/),
});

export const userListQuerySchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  role: z.string().optional(),
});

export const storeListQuerySchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
});

// Error Handler
export const validationError = (error: any) => {
  return {
    message:"Validation failed",
  };
};