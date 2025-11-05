'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CardPreview from '@/components/CardPreview';
import { BusinessCard } from '@/types/card';
import { nanoid } from 'nanoid';

type Step = 'welcome' | 'name' | 'title-company' | 'photo' | 'contact' | 'creating';

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [photo, setPhoto] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
      setName(session.user.name || '');
    }
  }, [session]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateCard = async () => {
    if (!name || !email || !phone) return;

    setIsCreating(true);
    setCurrentStep('creating');

    try {
      const businessCard: BusinessCard | any = {
        id: nanoid(),
        type: 'business',
        style: 'style1',
        data: {
          name,
          title: title || 'Professional',
          company: company || 'Your Company',
          email,
          phone,
          image: photo || undefined,
          date: new Date().toISOString(),
        },
        createdAt: new Date(),
      };

      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(businessCard),
      });

      if (response.ok) {
        // Wait a moment to show the creating animation
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setIsCreating(false);
        setCurrentStep('contact');
      }
    } catch (error) {
      console.error('Error creating card:', error);
      setIsCreating(false);
      setCurrentStep('contact');
    }
  };

  const previewCard: BusinessCard | any = name && email ? {
    id: 'preview',
    type: 'business',
    style: 'style1',
    data: {
      name,
      title: title || 'Professional',
      company: company || 'Your Company',
      email,
      phone: phone || '',
      image: photo || undefined,
    },
    createdAt: new Date(),
  } : null;

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Creating/Loading step
  if (currentStep === 'creating') {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center relative overflow-hidden">
        {/* Confetti animation */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8B94', '#A8E6CF'][Math.floor(Math.random() * 5)],
              }}
              initial={{ opacity: 0, y: -20, rotate: 0 }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                y: [0, -100, -200],
                rotate: 360,
                x: Math.random() * 200 - 100,
              }}
              transition={{
                duration: 2,
                delay: Math.random() * 0.5,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            />
          ))}
        </div>

        <div className="text-center z-10 relative ">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-64 h-64 mt-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6">
              {previewCard && (
                <div className="w-auto mb-50">
                  <CardPreview card={previewCard} />
                </div>
              )}
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white mb-4"
          >
            Modern networking is just moments away
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-purple-100 mb-8"
          >
            Give us a moment to put your new Digital Cards profile together...
          </motion.p>

          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-white rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Preview */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-purple-600 via-purple-700 to-indigo-800 relative overflow-hidden items-center justify-center p-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-40 -top-40 w-80 h-80 bg-white rounded-full blur-3xl"></div>
          <div className="absolute -right-40 -bottom-40 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-sm">
          {currentStep !== 'welcome' && previewCard ? (
            <motion.div
              key={currentStep}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl p-6"
            >
              <CardPreview card={previewCard} />
            </motion.div>
          ) : (
            <div className="text-center text-white">
              <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Welcome to Digital Cards</h3>
              <p className="text-purple-100">Build connections in your own unique way</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">Back to Dashboard</span>
          </Link>
        </header>

        <div className="flex-1 flex items-center justify-center p-8 pb-16">
          <div className="w-full max-w-md">
            {/* Step 1: Welcome */}
            {currentStep === 'welcome' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-linear-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl font-bold text-white">DC</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Digital Cards</h1>
                <p className="text-lg text-gray-600 mb-8">
                  Build connections in your own unique way. Create your first card, and start expanding your network!
                </p>
                <button
                  onClick={() => setCurrentStep('name')}
                  className="cursor-pointer w-full px-6 py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg"
                >
                  Get started →
                </button>
              </motion.div>
            )}

            {/* Step 2: Name */}
            {currentStep === 'name' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Let's start with the basics</h2>
                <p className="text-gray-600 mb-6">Tell us a bit about yourself. What is your name?</p>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-purple-600 focus:outline-none text-lg"
                  autoFocus
                />
                <div className="mt-8">
                  <button
                    onClick={() => setCurrentStep('title-company')}
                    disabled={!name.trim()}
                    className="cursor-pointer w-full px-6 py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
                <div className="flex gap-2 mt-4 justify-center">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-1 w-12 rounded ${
                        step === 1 ? 'bg-purple-600' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Title & Company */}
            {currentStep === 'title-company' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Great to meet you!</h2>
                <p className="text-gray-600 mb-6">What title and company should appear on your first card?</p>
                <div className="space-y-4 mb-6">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => setCurrentStep('photo')}
                  className="cursor-pointer w-full px-6 py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors mb-2"
                >
                  Continue
                </button>
                <button
                  onClick={() => setCurrentStep('photo')}
                  className="cursor-pointer w-full text-gray-600 hover:text-gray-900 text-sm"
                >
                  Skip
                </button>
                <div className="flex gap-2 mt-4 justify-center">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-1 w-12 rounded ${
                        step === 2 ? 'bg-purple-600' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Photo */}
            {currentStep === 'photo' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Make your card stand out 📸</h2>
                <p className="text-gray-600 mb-6">Add a photo of yourself</p>
                <div className="mb-6">
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-600 transition-colors overflow-hidden">
                    {photo ? (
                      <img src={photo} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-600">Upload a photo</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 mb-6">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Photo Tips:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• High-quality headshots look the best!</li>
                    <li>• You can choose different pictures for each card.</li>
                    <li>• You can always change this photo later.</li>
                  </ul>
                </div>
                <button
                  onClick={() => setCurrentStep('contact')}
                  className="cursor-pointer w-full px-6 py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors mb-2"
                >
                  Continue
                </button>
                <button
                  onClick={() => setCurrentStep('contact')}
                  className="cursor-pointer w-full text-gray-600 hover:text-gray-900 text-sm"
                >
                  Skip
                </button>
                <div className="flex gap-2 mt-4 justify-center">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-1 w-12 rounded ${
                        step === 3 ? 'bg-purple-600' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 5: Contact */}
            {currentStep === 'contact' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Almost done!</h2>
                <p className="text-gray-600 mb-6">How can people reach you?</p>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 234 567 8900"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  Digital Cards will never sell your information. You can always change this information later.
                </p>
                <button
                  onClick={handleCreateCard}
                  disabled={!name || !email || !phone || isCreating}
                  className="cursor-pointer w-full px-6 py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? 'Creating...' : 'Done'}
                </button>
                <div className="flex gap-2 mt-4 justify-center">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-1 w-12 rounded ${
                        step === 4 ? 'bg-purple-600' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

