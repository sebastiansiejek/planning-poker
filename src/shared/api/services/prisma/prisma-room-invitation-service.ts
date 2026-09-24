import { createHash, randomBytes } from 'node:crypto';

import { PrismaBaseService } from '@/shared/api/services/prisma/prisma-base-service';
import type { RoomInvitationService } from '@/shared/factories/room-invitation-service-factory';

const invitationLifetimeMs = 30 * 24 * 60 * 60 * 1000;

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

export class PrismaRoomInvitationService
  extends PrismaBaseService
  implements RoomInvitationService
{
  rotate: RoomInvitationService['rotate'] = async (roomId, ownerId) => {
    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + invitationLifetimeMs);

    await this.prisma.$transaction(async (transaction) => {
      const rooms = await transaction.$queryRaw<{ authorId: string }[]>`
        SELECT "authorId" FROM "rooms" WHERE "id" = ${roomId} FOR UPDATE
      `;
      if (rooms[0]?.authorId !== ownerId) throw new Error('Only the room owner can rotate invitations');

      await transaction.roomInvitation.updateMany({
        where: { roomId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      await transaction.roomInvitation.create({
        data: { roomId, createdById: ownerId, tokenHash: hashToken(token), expiresAt },
      });
    });

    return { token, expiresAt };
  };

  resolveRoom: RoomInvitationService['resolveRoom'] = async (token) => {
    const invitation = await this.prisma.roomInvitation.findUnique({
      where: { tokenHash: hashToken(token) },
      select: { roomId: true, expiresAt: true, revokedAt: true },
    });
    if (!invitation || invitation.revokedAt || (invitation.expiresAt && invitation.expiresAt <= new Date())) {
      return null;
    }
    return invitation.roomId;
  };
}
