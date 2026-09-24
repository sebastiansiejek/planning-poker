import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { PrismaUserService } from '@/shared/api/services/prisma/prisma-user-service';
import { getSession } from '@/shared/auth/auth';
import { RealtimeEvents, RealtimeTopics } from '@/shared/realtime/config/realtime-events';
import { broadcastToRealtime } from '@/shared/realtime/lib/supabase-realtime-server';
import { UserUpsertPayloadSchema } from '@/shared/types/user/user';

export async function PUT(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const bodyData = await request.json().catch(() => null);
  const parsed = UserUpsertPayloadSchema.safeParse(bodyData);
  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  const { user, participants } = await new PrismaUserService().updateUser(session.user.id, {
    name: parsed.data.name,
  });

  const broadcasts = await Promise.allSettled(
    participants.map((participant) =>
      broadcastToRealtime(
        RealtimeTopics.roomEvents(participant.roomId),
        RealtimeEvents.MEMBER_UPDATED,
        { id: participant.id, name: user.name },
      ),
    ),
  );
  for (const broadcast of broadcasts) {
    if (broadcast.status === 'rejected') {
      console.error('Failed to broadcast participant name update', broadcast.reason);
    }
  }

  return NextResponse.json({
    data: user,
    message: 'User updated',
  });
}
