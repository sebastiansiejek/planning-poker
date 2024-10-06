import { Prisma } from '@prisma/client/extension';

import type prisma from '@/shared/database/prisma';
import Args = Prisma.Args;

export type RoomMember = Pick<
  Args<typeof prisma.user, 'create'>['data'],
  'id' | 'name' | 'image'
>;

type Game = Pick<
  Args<typeof prisma.game, 'create'>['data'],
  'id' | 'name' | 'description'
> | null;

export type RoomProps = {
  id: string;
  userName: string;
  avatarUrl?: string;
  name: string;
  members: RoomMember[];
  activeGame: Game;
};
