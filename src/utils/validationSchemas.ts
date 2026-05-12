import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const memberSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be at most 100 characters"),
  bookNumber: z
    .string()
    .min(1, "Book number is required")
    .regex(
      /^[a-zA-Z0-9-]+$/,
      "Book number can only contain letters, numbers, and hyphens",
    ),
  className: z
    .string()
    .min(1, "Class name is required")
    .min(2, "Class name must be at least 2 characters"),
});

export type MemberFormData = z.infer<typeof memberSchema>;

export const transactionSchema = z.object({
  memberId: z.string().min(1, "Member is required"),
  transactionType: z.enum(["tabungan", "pengambilan"], {
    errorMap: () => ({ message: "Transaction type is required" }),
  }),
  amount: z
    .number()
    .min(1, "Amount must be greater than 0")
    .max(999999999, "Amount is too large"),
  transactionDate: z.date({ invalid_type_error: "Valid date is required" }),
  notes: z.string().optional().default(""),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

export const cashCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters"),
  amount: z
    .number()
    .min(0, "Amount cannot be negative")
    .max(999999999, "Amount is too large"),
  notes: z.string().optional().default(""),
});

export type CashCategoryFormData = z.infer<typeof cashCategorySchema>;

export const dateRangeSchema = z.object({
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
});

export type DateRangeFormData = z.infer<typeof dateRangeSchema>;
