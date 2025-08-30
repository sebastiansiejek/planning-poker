import type { PropsWithChildren } from 'react';

import type { MembersProperties } from '@/widgets/room/ui/members/members.types';

export type MembersContainerProperties = PropsWithChildren &
  Pick<MembersProperties, 'place' | 'isVertical'>;
