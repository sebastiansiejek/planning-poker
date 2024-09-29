import { NextResponse } from 'next/server';

import { getSession } from '@/shared/auth/auth';

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  return NextResponse.json({ message: 'Authenticated', session });
}
