export type UseNotificationOptions = NotificationOptions & {
  onClose?: (this: Notification, event_: Event) => void;
  onClick?: (this: Notification, event_: Event) => void;
  onError?: (this: Notification, event_: Event) => void;
  onShow?: (this: Notification, event_: Event) => void;
};
