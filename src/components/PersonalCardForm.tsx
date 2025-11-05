'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalCardSchema, type PersonalCardFormData } from '@/lib/validation';
import { PersonalCardStyle } from '@/types/card';
import ImageUpload from './ImageUpload';

interface PersonalCardFormProps {
  onSubmit: (data: PersonalCardFormData) => void;
  isLoading?: boolean;
  defaultStyle?: PersonalCardStyle;
  onFormChange?: (data: PersonalCardFormData) => void;
}

const styleOptions: { value: PersonalCardStyle; label: string; description: string }[] = [
  { value: 'style1', label: 'Simple & Clean', description: 'Minimalist design with focus on content' },
  { value: 'style2', label: 'Modern Social', description: 'Social media focused layout' },
  { value: 'style3', label: 'Elegant Classic', description: 'Timeless design with subtle accents' },
];

export default function PersonalCardForm({ onSubmit, isLoading = false, defaultStyle = 'style1', onFormChange }: PersonalCardFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<PersonalCardFormData>({
    resolver: zodResolver(personalCardSchema),
    defaultValues: {
      style: defaultStyle,
      socialMedia: {},
    },
  });

  const imageValue = watch('image');
  
  // Watch specific fields to avoid infinite loops
  const name = watch('name');
  const email = watch('email');
  const phone = watch('phone');
  const address = watch('address');
  const birthday = watch('birthday');
  const website = watch('website');
  const image = watch('image');
  const socialMedia = watch('socialMedia');

  // Use ref to track previous values and prevent unnecessary updates
  const prevValuesRef = useRef<string>('');
  const isInitialMount = useRef(true);

  // Update live preview when form values change
  useEffect(() => {
    if (onFormChange) {
      const formData: PersonalCardFormData = {
        name: name || '',
        email: email || '',
        phone: phone || '',
        address: address || '',
        birthday: birthday || '',
        website: website || '',
        image: image || '',
        socialMedia: socialMedia || {},
        style: defaultStyle,
      };
      
      // Create a string representation to compare
      const currentValues = JSON.stringify(formData);
      
      // Always call onFormChange on initial mount or if values changed
      if (isInitialMount.current || currentValues !== prevValuesRef.current) {
        isInitialMount.current = false;
        prevValuesRef.current = currentValues;
        onFormChange(formData);
      }
    }
  }, [name, email, phone, address, birthday, website, image, socialMedia, defaultStyle, onFormChange]);

  const onFormSubmit = async (data: PersonalCardFormData) => {
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

        <div>
          <label htmlFor="birthday" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Birthday
          </label>
          <input
            id="birthday"
            type="date"
            {...register('birthday')}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          />
          {errors.birthday && (
            <p className="mt-1 text-sm text-red-500">{errors.birthday.message}</p>
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

      {/* Social Media Section */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
          Social Media Links
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="instagram" className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
              Instagram
            </label>
            <input
              id="instagram"
              type="text"
              {...register('socialMedia.instagram')}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              placeholder="@username"
            />
          </div>

          <div>
            <label htmlFor="twitter" className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
              Twitter/X
            </label>
            <input
              id="twitter"
              type="text"
              {...register('socialMedia.twitter')}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              placeholder="@username"
            />
          </div>

          <div>
            <label htmlFor="facebook" className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
              Facebook
            </label>
            <input
              id="facebook"
              type="text"
              {...register('socialMedia.facebook')}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              placeholder="Username or URL"
            />
          </div>

          <div>
            <label htmlFor="linkedin" className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
              LinkedIn
            </label>
            <input
              id="linkedin"
              type="url"
              {...register('socialMedia.linkedin')}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              placeholder="https://linkedin.com/in/username"
            />
            {errors.socialMedia?.linkedin && (
              <p className="mt-1 text-sm text-red-500">{errors.socialMedia.linkedin.message}</p>
            )}
          </div>
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
          className="cursor-pointer px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting || isLoading ? 'Processing...' : 'Continue to Preview'}
        </button>
      </div>
    </form>
  );
}

