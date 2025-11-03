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
      {/* Style Selector */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
          Card Style
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {styleOptions.map((option) => (
            <label
              key={option.value}
              className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedStyle === option.value
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
              }`}
            >
              <input
                type="radio"
                value={option.value}
                {...register('style')}
                className="sr-only"
              />
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                {option.label}
              </span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {option.description}
              </span>
              {selectedStyle === option.value && (
                <div className="absolute top-2 right-2">
                  <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </label>
          ))}
        </div>
      </div>

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

