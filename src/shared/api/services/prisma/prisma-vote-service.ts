import { PrismaBaseService } from '@/shared/api/services/prisma/prisma-base-service';
import type { VoteService } from '@/shared/factories/vote-service-factory';

export class PrismaVoteService
  extends PrismaBaseService
  implements VoteService
{
  getVotedParticipants: VoteService['getVotedParticipants'] = (gameId, roomId) => {
    return this.prisma.vote.findMany({
      where: { gameId, game: { roomId } },
      select: { participantId: true, vote: true },
    });
  };

  getRevealedVotes: VoteService['getRevealedVotes'] = (gameId, roomId) => {
    return this.prisma.vote.findMany({
      where: { gameId, game: { roomId, status: 'FINISHED' } },
      select: { participantId: true, vote: true },
    });
  };

  upsert: VoteService['upsert'] = async ({ gameId, roomId, participantId, vote }) => {
    await this.prisma.$transaction(async (transaction) => {
      const rooms = await transaction.$queryRaw<{ id: string }[]>`
        SELECT "id" FROM "rooms" WHERE "id" = ${roomId} FOR UPDATE
      `;
      if (rooms.length === 0) throw new Error('Room not found');

      const games = await transaction.$queryRaw<{ status: string }[]>`
        SELECT "status" FROM "games" WHERE "id" = ${gameId} AND "roomId" = ${roomId} FOR UPDATE
      `;
      if (games[0]?.status !== 'STARTED') throw new Error('Round is not active');

      const participant = await transaction.participant.findFirst({
        where: { id: participantId, roomId, leftAt: null },
        select: { id: true },
      });
      if (!participant) throw new Error('Participant is not active');

      await transaction.vote.upsert({
        where: { participantId_gameId: { participantId, gameId } },
        create: { participantId, gameId, vote },
        update: { vote },
      });
    });
  };
}
