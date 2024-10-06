import { Prisma } from '@prisma/client/extension';

import type prisma from '@/shared/database/prisma';
import Args = Prisma.Args;

export type RoomMember = Pick<
  Args<typeof prisma.user, 'create'>['data'],
  'id' | 'name' | 'image'
>;

export type RoomProps = {
  id: string;
  userName: string;
  avatarUrl?: string;
  name: string;
  members: RoomMember[];
  activeGameId?: string;
};
