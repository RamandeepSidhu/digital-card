import { z } from 'zod';
import { BusinessCardStyle, BankCardStyle, PersonalCardStyle } from '@/types/card';

export const businessCardSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  title: z.string().min(2, 'Title must be at least 2 characters').max(100, 'Title is too long'),
  company: z.string().min(2, 'Company name must be at least 2 characters').max(100, 'Company name is too long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(20, 'Phone number is too long'),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  address: z.string().max(200, 'Address is too long').optional(),
  style: z.enum(['style1', 'style2', 'style3'] as const),
});

export const bankCardSchema = z.object({
  accountHolder: z.string().min(2, 'Account holder name must be at least 2 characters').max(100, 'Name is too long'),
  bankName: z.string().min(2, 'Bank name must be at least 2 characters').max(100, 'Bank name is too long'),
  accountNumber: z.string().min(8, 'Account number must be at least 8 digits').max(30, 'Account number is too long'),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Please enter a valid IFSC code').optional().or(z.literal('')),
  routingNumber: z.string().regex(/^\d{9}$/, 'Routing number must be 9 digits').optional().or(z.literal('')),
  upiId: z.string().regex(/^[\w.-]+@[\w]+$/, 'Please enter a valid UPI ID (e.g., name@paytm)').optional().or(z.literal('')),
  style: z.enum(['style1', 'style2', 'style3'] as const),
});

export const personalCardSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(20, 'Phone number is too long'),
  address: z.string().max(200, 'Address is too long').optional(),
  birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date (YYYY-MM-DD)').optional().or(z.literal('')),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  socialMedia: z.object({
    instagram: z.string().optional().or(z.literal('')),
    twitter: z.string().optional().or(z.literal('')),
    facebook: z.string().optional().or(z.literal('')),
    linkedin: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  }).optional(),
  style: z.enum(['style1', 'style2', 'style3'] as const),
});

export type BusinessCardFormData = z.infer<typeof businessCardSchema>;
export type BankCardFormData = z.infer<typeof bankCardSchema>;
export type PersonalCardFormData = z.infer<typeof personalCardSchema>;

