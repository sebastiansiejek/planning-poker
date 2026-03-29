import NextAuth from 'next-auth';

import { getAuthOptions } from '@/shared/auth/auth';

export async function GET(request: Request, context: unknown) {
  return NextAuth(getAuthOptions())(request, context);
}

export async function POST(request: Request, context: unknown) {
  return NextAuth(getAuthOptions())(request, context);
}
