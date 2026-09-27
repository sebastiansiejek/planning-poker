import 'server-only';

import { SignJWT } from 'jose';

export const issueRoomRealtimeToken = async (
  roomId: string,
  participantId: string,
  userId: string,
) => {
  const secret = process.env.SUPABASE_JWT_SECRET;
  if (!secret || secret.length < 32)
    throw new Error('SUPABASE_JWT_SECRET is not configured');

  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + 60;
  const token = await new SignJWT({
    role: 'authenticated',
    room_id: roomId,
    participant_id: participantId,
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuer('planning-poker')
    .setAudience('authenticated')
    .setSubject(userId)
    .setIssuedAt(issuedAt)
    .setExpirationTime(expiresAt)
    .sign(new TextEncoder().encode(secret));

  return { token, expiresAt };
};
