'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { businessCardSchema, type BusinessCardFormData } from '@/lib/validation';
import { BusinessCardStyle } from '@/types/card';
import ImageUpload from './ImageUpload';

interface BusinessCardFormProps {
  onSubmit: (data: BusinessCardFormData) => void;
  isLoading?: boolean;
}

const styleOptions: { value: BusinessCardStyle; label: string; description: string }[] = [
  { value: 'style1', label: 'Modern Minimalist', description: 'Clean white/black design' },
  { value: 'style2', label: 'Professional Corporate', description: 'Blue accent, structured layout' },
  { value: 'style3', label: 'Creative Gradient', description: 'Colorful gradients, bold typography' },
];

export default function BusinessCardForm({ onSubmit, isLoading = false }: BusinessCardFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<BusinessCardFormData>({
    resolver: zodResolver(businessCardSchema),
    defaultValues: {
      style: 'style1',
    },
  });

  const selectedStyle = watch('style');
  const imageValue = watch('image');

  const onFormSubmit = async (data: BusinessCardFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Required Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            placeholder="Software Engineer"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Company <span className="text-red-500">*</span>
          </label>
          <input
            id="company"
            type="text"
            {...register('company')}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            placeholder="Acme Inc."
          />
          {errors.company && (
            <p className="mt-1 text-sm text-red-500">{errors.company.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            placeholder="john.doe@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            placeholder="+1 234 567 8900"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Optional Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Website
          </label>
          <input
            id="website"
            type="url"
            {...register('website')}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            placeholder="https://www.example.com"
          />
          {errors.website && (
            <p className="mt-1 text-sm text-red-500">{errors.website.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="linkedin" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            LinkedIn
          </label>
          <input
            id="linkedin"
            type="url"
            {...register('linkedin')}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            placeholder="https://linkedin.com/in/johndoe"
          />
          {errors.linkedin && (
            <p className="mt-1 text-sm text-red-500">{errors.linkedin.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Address
          </label>
          <textarea
            id="address"
            {...register('address')}
            rows={3}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 resize-none"
            placeholder="123 Main St, City, State, ZIP"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
          )}
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <ImageUpload
          value={imageValue}
          onChange={(value) => setValue('image', value, { shouldValidate: true })}
          label="Profile Picture (Optional)"
          maxSizeMB={2}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting || isLoading ? 'Creating...' : 'Create Card'}
        </button>
      </div>
    </form>
  );
}

