import type { RoomMember } from '@/app/game/[...room]/types';
import type { Vote } from '@/shared/types/types';

export type MembersProps = {
  members: RoomMember[];
  place: 'top' | 'left' | 'right' | 'bottom';
  votedUserIds: string[];
  isVertical?: boolean;
  votes: Vote[];
  isRevealedCards?: boolean;
};
