import type { PusherMember } from '@/shared/types/pusher/pusher';

export type MemberProps = PusherMember & {
  isVoted?: boolean;
  isRevealedCards?: boolean;
  avatarUrl?: string;
  isLoading?: boolean;
  isActionTooltip?: boolean;
};
