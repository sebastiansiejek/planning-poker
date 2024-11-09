'use client';

import { useRef } from 'react';

import { useIsEllipsisActive } from '@/shared/hooks/useIsEllipsisActive/useIsEllipsisActive';
import { Skeleton } from '@/shared/UIKit/Skeleton/Skeleton';
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
      {isLoading ? <Skeleton className="h-[1.2rem] w-[8rem]" /> : name}
    </div>
  );
};
