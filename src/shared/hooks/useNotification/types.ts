export type UseNotificationOptions = NotificationOptions & {
  onClose?: (this: Notification, ev: Event) => void;
  onClick?: (this: Notification, ev: Event) => void;
  onError?: (this: Notification, ev: Event) => void;
  onShow?: (this: Notification, ev: Event) => void;
};
