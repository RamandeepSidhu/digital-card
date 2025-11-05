'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';

export default function CreateCardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 via-purple-50/30 to-white dark:from-zinc-900 dark:via-purple-900/10 dark:to-black">
      <Header />
      <main className="w-full max-w-4xl mx-auto py-12 px-4">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-zinc-400 dark:text-zinc-600 mx-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <span className="text-zinc-900 dark:text-zinc-100 font-medium">Create Card</span>
            </li>
          </ol>
        </nav>
        <div className="mb-8">
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
        <div className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link
              href="/create/business"
              className="group cursor-pointer relative p-5 border-2 border-gray-200 dark:border-zinc-700 rounded-2xl transition-all text-center hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-600"
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
              className="group cursor-pointer relative p-5 border-2 border-gray-200 dark:border-zinc-700 rounded-2xl transition-all text-center hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600"
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
              className="group cursor-pointer relative p-5 border-2 border-gray-200 dark:border-zinc-700 rounded-2xl transition-all text-center hover:shadow-xl hover:border-green-300 dark:hover:border-green-600"
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

