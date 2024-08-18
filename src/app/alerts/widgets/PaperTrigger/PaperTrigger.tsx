import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';

import { triggerPaperThrowing } from '@/app/actions/notifications/triggerPaperThrowing';
import type { PaperTriggerProps } from '@/app/alerts/widgets/PaperTrigger/types';
import { ButtonIcon } from '@/shared/UIKit/Button/ButtonIcon/ButtonIcon';
import { useRoomContext } from '@/widgets/room/model/RoomContext';

export const PaperTrigger = ({ userId, memberRef }: PaperTriggerProps) => {
  const t = useTranslations('Member');
  const [pendingNotification, startNotificationTransition] = useTransition();
  const params = useParams();
  const { room } = useRoomContext();

  return (
    <ButtonIcon
      aria-label={t('notification.notice')}
      type="button"
      className="transition hover:text-primary-500"
      disabled={pendingNotification}
      onClick={() => {
        startNotificationTransition(async () => {
          const rect = memberRef.current?.getBoundingClientRect();

          if (rect && room?.currentUserId) {
            await triggerPaperThrowing({
              channelName: `presence-${params.room}`,
              targetUser: {
                id: userId,
              },
              triggerUser: {
                id: room.currentUserId,
              },
            });
          }
        });
      }}
      icon={
        <Image
          className="cursor-pointer"
          src="/paper.png"
          alt="paper"
          width={20}
          height={20}
        />
      }
    />
  );
};
