import { FirestoreAdapter, initFirestore } from '@auth/firebase-adapter';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import admin from 'firebase-admin';
import type { AuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { AuthSessionStrategy } from '@/features/auth/lib/auth-session-strategy';
import prisma from '@/shared/database/prisma';

const authSessionStrategy = new AuthSessionStrategy();

const adminDatabase = () => {
  if (process.env.NEXT_PUBLIC_DATABASE_PROVIDER !== 'firebase') {
    throw new Error('Firebase provider is not configured');
  }

  return initFirestore({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }),
  });
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy:
      process.env.NEXT_PUBLIC_DATABASE_PROVIDER === 'firebase'
        ? 'jwt'
        : 'database',
  },
  callbacks: {
    session: async ({ session, token, user }) =>
      authSessionStrategy.handleSession(session, { token, user }),
    jwt: async ({ token, user }) => authSessionStrategy.handleJWT(token, user),
  },
  adapter:
    process.env.NEXT_PUBLIC_DATABASE_PROVIDER === 'firebase'
      ? FirestoreAdapter(adminDatabase())
      : PrismaAdapter(prisma),
};

export const getSession = async () => getServerSession(authOptions);
