'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateCardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 via-purple-50/30 to-white dark:from-zinc-900 dark:via-purple-900/10 dark:to-black py-12 px-4">
      <main className="w-full max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="cursor-pointer inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors mb-6 group"
          >
            <svg
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Create New Card
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Choose the type of card you want to create
            </p>
          </div>
        </div>

        {/* Card Type Selection */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-zinc-200 dark:border-zinc-700">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8 text-center">
            Choose Card Type
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link
              href="/create/business"
              className="group cursor-pointer relative p-8 border-2 border-gray-200 dark:border-zinc-700 rounded-2xl transition-all text-center hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-600"
            >
              <div className="mb-6">
                <div className="w-20 h-20 bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-4xl">💼</span>
                </div>
              </div>
              <h3 className="font-bold text-xl text-zinc-900 dark:text-zinc-100 mb-2">
                Business Card
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Professional contact card for networking
              </p>
              <div className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Create Card</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <Link
              href="/create/personal"
              className="group cursor-pointer relative p-8 border-2 border-gray-200 dark:border-zinc-700 rounded-2xl transition-all text-center hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600"
            >
              <div className="mb-6">
                <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-4xl">👤</span>
                </div>
              </div>
              <h3 className="font-bold text-xl text-zinc-900 dark:text-zinc-100 mb-2">
                Personal Card
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Personal contact card for friends & family
              </p>
              <div className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Create Card</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <Link
              href="/create/bank"
              className="group cursor-pointer relative p-8 border-2 border-gray-200 dark:border-zinc-700 rounded-2xl transition-all text-center hover:shadow-xl hover:border-green-300 dark:hover:border-green-600"
            >
              <div className="mb-6">
                <div className="w-20 h-20 bg-linear-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-4xl">🏦</span>
                </div>
              </div>
              <h3 className="font-bold text-xl text-zinc-900 dark:text-zinc-100 mb-2">
                Bank Card
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Payment information card
              </p>
              <div className="inline-flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Create Card</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

