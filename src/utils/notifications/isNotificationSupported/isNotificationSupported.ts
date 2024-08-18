'use client';

export const isNotificationSupported = () =>
  typeof window !== 'undefined' && 'Notification' in window;
