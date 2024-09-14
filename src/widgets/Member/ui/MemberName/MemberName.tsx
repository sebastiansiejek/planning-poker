'use client';

import { useRef } from 'react';
import Skeleton from 'react-loading-skeleton';

import { useIsEllipsisActive } from '@/shared/hooks/useIsEllipsisActive/useIsEllipsisActive';
import type { MemberNameProps } from '@/widgets/Member/ui/MemberName/types';

export const MemberName = ({ name, isLoading }: MemberNameProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isEllipsisActive = useIsEllipsisActive(ref);

  return (
    <div
      className="font-semibold mt-2 line-clamp-1"
      ref={ref}
      {...(isEllipsisActive && { title: name })}
    >
      {isLoading ? <Skeleton height={12} width={80} /> : name}
    </div>
  );
};
