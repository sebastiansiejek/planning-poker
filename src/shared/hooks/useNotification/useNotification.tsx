import { useEffect, useRef, useState } from 'react';

import type { UseNotificationOptions } from '@/shared/hooks/useNotification/types';

const useNotification = (options?: UseNotificationOptions) => {
  const [isPermissionGranted, setIsPermissionGranted] = useState<boolean>(
    Notification?.permission === 'granted',
  );
  const notification = useRef<Notification | null>(null);

  const notify = (title: string) => {
    if (isPermissionGranted) {
      notification.current = new Notification(title, options);

      if (typeof options?.onClick === 'function') {
        notification.current.onclick = options?.onClick;
      }

      if (typeof options?.onClose === 'function') {
        notification.current.onclose = options?.onClose;
      }

      if (typeof options?.onError === 'function') {
        notification.current.onerror = options?.onError;
      }

      if (typeof options?.onShow === 'function') {
        notification.current.onshow = options?.onShow;
      }
    }
  };

  const close = () => {
    notification.current?.close();
  };

  useEffect(() => {
    if (!isPermissionGranted) {
      Notification.requestPermission().then((status) =>
        setIsPermissionGranted(status === 'granted'),
      );
    }
  }, [isPermissionGranted, notification, options]);

  return {
    notify,
    close,
  };
};

export default useNotification;
