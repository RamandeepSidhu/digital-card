import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { initRedis } from '@/lib/cardStorageKV';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // Only enable Google OAuth if both client ID and secret are provided
    ...((process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ? [
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET, // NEVER use NEXT_PUBLIC_ for secrets
      })
    ] : []),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing email or password');
          return null;
        }

        try {
          const { getUserByEmail } = await import('@/lib/userStorage');
          const email = (credentials.email as string).toLowerCase().trim();
          console.log(`🔍 Attempting to authenticate user: ${email}`);
          
          const user = await getUserByEmail(email);

          if (!user) {
            console.log(`❌ User not found: ${email}`);
            return null;
          }

          console.log(`✅ User found, checking password...`);
          
          // Check if user has a password (OAuth users might not have one)
          if (!user.password) {
            console.log(`❌ User has no password (OAuth user?): ${email}`);
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password as string, user.password);
          
          if (!isValid) {
            console.log(`❌ Invalid password for: ${email}`);
            return null;
          }

          console.log(`✅ Authentication successful for: ${email}`);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error('❌ Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google OAuth sign-in
      if (account?.provider === 'google' && user.email) {
        try {
          const { getUserByEmail, saveUser } = await import('@/lib/userStorage');
          
          // Check if user exists
          const existingUser = await getUserByEmail(user.email);

          if (!existingUser) {
            // Create new user for Google OAuth
            const userId = nanoid();
            const newUser = {
              id: userId,
              email: user.email,
              name: user.name || profile?.name || 'User',
              password: '', // No password for OAuth users
              provider: 'google',
              createdAt: new Date().toISOString(),
            };

            // Save user (to Redis if available, otherwise in-memory)
            await saveUser(newUser);
            
            // Update user object with ID
            user.id = userId;
          } else {
            // User exists, use their ID
            user.id = existingUser.id;
          }
        } catch (error) {
          console.error('Error during Google sign-in:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret-key-change-in-production-please-set-nextauth-secret-in-production',
  trustHost: true,
});

export const { GET, POST } = handlers;

