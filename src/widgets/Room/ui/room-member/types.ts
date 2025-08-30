import type { PusherMember } from '@/shared/types/pusher/pusher';

export type MemberProperties = PusherMember & {
  isVoted?: boolean;
  isRevealedCards?: boolean;
  image?: string;
  isLoading?: boolean;
  isActionTooltip?: boolean;
};
