import type { RealtimeMember } from '@/shared/types/realtime/realtime';

export type MemberProperties = RealtimeMember & {
  isVoted?: boolean;
  isRevealedCards?: boolean;
  image?: string;
  isLoading?: boolean;
  isActionTooltip?: boolean;
};
