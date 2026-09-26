'use client';

import { useTranslations } from 'next-intl';

import { useToast } from '@/shared/ui-kit/toast/model/use-toast';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/shared/ui-kit/toast/ui/toast';

export function Toaster() {
  const translate = useTranslations('Common');
  const { toasts } = useToast();

  return (
    <ToastProvider label={translate('notifications')}>
      {toasts.map(({ id, title, description, action, ...properties }) => {
        return (
          <Toast key={id} {...properties}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose aria-label={translate('close')} />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
