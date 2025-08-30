import type { HTMLAttributes } from 'react';
import { forwardRef, useId } from 'react';

import { FormItemProvider } from '@/shared/UIKit/form/model/useFormField/use-form-field';
import { renderClass } from '@/shared/utils/render-class/render-class';

const FormItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...properties }, reference) => {
    const id = useId();

    return (
      <FormItemProvider value={{ id }}>
        <div
          ref={reference}
          className={renderClass('space-y-2 w-full', className)}
          {...properties}
        />
      </FormItemProvider>
    );
  },
);
FormItem.displayName = 'FormItem';

export { FormItem };
