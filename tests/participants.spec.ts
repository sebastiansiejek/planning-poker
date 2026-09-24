import { randomUUID } from 'node:crypto';

import { expect, test } from '@playwright/test';

import { PrismaGameService } from '@/shared/api/services/prisma/prisma-game-service';
import { PrismaParticipantService } from '@/shared/api/services/prisma/prisma-participant-service';
import { PrismaRoomInvitationService } from '@/shared/api/services/prisma/prisma-room-invitation-service';
import { PrismaRoomService } from '@/shared/api/services/prisma/prisma-room-service';
import { PrismaVoteService } from '@/shared/api/services/prisma/prisma-vote-service';
import { getPrisma } from '@/shared/database/prisma';

test('room capacity, invitation rotation, and votes use participant identity', async () => {
  const prisma = getPrisma();
  const users = await Promise.all(
    Array.from({ length: 13 }, (_, index) =>
      prisma.user.create({
        data: { id: randomUUID(), name: `Participant ${index}` },
      }),
    ),
  );
  let roomId: string | undefined;

  try {
    const room = await new PrismaRoomService().create({
      name: `capacity-${randomUUID()}`,
      authorId: users[0].id,
    });
    roomId = room.id;
    const participants = new PrismaParticipantService();
    const invitations = new PrismaRoomInvitationService();

    for (const user of users.slice(1, 11)) {
      await participants.joinAuthenticated(room.id, user.id);
    }
    const lastJoins = await Promise.allSettled(
      users.slice(11).map((user) => participants.joinAuthenticated(room.id, user.id)),
    );
    expect(lastJoins.filter((result) => result.status === 'fulfilled')).toHaveLength(1);
    expect(await participants.getRoomMembers(room.id)).toHaveLength(12);

    const firstInvite = await invitations.rotate(room.id, users[0].id);
    expect(await invitations.resolveRoom(firstInvite.token)).toBe(room.id);
    const secondInvite = await invitations.rotate(room.id, users[0].id);
    expect(await invitations.resolveRoom(firstInvite.token)).toBeNull();
    expect(await invitations.resolveRoom(secondInvite.token)).toBe(room.id);

    const game = await new PrismaGameService().create({ roomId: room.id, actorUserId: users[0].id });
    const owner = await participants.getAuthenticated(room.id, users[0].id);
    expect(owner).not.toBeNull();
    const votes = new PrismaVoteService();
    await votes.upsert({
      gameId: game.id,
      roomId: room.id,
      participantId: owner!.id,
      vote: '3',
    });
    expect(await votes.getRevealedVotes(game.id, room.id)).toEqual([]);
    await participants.leave(room.id, owner!.id);
    expect(await participants.isRemoved(room.id, users[0].id)).toBe(true);
    await expect(participants.joinAuthenticated(room.id, users[0].id)).rejects.toThrow(
      'Participant was removed from this room',
    );
    await expect(new PrismaGameService().create({
      roomId: room.id,
      actorUserId: users[0].id,
    })).rejects.toThrow('Participant is not active');
    expect(await prisma.vote.findUnique({
      where: { participantId_gameId: { participantId: owner!.id, gameId: game.id } },
    })).toMatchObject({ vote: '3' });
    await new PrismaGameService().finishGame({ gameId: game.id, roomId: room.id, actorUserId: users[1].id });
    expect(await votes.getRevealedVotes(game.id, room.id)).toEqual([
      { participantId: owner!.id, vote: '3' },
    ]);
  } finally {
    if (roomId) await prisma.room.delete({ where: { id: roomId } });
    await prisma.user.deleteMany({ where: { id: { in: users.map((user) => user.id) } } });
  }
});
