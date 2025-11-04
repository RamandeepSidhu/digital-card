'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bankCardSchema, type BankCardFormData } from '@/lib/validation';
import { BankCardStyle } from '@/types/card';
import ImageUpload from './ImageUpload';

interface BankCardFormProps {
  onSubmit: (data: BankCardFormData) => void;
  isLoading?: boolean;
  defaultStyle?: BankCardStyle;
  onFormChange?: (data: BankCardFormData) => void;
}

export default function BankCardForm({ onSubmit, isLoading = false, defaultStyle = 'style1', onFormChange }: BankCardFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<BankCardFormData>({
    resolver: zodResolver(bankCardSchema),
    defaultValues: {
      style: defaultStyle,
    },
  });

  const logoValue = watch('logo');
  const watchedValues = watch();

  // Update live preview when form values change
  useEffect(() => {
    if (onFormChange) {
      const formData: BankCardFormData = {
        ...watchedValues,
        style: defaultStyle,
      };
      onFormChange(formData);
    }
  }, [watchedValues, defaultStyle, onFormChange]);

  const onFormSubmit = async (data: BankCardFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Required Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="accountHolder" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Account Holder Name <span className="text-red-500">*</span>
          </label>
          <input
            id="accountHolder"
            type="text"
            {...register('accountHolder')}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            placeholder="John Doe"
          />
          {errors.accountHolder && (
            <p className="mt-1 text-sm text-red-500">{errors.accountHolder.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="bankName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Bank Name <span className="text-red-500">*</span>
          </label>
          <input
            id="bankName"
            type="text"
            {...register('bankName')}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            placeholder="First National Bank"
          />
          {errors.bankName && (
            <p className="mt-1 text-sm text-red-500">{errors.bankName.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="accountNumber" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Account Number <span className="text-red-500">*</span>
          </label>
          <input
            id="accountNumber"
            type="text"
            {...register('accountNumber')}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono"
            placeholder="1234567890"
          />
          {errors.accountNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.accountNumber.message}</p>
          )}
        </div>
      </div>

      {/* Optional Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="ifscCode" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            IFSC Code (India)
          </label>
          <input
            id="ifscCode"
            type="text"
            {...register('ifscCode')}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 uppercase"
            placeholder="ABCD0123456"
            maxLength={11}
          />
          {errors.ifscCode && (
            <p className="mt-1 text-sm text-red-500">{errors.ifscCode.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="routingNumber" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Routing Number (USA)
          </label>
          <input
            id="routingNumber"
            type="text"
            {...register('routingNumber')}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono"
            placeholder="123456789"
            maxLength={9}
          />
          {errors.routingNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.routingNumber.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="upiId" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            UPI ID (India)
          </label>
          <input
            id="upiId"
            type="text"
            {...register('upiId')}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            placeholder="name@paytm or name@phonepe"
          />
          {errors.upiId && (
            <p className="mt-1 text-sm text-red-500">{errors.upiId.message}</p>
          )}
        </div>
      </div>

      {/* Logo Upload */}
      <div>
        <ImageUpload
          value={logoValue}
          onChange={(value) => setValue('logo', value, { shouldValidate: true })}
          label="Bank Logo (Optional)"
          maxSizeMB={2}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="cursor-pointer px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting || isLoading ? 'Processing...' : 'Continue to Preview'}
        </button>
      </div>
    </form>
  );
}

