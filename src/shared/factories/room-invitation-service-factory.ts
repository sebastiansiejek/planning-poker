import { PrismaRoomInvitationService } from '@/shared/api/services/prisma/prisma-room-invitation-service';

export type RoomInvitationService = {
  rotate: (roomId: string, ownerId: string) => Promise<{
    token: string;
    expiresAt: Date;
  }>;
  resolveRoom: (token: string) => Promise<string | null>;
};

export const RoomInvitationServiceFactory = {
  getService(): RoomInvitationService {
    return new PrismaRoomInvitationService();
  },
};
