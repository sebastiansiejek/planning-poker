import { FirestoreAdapter, initFirestore } from '@auth/firebase-adapter';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import admin from 'firebase-admin';
import type { AuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { AuthSessionStrategy } from '@/features/auth/lib/AuthSessionStrategy';
import prisma from '@/shared/database/prisma';

const authSessionStrategy = new AuthSessionStrategy();

const adminDb = initFirestore({
  credential: admin.credential.cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  }),
});

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: process.env.DATABASE_PROVIDER === 'firebase' ? 'jwt' : 'database',
  },
  callbacks: {
    session: async ({ session, token, user }) =>
      authSessionStrategy.handleSession(session, { token, user }),
    jwt: async ({ token, user }) => authSessionStrategy.handleJWT(token, user),
  },
  adapter:
    process.env.DATABASE_PROVIDER === 'firebase'
      ? FirestoreAdapter(adminDb)
      : PrismaAdapter(prisma),
};

export const getSession = async () => getServerSession(authOptions);
