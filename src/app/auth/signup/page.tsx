'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Failed to create account');
      } else {
        router.push('/auth/signin?registered=true');
      }
    } catch (err) {
      console.error('Signup exception:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-purple-50 to-white relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-purple-200/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-indigo-200/40 rounded-full blur-3xl" />

      {/* Logo */}
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 z-50">
        <div className="w-9 h-9 bg-linear-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md text-white font-bold">
          DC
        </div>
        <span className="text-sm font-semibold text-zinc-700">Digital Cards</span>
      </Link>

      {/* Sign Up Card */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white/90 backdrop-blur-lg border border-zinc-100 rounded-2xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-extrabold text-center text-zinc-900 mb-2">
            Create your <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-indigo-600">account</span>
          </h1>
          <p className="text-center text-zinc-600 mb-8">
            Start building professional digital cards today
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
                className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full px-4 py-3 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold shadow hover:opacity-90 transition-opacity disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-zinc-600">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-purple-600 font-medium hover:underline">
              Sign in
            </Link>
          </div>

          <div className="text-center mt-4">
            <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-700">
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
