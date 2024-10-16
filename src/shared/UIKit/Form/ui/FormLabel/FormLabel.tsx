'use client';

import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

import { useFormField } from '@/shared/UIKit/Form/model/useFormField/useFormField';
import { renderClass } from '@/shared/utils/renderClass/renderClass';

const labelVariants = cva(
  'text-sm mb-2 font-medium cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
);

const FormLabel = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <LabelPrimitive.Root
      ref={ref}
      className={renderClass(
        error && 'text-destructive',
        labelVariants(),
        className,
      )}
      htmlFor={formItemId}
      {...props}
    />
  );
});

FormLabel.displayName = LabelPrimitive.Root.displayName;

export { FormLabel };
