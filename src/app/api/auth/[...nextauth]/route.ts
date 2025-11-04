import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { initRedis } from '@/lib/cardStorageKV';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '', // NEVER use NEXT_PUBLIC_ for secrets
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const redis = await initRedis();
        if (!redis) {
          throw new Error('Database connection failed');
        }

        const userKey = `user:email:${credentials.email}`;
        const userData = await redis.get(userKey);

        if (!userData) {
          return null;
        }

        const user = JSON.parse(userData);
        const isValid = await bcrypt.compare(credentials.password as string, user.password);
        
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
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
          const redis = await initRedis();
          if (!redis) {
            console.error('Redis connection failed during Google sign-in');
            return false;
          }

          // Check if user exists
          const userKey = `user:email:${user.email}`;
          const existingUser = await redis.get(userKey);

          if (!existingUser) {
            // Create new user for Google OAuth
            const userId = nanoid();
            const newUser = {
              id: userId,
              email: user.email,
              name: user.name || profile?.name || 'User',
              provider: 'google',
              createdAt: new Date().toISOString(),
            };

            // Save user to Redis
            await redis.set(userKey, JSON.stringify(newUser));
            await redis.set(`user:id:${userId}`, JSON.stringify(newUser));
            
            // Update user object with ID
            user.id = userId;
          } else {
            // User exists, parse and use their ID
            const userData = JSON.parse(existingUser);
            user.id = userData.id;
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

