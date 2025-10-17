import type { RoomMember } from '@/app/game/[...room]/types';
import type { Vote } from '@/shared/types/types';

export type MembersProperties = {
  members: RoomMember[];
  place: 'top' | 'left' | 'right' | 'bottom';
  votedUserIds: string[];
  isVertical?: boolean;
  votes: Vote[];
  isRevealedCards?: boolean;
};
