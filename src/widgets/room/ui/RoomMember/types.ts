import type { PusherMember } from '@/types/pusher/pusher';

export type MemberProps = PusherMember & {
  isVoted?: boolean;
  isRevealedCards?: boolean;
  avatarUrl?: string;
  isLoading?: boolean;
  isActionTooltip?: boolean;
};
