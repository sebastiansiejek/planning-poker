import { cva } from 'class-variance-authority';

import type { MembersContainerProperties } from '@/widgets/Room/ui/MembersContainer/types';

export const MemberContainer = ({
  children,
  place,
  isVertical,
}: MembersContainerProperties) => {
  return (
    <div
      className={cva('flex gap-8 h-full p-6 justify-center', {
        variants: {
          place: {
            top: '[grid-area:top]',
            left: '[grid-area:left]',
            right: '[grid-area:right]',
            bottom: '[grid-area:bottom]',
          },
          isVertical: {
            true: 'lg:flex-col',
            false: 'flex-row',
          },
        },
      })({ place, isVertical })}
    >
      {children}
    </div>
  );
};
