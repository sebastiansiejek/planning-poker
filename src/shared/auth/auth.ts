import { FirestoreAdapter, initFirestore } from '@auth/firebase-adapter';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import admin from 'firebase-admin';
import type { AuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { AuthSessionStrategy } from '@/features/auth/lib/auth-session-strategy';
import { getPrisma } from '@/shared/database/prisma';
import {
  getDatabaseProvider,
  validatePrismaDatabaseUrl,
} from '@/shared/lib/database-provider';

const authSessionStrategy = new AuthSessionStrategy();
const databaseProvider = getDatabaseProvider();

if (databaseProvider === 'prisma') {
  validatePrismaDatabaseUrl();
}

const adminDatabase = () => {
  if (getDatabaseProvider() !== 'firebase') {
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

export const getAuthOptions = (): AuthOptions => {
  const databaseProvider = getDatabaseProvider();

  if (databaseProvider === 'prisma') {
    validatePrismaDatabaseUrl();
  }

  return {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],
    session: {
      strategy: databaseProvider === 'firebase' ? 'jwt' : 'database',
    },
    callbacks: {
      session: async ({ session, token, user }) =>
        authSessionStrategy.handleSession(session, { token, user }),
      jwt: async ({ token, user }) =>
        authSessionStrategy.handleJWT(token, user),
    },
    adapter:
      databaseProvider === 'firebase'
        ? FirestoreAdapter(adminDatabase())
        : PrismaAdapter(getPrisma()),
  };
};

export const getSession = async () => getServerSession(getAuthOptions());
