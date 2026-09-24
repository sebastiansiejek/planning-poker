import { PrismaBaseService } from '@/shared/api/services/prisma/prisma-base-service';
import type { ParticipantService } from '@/shared/factories/participant-service-factory';

const maxActiveParticipants = 12;
const participantSelect = { id: true, name: true, image: true } as const;

export class PrismaParticipantService
  extends PrismaBaseService
  implements ParticipantService
{
  joinAuthenticated: ParticipantService['joinAuthenticated'] = async (roomId, userId) => {
    return this.prisma.$transaction(async (transaction) => {
      // Serialize joins for this room so simultaneous requests respect its capacity.
      const rooms = await transaction.$queryRaw<{ id: string }[]>`
        SELECT "id" FROM "rooms" WHERE "id" = ${roomId} FOR UPDATE
      `;
      if (rooms.length === 0) throw new Error('Room not found');

      const existing = await transaction.participant.findUnique({
        where: { roomId_userId: { roomId, userId } },
        select: { ...participantSelect, leftAt: true },
      });
      if (existing && !existing.leftAt) return existing;
      if (existing?.leftAt) throw new Error('Participant was removed from this room');

      const activeCount = await transaction.participant.count({
        where: { roomId, leftAt: null },
      });
      if (activeCount >= maxActiveParticipants) throw new Error('Room is full');

      const user = await transaction.user.findUniqueOrThrow({
        where: { id: userId },
        select: { name: true, image: true },
      });
      return transaction.participant.create({
        data: { roomId, userId, name: user.name, image: user.image },
        select: participantSelect,
      });
    });
  };

  getAuthenticated: ParticipantService['getAuthenticated'] = async (roomId, userId) => {
    return this.prisma.participant.findFirst({
      where: { roomId, userId, leftAt: null },
      select: participantSelect,
    });
  };

  isRemoved: ParticipantService['isRemoved'] = async (roomId, userId) => {
    const participant = await this.prisma.participant.findUnique({
      where: { roomId_userId: { roomId, userId } },
      select: { leftAt: true },
    });
    return !!participant?.leftAt;
  };

  getActive: ParticipantService['getActive'] = async (roomId, participantId) => {
    return this.prisma.participant.findFirst({
      where: { id: participantId, roomId, leftAt: null },
      select: participantSelect,
    });
  };

  getRoomMembers: ParticipantService['getRoomMembers'] = async (roomId) => {
    return this.prisma.participant.findMany({
      where: { roomId, leftAt: null },
      select: participantSelect,
    });
  };

  leave: ParticipantService['leave'] = async (roomId, participantId) => {
    return this.prisma.$transaction(async (transaction) => {
      const rooms = await transaction.$queryRaw<{ id: string }[]>`
        SELECT "id" FROM "rooms" WHERE "id" = ${roomId} FOR UPDATE
      `;
      if (rooms.length === 0) return false;

      const result = await transaction.participant.updateMany({
        where: { id: participantId, roomId, leftAt: null },
        data: { leftAt: new Date() },
      });
      return result.count === 1;
    });
  };
}
