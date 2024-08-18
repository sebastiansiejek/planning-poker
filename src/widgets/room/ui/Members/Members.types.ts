import type { PusherMember } from '@/types/pusher/pusher';
import type { Vote } from '@/types/types';

export type MembersProps = {
  members: PusherMember[];
  place: 'top' | 'left' | 'right' | 'bottom';
  votedUserIds: string[];
  isVertical?: boolean;
  votes: Vote[];
  isRevealedCards?: boolean;
};
