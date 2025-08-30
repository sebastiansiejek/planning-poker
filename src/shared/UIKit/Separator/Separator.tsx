import { Root } from '@radix-ui/react-separator';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

import { renderClass } from '@/shared/utils/render-class/render-class';

const Separator = forwardRef<
  ElementRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root>
>(
  (
    { className, orientation = 'horizontal', decorative = true, ...properties },
    reference,
  ) => (
    <Root
      ref={reference}
      decorative={decorative}
      orientation={orientation}
      className={renderClass(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className,
      )}
      {...properties}
    />
  ),
);
Separator.displayName = Root.displayName;

export { Separator };
