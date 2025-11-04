'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import CardPreview from '@/components/CardPreview';
import { Card } from '@/types/card';

// Example cards for showcase (kept similar to your originals)
const exampleCards: Card[] = [
  {
    id: 'example-1',
    type: 'business',
    style: 'style1',
    data: {
      name: 'Sarah Johnson',
      title: 'Senior Marketing Director',
      company: 'Tech Innovations Inc.',
      email: 'sarah.j@techinnovations.com',
      phone: '+1 (555) 123-4567',
      website: 'www.techinnovations.com',
      linkedin: 'linkedin.com/in/sarahjohnson',
      address: '123 Business Ave, San Francisco, CA',
    },
    createdAt: new Date(),
  },
  {
    id: 'example-2',
    type: 'personal',
    style: 'style1',
    data: {
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 987-6543',
      website: 'www.michaelchen.dev',
      socialMedia: {
        instagram: '@michaelchen',
        twitter: '@mchen_dev',
        linkedin: 'linkedin.com/in/michaelchen',
      },
    },
    createdAt: new Date(),
  },
  {
    id: 'example-3',
    type: 'bank',
    style: 'style1',
    data: {
      accountHolder: 'Alexandra Rodriguez',
      bankName: 'Global Bank',
      accountNumber: '**** **** **** 4532',
      ifscCode: 'GBLK0001234',
      upiId: 'alex.rodriguez@upi',
    },
    createdAt: new Date(),
  },
];

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-purple-50/40 to-white dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950">
      {/* Top Nav - glass style */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-white/60 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-linear-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">DC</span>
              </div>
              <div>
                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Digital Cards</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 -mt-0.5">Smart QR • Share</div>
              </div>
            </div>

            <nav className="flex items-center gap-4">
              <Link href="/auth/signin" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Sign In</Link>
              <Link href="/auth/signup" className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition">Get Started</Link>
            </nav>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          {/* Decorative linear blobs (animated with CSS) */}
          <div className="absolute -left-40 -top-24 w-[480px] h-[480px] rounded-full bg-linear-to-br from-purple-300 to-indigo-300 opacity-30 blur-3xl animate-blob mix-blend-multiply"></div>
          <div className="absolute -right-36 -bottom-24 w-[420px] h-[420px] rounded-full bg-linear-to-br from-pink-200 to-purple-300 opacity-25 blur-3xl animate-blob animation-delay-2000 mix-blend-multiply"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-4">
                    ✨ Launch faster — share instantly
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900 dark:text-zinc-100 leading-tight">
                    Create professional <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-indigo-600">digital cards</span>
                    <br />
                    that people keep.
                  </h1>

                  <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
                    Beautiful, customizable digital cards with instant QR codes, sharing analytics, and secure payment integrations — built for professionals.
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <Link href="/auth/signup" className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-linear-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:scale-[1.02] transition-transform">
                      Get Started Free
                    </Link>

                    <Link href="/auth/signin" className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold">
                      Sign In
                    </Link>
                  </div>

                  <div className="mt-6 text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-3">
                    <div className="inline-flex items-center gap-2">
                      <span className="font-semibold">✓</span>
                      <span>Secure</span>
                    </div>
                    <span>•</span>
                    <div className="inline-flex items-center gap-2">
                      <span className="font-semibold">✓</span>
                      <span>Fast</span>
                    </div>
                    <span>•</span>
                    <div className="inline-flex items-center gap-2">
                      <span className="font-semibold">✓</span>
                      <span>Trusted</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Animated card stack - HiHello style mimic */}
              <div className="lg:col-span-5 relative">
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative w-full max-w-md mx-auto">

                  {/* floating cards */}
                  <div className="relative w-full h-[360px]">
                    {exampleCards.map((card, i) => {
                      const rotate = (i - 1) * 6; // -6, 0, 6
                      const y = -i * 18;
                      const delay = 0.15 * i;
                      return (
                        <motion.div
                          key={card.id}
                          initial={{ opacity: 0, y: 40, rotate: rotate - 6 }}
                          animate={{ opacity: 1, y: y, rotate: rotate }}
                          transition={{ duration: 0.8, delay }}
                          whileHover={{ scale: 1.03, y: y - 6 }}
                          className="absolute left-1/2 -translate-x-1/2 w-72 shadow-2xl rounded-xl"
                          style={{ zIndex: 10 + i }}
                        >
                          <div className="bg-linear-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-800 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700">
                            <div className="bg-white dark:bg-zinc-950 rounded-lg p-4">
                              <CardPreview card={card} />
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* subtle device mockup behind */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[380px] h-[220px] rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-linear-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-800 opacity-70 transform rotate-[-4deg]" />
                  </div>
                </motion.div>

                {/* micro-cta overlay */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="mt-6 text-center">
                  <Link href="/auth/signup" className="text-sm font-medium inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full shadow-sm">
                    Create your first card — it's free
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Features section with icons and subtle enter animations */}
        <section className="py-20 bg-white dark:bg-zinc-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <motion.h2 
                className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-6"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                What is a Digital Card Platform?
              </motion.h2>
              <motion.p 
                className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                A complete solution for creating, sharing, and managing digital business cards, personal cards, and payment information. 
                Share instantly via QR codes, links, or NFC—all while keeping your brand consistent and your contacts organized.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl p-8 border border-purple-100 dark:border-zinc-700"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.05, y: -8, transition: { duration: 0.2 } }}
              >
                <motion.div 
                  className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-6"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}
                  whileHover={{ rotate: 360, scale: 1.1, transition: { duration: 0.5 } }}
                >
                  📇
                </motion.div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
                  Digital Cards
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Create beautiful, customizable digital cards for business, personal use, or payment sharing.
                </p>
              </motion.div>

              <motion.div 
                className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl p-8 border border-blue-100 dark:border-zinc-700"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.05, y: -8, transition: { duration: 0.2 } }}
              >
                <motion.div 
                  className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 200 }}
                  whileHover={{ rotate: 360, scale: 1.1, transition: { duration: 0.5 } }}
                >
                  🔗
                </motion.div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
                  Instant Sharing
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Share via QR codes, links, text messages, or save to Apple Wallet. Your choice.
                </p>
              </motion.div>

              <motion.div 
                className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl p-8 border border-green-100 dark:border-zinc-700"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.05, y: -8, transition: { duration: 0.2 } }}
              >
                <motion.div 
                  className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center text-3xl mb-6"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.6, delay: 0.5, type: "spring", stiffness: 200 }}
                  whileHover={{ rotate: 360, scale: 1.1, transition: { duration: 0.5 } }}
                >
                  💼
                </motion.div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
                  Contact Management
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Organize all your contacts in one place. Track shares and manage your network efficiently.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-linear-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <motion.h2 
                className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-4"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                How It Works
              </motion.h2>
              <motion.p 
                className="text-xl text-zinc-600 dark:text-zinc-400"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Get started in four simple steps
              </motion.p>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { num: 1, title: 'Sign Up', desc: 'Create your free account in seconds', icon: '✍️' },
                { num: 2, title: 'Fill Details', desc: 'Add your contact information and details', icon: '📝' },
                { num: 3, title: 'Choose Design', desc: 'Select from multiple beautiful card styles', icon: '🎨' },
                { num: 4, title: 'Share & Connect', desc: 'Get your QR code and start sharing instantly', icon: '📱' },
              ].map((step, index) => (
                <motion.div 
                  key={step.num} 
                  className="relative"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, y: 50 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: false, margin: "-50px" }}
                  transition={{ 
                    duration: 0.7, 
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ scale: 1.08, y: -12, transition: { duration: 0.3 } }}
                >
                  <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 border-2 border-zinc-200 dark:border-zinc-700 h-full hover:shadow-xl transition-all">
                    <div className="flex flex-col items-center text-center">
                      <motion.div 
                        className="w-20 h-20 bg-linear-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-lg"
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: false }}
                        transition={{ 
                          duration: 0.6, 
                          delay: index * 0.15 + 0.3,
                          type: "spring",
                          stiffness: 200
                        }}
                        whileHover={{ rotate: 360, scale: 1.15, transition: { duration: 0.6 } }}
                      >
                        {step.icon}
                      </motion.div>
                      <motion.div 
                        className="absolute top-4 right-4 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        initial={{ scale: 0, rotate: -90 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: false }}
                        transition={{ 
                          duration: 0.4, 
                          delay: index * 0.15 + 0.5,
                          type: "spring",
                          stiffness: 150
                        }}
                        whileHover={{ scale: 1.2, rotate: 90 }}
                      >
                        {step.num}
                      </motion.div>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                  {index < 3 && (
                    <motion.div 
                      className="hidden lg:flex absolute top-1/2 -right-4 w-8 h-8 text-purple-300 dark:text-purple-700 z-10 bg-white dark:bg-zinc-900 rounded-full items-center justify-center"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false }}
                      animate={{ 
                        x: [0, 8, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.4 + 0.7,
                        ease: "easeInOut"
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-linear-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
            <h3 className="text-2xl font-bold">Ready to create your digital card?</h3>
            <p className="mt-2 text-sm opacity-90">Join thousands of professionals using Digital Cards.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/auth/signup" className="px-6 py-3 bg-white text-purple-600 rounded-md font-semibold shadow">Get Started Free</Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-linear-to-br from-purple-600 to-indigo-600 rounded-md flex items-center justify-center text-white font-bold">DC</div>
            <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Digital Cards</div>
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">© {new Date().getFullYear()} Digital Cards. All rights reserved.</div>
        </div>
      </footer>

      {/* small animation utilities */}
      <style jsx>{`
        .animate-blob {
          animation: blob 8s infinite;
        }
        .animation-delay-2000 { animation-delay: 2s; }
        @keyframes blob {
          0% { transform: translateY(0px) scale(1); }
          33% { transform: translateY(-8px) scale(1.05); }
          66% { transform: translateY(4px) scale(0.98); }
          100% { transform: translateY(0px) scale(1); }
        }
      `}</style>
    </div>
  );
}
