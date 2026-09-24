import { PrismaParticipantService } from '@/shared/api/services/prisma/prisma-participant-service';

export type RoomParticipant = {
  id: string;
  name: string;
  image: string | null;
};

export type ParticipantService = {
  joinAuthenticated: (roomId: string, userId: string) => Promise<RoomParticipant>;
  getAuthenticated: (roomId: string, userId: string) => Promise<RoomParticipant | null>;
  getRoomMembers: (roomId: string) => Promise<RoomParticipant[]>;
  leave: (roomId: string, participantId: string) => Promise<void>;
};

export const ParticipantServiceFactory = {
  getService(): ParticipantService {
    return new PrismaParticipantService();
  },
};
