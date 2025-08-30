'use client';

import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

import { useFormField } from '@/shared/UIKit/form/model/useFormField/use-form-field';
import { renderClass } from '@/shared/utils/render-class/render-class';

const labelVariants = cva(
  'block text-sm mb-2 font-medium cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
);

const FormLabel = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...properties }, reference) => {
  const { error, formItemId } = useFormField();

  return (
    <LabelPrimitive.Root
      ref={reference}
      className={renderClass(
        error && 'text-destructive',
        labelVariants(),
        className,
      )}
      htmlFor={formItemId}
      {...properties}
    />
  );
});

FormLabel.displayName = LabelPrimitive.Root.displayName;

export { FormLabel };
