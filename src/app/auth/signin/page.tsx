'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if user was just registered
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('registered') === 'true') {
      setError('');
    }
  }, []);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Normalize email to lowercase
      const normalizedEmail = email.toLowerCase().trim();
      const result = await signIn('credentials', { 
        email: normalizedEmail, 
        password, 
        redirect: false 
      });
      
      if (result?.error) {
        setError('Invalid email or password. Please check your credentials.');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Something went wrong, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch {
      setError('Google sign-in failed.');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-purple-50 to-white relative overflow-hidden">
      {/* Background blur blobs */}
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-purple-200/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-indigo-200/40 rounded-full blur-3xl" />

      {/* Logo */}
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 z-50">
        <div className="w-9 h-9 bg-linear-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md text-white font-bold">
          DC
        </div>
        <span className="text-sm font-semibold text-zinc-700">Digital Cards</span>
      </Link>

      {/* Login Card */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white/90 backdrop-blur-lg border border-zinc-100 rounded-2xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-extrabold text-center text-zinc-900 mb-8">
            Sign in to <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-indigo-600">Digital Cards</span>
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            className="cursor-pointer w-full flex items-center justify-center gap-3 px-4 py-3 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            </svg>
            <span className="text-zinc-700 font-medium">Continue with Google</span>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-zinc-500">or sign in with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-1">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full px-4 py-3 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold shadow hover:opacity-90 transition-opacity disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-zinc-600">
            Don’t have an account?{' '}
            <Link href="/auth/signup" className="text-purple-600 font-medium hover:underline">
              Sign up
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
