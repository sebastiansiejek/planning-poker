'use server';

import { z } from 'zod';

import { getRoomActor } from '@/shared/auth/room-access';
import { GameServiceFactory } from '@/shared/factories/game-service-factory';
import { ParticipantServiceFactory } from '@/shared/factories/participant-service-factory';
import { VoteServiceFactory } from '@/shared/factories/vote-service-factory';
import { actionClient } from '@/shared/lib/safe-action';

export const getRoomState = actionClient
  .schema(z.object({ roomId: z.string().min(1).max(128) }))
  .action(async ({ parsedInput: { roomId } }) => {
    const actor = await getRoomActor(roomId);
    if (!actor) return { success: false as const };
    const [members, game] = await Promise.all([
      ParticipantServiceFactory.getService().getRoomMembers(roomId),
      GameServiceFactory.getService().getLatestRoomGame(roomId),
    ]);
    const votes = game
      ? await VoteServiceFactory.getService().getVotedParticipants(
          game.id,
          roomId,
        )
      : [];
    return {
      success: true as const,
      members,
      game,
      votedParticipantIds: votes.map(({ participantId }) => participantId),
      // Never send another participant's card value before reveal.
      revealedVotes: game?.status === 'FINISHED' ? votes : [],
      ownVote:
        votes.find(
          ({ participantId }) => participantId === actor.participant.id,
        )?.vote || '',
    };
  });
