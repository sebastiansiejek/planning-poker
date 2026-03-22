import type { TextareaHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { renderClass } from '@/shared/utils/render-class/render-class';

export type TextareaProperties = TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProperties>(
  ({ className, style, ...properties }, reference) => {
    return (
      <textarea
        className={renderClass(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={reference}
        style={{ resize: 'none', ...style }}
        {...properties}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
