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

// ==========================================
// Checkout & Order Schemas (Day 4)
// ==========================================

export const checkoutItemSchema = z.object({
  productId: z.string().min(1, { message: 'Product ID is required' }),
  quantity: z.number().int().positive({ message: 'Quantity must be at least 1' }),
  selectedVariants: z.record(z.string(), z.string()).optional(),
});

export type CheckoutItemInput = z.infer<typeof checkoutItemSchema>;

export const checkoutFormSchema = z.object({
  // Contact details
  email: z
    .string()
    .email({ message: 'Please provide a valid email address' })
    .toLowerCase()
    .trim(),

  // Shipping address
  firstName: z.string().min(2, { message: 'First name is required' }).trim(),
  lastName: z.string().min(2, { message: 'Last name is required' }).trim(),
  company: z.string().optional().or(z.literal('')),
  address1: z.string().min(4, { message: 'Street address is required' }).trim(),
  address2: z.string().optional().or(z.literal('')),
  city: z.string().min(2, { message: 'City is required' }).trim(),
  state: z.string().min(2, { message: 'State or Province is required' }).trim(),
  postalCode: z.string().min(3, { message: 'Postal / ZIP code is required' }).trim(),
  country: z.string().min(2, { message: 'Country is required' }),
  phone: z.string().min(7, { message: 'Contact phone number is required' }).trim(),

  // Delivery & Payment
  deliveryOption: z.enum(
    ['STANDARD', 'EXPRESS', 'CARBON_NEUTRAL'],
    { message: 'Please select a valid delivery option' }
  ),
  paymentMethod: z.enum(
    ['STRIPE', 'ESEWA', 'KHALTI', 'MANUAL_BANK_TRANSFER'],
    { message: 'Please select a valid payment method' }
  ),
  
  // Coupon
  couponCode: z.string().optional(),

  // Items payload
  items: z.array(checkoutItemSchema).min(1, { message: 'Cart must contain at least one item' }),

  // Idempotency token to prevent duplicate order charges
  idempotencyKey: z.string().min(8, { message: 'Idempotency key required' }),
});

export type CheckoutFormInput = z.infer<typeof checkoutFormSchema>;

export const couponApplySchema = z.object({
  code: z.string().min(2, { message: 'Coupon code required' }).toUpperCase().trim(),
  subtotal: z.number().positive(),
});

export type CouponApplyInput = z.infer<typeof couponApplySchema>;

export const orderStatusUpdateSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  trackingNumber: z.string().optional().or(z.literal('')),
});

export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateSchema>;
