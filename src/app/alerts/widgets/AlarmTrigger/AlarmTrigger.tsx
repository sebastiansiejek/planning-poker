import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { MdNotificationsNone } from 'react-icons/md';

import { notifyUserByPusher } from '@/app/actions/notifyUserByPusher';
import type { AlarmTriggerProps } from '@/app/alerts/widgets/AlarmTrigger/types';

export const AlarmTrigger = ({ userId }: AlarmTriggerProps) => {
  const t = useTranslations('Member');
  const [pendingNotification, startNotificationTransition] = useTransition();
  const params = useParams();

  return (
    <button
      aria-label={t('notification.trigger')}
      type="button"
      className="transition hover:text-primary-500"
      disabled={pendingNotification}
      onClick={() => {
        startNotificationTransition(async () => {
          const formData = new FormData();
          formData.append('channelName', `presence-${params.room}`);
          formData.append('userId', userId);
          formData.append('type', 'alarm');
          await notifyUserByPusher(formData);
        });
      }}
    >
      <MdNotificationsNone />
    </button>
  );
};
