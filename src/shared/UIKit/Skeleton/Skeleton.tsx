import type { HTMLAttributes } from 'react';

import { renderClass } from '@/shared/utils/renderClass/renderClass';

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={renderClass(
        'animate-pulse rounded-md bg-gray-400/10',
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
