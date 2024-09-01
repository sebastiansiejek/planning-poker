import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { MdNotificationsNone } from 'react-icons/md';

import { ButtonIcon } from '@/shared/UIKit/Button/ButtonIcon/ButtonIcon';
import type { AlarmTriggerProps } from '@/widgets/alerts/ui/AlarmTrigger/types';
import { notifyUserByPusher } from '@/widgets/room/actions/notifyUserByPusher';

export const AlarmTrigger = ({ userId }: AlarmTriggerProps) => {
  const t = useTranslations('Member');
  const [pendingNotification, startNotificationTransition] = useTransition();
  const params = useParams();

  return (
    <ButtonIcon
      aria-label={t('notification.trigger')}
      type="button"
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
      icon={<MdNotificationsNone />}
    />
  );
};
