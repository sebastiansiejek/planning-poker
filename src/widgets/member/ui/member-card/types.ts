import type { HTMLAttributes } from 'react';

import type { ILoader } from '@/shared/types/types';
import type { MemberProperties } from '@/widgets/room/ui/room-member/types';

export type MemberCardProperties = {
  htmlAttributes?: HTMLAttributes<HTMLDivElement>;
} & Pick<MemberProperties, 'isVoted' | 'isRevealedCards' | 'vote'> &
  ILoader;
