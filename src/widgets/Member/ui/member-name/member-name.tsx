'use client';

import { useRef } from 'react';

import { useIsEllipsisActive } from '@/shared/hooks/useIsEllipsisActive/use-is-ellipsis-active';
import { Skeleton } from '@/shared/UIKit/skeleton/skeleton';
import type { MemberNameProperties } from '@/widgets/member/ui/member-name/types';

export const MemberName = ({ name, isLoading }: MemberNameProperties) => {
  const reference = useRef<HTMLDivElement>(null);
  const isEllipsisActive = useIsEllipsisActive(reference);

  return (
    <div
      className="font-semibold mt-2 line-clamp-1"
      ref={reference}
      {...(isEllipsisActive && { title: name })}
    >
      {isLoading ? <Skeleton className="h-[1.2rem] w-[8rem]" /> : name}
    </div>
  );
};
