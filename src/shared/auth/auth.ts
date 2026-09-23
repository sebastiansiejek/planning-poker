import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { AuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { AuthSessionStrategy } from '@/features/auth/lib/auth-session-strategy';
import { getPrisma } from '@/shared/database/prisma';

const authSessionStrategy = new AuthSessionStrategy();

export const getAuthOptions = (): AuthOptions => {
  return {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],
    session: {
      strategy: 'database',
    },
    callbacks: {
      session: async ({ session, user }) =>
        authSessionStrategy.handleSession(session, { user }),
    },
    adapter: PrismaAdapter(getPrisma()),
  };
};

export const getSession = async () => getServerSession(getAuthOptions());
