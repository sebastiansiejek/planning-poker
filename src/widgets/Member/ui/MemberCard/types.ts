import type { HTMLAttributes } from 'react';

import type { ILoader } from '@/shared/types/types';
import type { MemberProps } from '@/widgets/room/ui/RoomMember/types';

export type MemberCardProps = {
  htmlAttributes?: HTMLAttributes<HTMLDivElement>;
} & Pick<MemberProps, 'isVoted' | 'isRevealedCards' | 'vote'> &
  ILoader;
