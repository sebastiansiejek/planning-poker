import type { PropsWithChildren } from 'react';

import type { MembersProps } from '@/widgets/room/ui/Members/Members.types';

export type MembersContainerProps = PropsWithChildren &
  Pick<MembersProps, 'place' | 'isVertical'>;
