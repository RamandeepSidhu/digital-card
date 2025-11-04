'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  showNewCardButton?: boolean;
}

export default function Header({ showNewCardButton = false }: HeaderProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href={session ? '/dashboard' : '/'} className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
              DC
            </div>
            <h1 className="text-lg font-semibold text-gray-900">Digital Cards</h1>
          </Link>
          <div className="flex items-center gap-3">
            {status === 'authenticated' && session && (
              <>
                {showNewCardButton && (
                  <Link
                    href="/create"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-sm hover:shadow-md text-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    New Card
                  </Link>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                    {session.user?.name?.charAt(0).toUpperCase() ||
                      session.user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {session.user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{session.user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="cursor-pointer px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign Out
                </button>
              </>
            )}
            {status === 'unauthenticated' && (
              <nav className="flex items-center gap-4">
                <Link href="/auth/signin" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-sm text-sm">
                  Get Started
                </Link>
              </nav>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

