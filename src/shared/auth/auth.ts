import { FirestoreAdapter } from '@auth/firebase-adapter';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { AuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { AuthSessionStrategy } from '@/features/auth/lib/AuthSessionStrategy';
import { adminDb } from '@/shared/database/firebase';
import prisma from '@/shared/database/prisma';

const authSessionStrategy = new AuthSessionStrategy();

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
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
