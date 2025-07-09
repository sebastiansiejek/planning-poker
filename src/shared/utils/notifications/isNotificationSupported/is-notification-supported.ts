'use client';

export const isNotificationSupported = () =>
  globalThis.window !== undefined && 'Notification' in globalThis;
