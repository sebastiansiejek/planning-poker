import type { PropsWithChildren } from 'react';

import type { MembersProps } from '@/widgets/Room/ui/Members/Members.types';

export type MembersContainerProps = PropsWithChildren &
  Pick<MembersProps, 'place' | 'isVertical'>;
