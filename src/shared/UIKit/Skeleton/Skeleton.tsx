import type { HTMLAttributes } from 'react';

import { renderClass } from '@/shared/utils/renderClass/render-class';

function Skeleton({ className, ...properties }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={renderClass(
        'animate-pulse rounded-md bg-gray-400/10',
        className,
      )}
      {...properties}
    />
  );
}

export { Skeleton };
