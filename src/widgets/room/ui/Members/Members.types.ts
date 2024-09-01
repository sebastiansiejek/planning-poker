import type { PusherMember } from '@/shared/types/pusher/pusher';
import type { Vote } from '@/shared/types/types';

export type MembersProps = {
  members: PusherMember[];
  place: 'top' | 'left' | 'right' | 'bottom';
  votedUserIds: string[];
  isVertical?: boolean;
  votes: Vote[];
  isRevealedCards?: boolean;
};
