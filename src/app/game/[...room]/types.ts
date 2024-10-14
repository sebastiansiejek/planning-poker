import type { User } from '@prisma/client';

export type RoomMember = Pick<User, 'id' | 'name' | 'image'>;

export type RoomProps = {
  id: string;
  name: string;
  members: RoomMember[];
  initialVotes: string[];
};
