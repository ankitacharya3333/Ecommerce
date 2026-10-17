import { z } from 'zod';

// ==========================================
// Authentication Schemas
// ==========================================

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name cannot exceed 50 characters' }),
  email: z
    .string()
    .email({ message: 'Please provide a valid email address' })
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please provide a valid email address' })
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, { message: 'Password is required' }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please provide a valid email address' })
    .toLowerCase()
    .trim(),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: 'Reset token is required' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(50, { message: 'Name cannot exceed 50 characters' }),
  currentPassword: z.string().optional(),
  newPassword: z
    .string()
    .min(8, { message: 'New password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Must contain an uppercase letter' })
    .regex(/[0-9]/, { message: 'Must contain a number' })
    .optional()
    .or(z.literal('')),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ==========================================
// Contact & Inquiry Schema
// ==========================================

export const contactInquirySchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Please enter your full name' })
    .max(100, { message: 'Name cannot exceed 100 characters' })
    .trim(),
  email: z
    .string()
    .email({ message: 'Please provide a valid email address' })
    .toLowerCase()
    .trim(),
  subject: z
    .string()
    .min(3, { message: 'Subject must be at least 3 characters' })
    .max(150, { message: 'Subject cannot exceed 150 characters' })
    .trim(),
  category: z.enum(
    [
      'ORDER_INQUIRY',
      'PRODUCT_SPECIFICATION',
      'TRADE_PARTNERSHIP',
      'PRESS_MEDIA',
      'GENERAL_SUPPORT',
    ],
    { message: 'Please select a valid inquiry category' }
  ),
  orderNumber: z
    .string()
    .max(50, { message: 'Order number cannot exceed 50 characters' })
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters long' })
    .max(2000, { message: 'Message cannot exceed 2000 characters' })
    .trim(),
});

export type ContactInquiryInput = z.infer<typeof contactInquirySchema>;

// ==========================================
// Newsletter Subscription Schema
// ==========================================

export const newsletterSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .toLowerCase()
    .trim(),
  consent: z.boolean().refine((val) => val === true, {
    message: 'Subscription consent is required',
  }),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
