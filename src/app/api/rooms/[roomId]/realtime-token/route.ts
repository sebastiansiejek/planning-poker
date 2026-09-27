import { z } from 'zod';

import { getRoomActor } from '@/shared/auth/room-access';
import { issueRoomRealtimeToken } from '@/shared/auth/room-realtime-token';

const headers = { 'Cache-Control': 'private, no-store' };

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ roomId: string }> },
) {
  const parsed = z
    .object({ roomId: z.string().min(1).max(128) })
    .safeParse(await params);
  if (!parsed.success)
    return Response.json({ error: 'Invalid room' }, { status: 400, headers });

  const { roomId } = parsed.data;
  const actor = await getRoomActor(roomId);
  if (!actor)
    return Response.json({ error: 'Forbidden' }, { status: 403, headers });

  return Response.json(
    await issueRoomRealtimeToken(roomId, actor.participant.id, actor.userId),
    { headers },
  );
}
