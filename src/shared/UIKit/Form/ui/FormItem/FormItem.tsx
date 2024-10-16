import type { HTMLAttributes } from 'react';
import { forwardRef, useId } from 'react';

import { FormItemProvider } from '@/shared/UIKit/Form/model/useFormField/useFormField';
import { renderClass } from '@/shared/utils/renderClass/renderClass';

const FormItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = useId();

    return (
      <FormItemProvider value={{ id }}>
        <div
          ref={ref}
          className={renderClass('space-y-2 w-full', className)}
          {...props}
        />
      </FormItemProvider>
    );
  },
);
FormItem.displayName = 'FormItem';

export { FormItem };
