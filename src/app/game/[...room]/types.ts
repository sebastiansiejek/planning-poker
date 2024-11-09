import type { User } from '@prisma/client';

import type { Vote } from '@/shared/types/types';

export type RoomMember = Pick<User, 'id' | 'name' | 'image'>;

export type RoomProps = {
  id: string;
  name: string;
  members: RoomMember[];
  initialVotes: string[];
  finishedGameVotes: Vote[];
};
