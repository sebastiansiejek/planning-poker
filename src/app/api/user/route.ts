import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import z from 'zod';

import { UserPrismaService } from '@/shared/api/services/prisma/UserPrismaService';
import { getSession } from '@/shared/auth/auth';

export async function PUT(req: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const bodyData = await req.json();
  const schema = z.object({
    name: z.string(),
  });

  try {
    schema.parse(bodyData);
  } catch (error) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  const {
    user: { id, name: defaultName },
  } = session;
  const { name = defaultName } = bodyData;

  const data = await new UserPrismaService().updateUser(id, {
    name,
  });

  return NextResponse.json({
    data,
    message: 'User updated',
  });
}
