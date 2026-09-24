import 'server-only';

import { getSession } from '@/shared/auth/auth';
import { ParticipantServiceFactory } from '@/shared/factories/participant-service-factory';

export const getRoomActor = async (roomId: string) => {
  const session = await getSession();
  const userId = session?.user.id;
  if (!userId) return null;

  const participant = await ParticipantServiceFactory.getService().getAuthenticated(roomId, userId);
  return participant ? { userId, participant } : null;
};
