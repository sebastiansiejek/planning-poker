'use client';

import type { Session } from 'next-auth';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import type { PropsWithChildren } from 'react';

export default function SessionProvider({
  session,
  children,
}: PropsWithChildren<{
  session: Session | null;
}>) {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
}
