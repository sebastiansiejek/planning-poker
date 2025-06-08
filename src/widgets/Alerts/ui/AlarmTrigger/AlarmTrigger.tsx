import { Bell } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAction } from 'next-safe-action/hooks';

import { ButtonIcon } from '@/shared/UIKit/Button/ButtonIcon/ButtonIcon';
import type { AlarmTriggerProps } from '@/widgets/Alerts/ui/AlarmTrigger/types';
import { notifyUserByPusher } from '@/widgets/Room/actions/notifyUserByPusher';

export const AlarmTrigger = ({ userId }: AlarmTriggerProps) => {
  const t = useTranslations('Member');
  const parameters = useParams();

  if (parameters.room === undefined) {
    throw new Error('Room param is not defined');
  }

  const roomId = parameters.room.toString();
  const { execute, isPending } = useAction(notifyUserByPusher);

  return (
    <ButtonIcon
      aria-label={t('notification.trigger')}
      type="button"
      disabled={isPending}
      onClick={() => {
        execute({ userId, channelName: roomId, type: 'alarm' });
      }}
      icon={<Bell />}
    />
  );
};
