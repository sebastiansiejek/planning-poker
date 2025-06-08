import type { PropsWithChildren } from 'react';

import type { MembersProperties } from '@/widgets/Room/ui/Members/members.types';

export type MembersContainerProperties = PropsWithChildren &
  Pick<MembersProperties, 'place' | 'isVertical'>;
