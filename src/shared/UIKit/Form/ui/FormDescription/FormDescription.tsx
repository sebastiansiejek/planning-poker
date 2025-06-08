import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { useFormField } from '@/shared/UIKit/Form/model/useFormField/useFormField';
import { renderClass } from '@/shared/utils/renderClass/renderClass';

const FormDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...properties }, reference) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={reference}
      id={formDescriptionId}
      className={renderClass('text-[0.8rem] text-muted-foreground', className)}
      {...properties}
    />
  );
});
FormDescription.displayName = 'FormDescription';

export { FormDescription };
