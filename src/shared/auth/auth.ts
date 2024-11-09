import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { AuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

import prisma from '@/shared/database/prisma';

export const authOptions: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, user: { id } }) {
      return {
        ...session,
        user: {
          ...session.user,
          id,
        },
      };
    },
  },
  adapter: PrismaAdapter(prisma),
};

export const getSession = async () => getServerSession(authOptions);
