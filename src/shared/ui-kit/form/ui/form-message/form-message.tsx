import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { useFormField } from '@/shared/ui-kit/form/model/useFormField/use-form-field';
import { renderClass } from '@/shared/utils/render-class/render-class';

const FormMessage = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...properties }, reference) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={reference}
      id={formMessageId}
      className={renderClass(
        'form-message text-[0.8rem] font-medium text-destructive',
        className,
      )}
      {...properties}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

export { FormMessage };
