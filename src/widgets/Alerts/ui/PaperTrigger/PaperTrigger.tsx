import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAction } from 'next-safe-action/hooks';
import { useTransition } from 'react';

import { ButtonIcon } from '@/shared/UIKit/Button/ButtonIcon/ButtonIcon';
import type { PaperTriggerProps } from '@/widgets/Alerts/ui/PaperTrigger/types';
import { triggerPaperThrowing } from '@/widgets/Room/actions/alerts/triggerPaperThrowing';
import { useRoomContext } from '@/widgets/Room/model/RoomContext';

export const PaperTrigger = ({ userId, memberRef }: PaperTriggerProps) => {
  const t = useTranslations('Member');
  const [pendingNotification, startNotificationTransition] = useTransition();
  const params = useParams();
  const { room } = useRoomContext();
  const roomId = params.room.toString();
  const { execute } = useAction(triggerPaperThrowing);

  return (
    <ButtonIcon
      aria-label={t('notification.notice')}
      type="button"
      disabled={pendingNotification}
      onClick={() => {
        startNotificationTransition(async () => {
          const rect = memberRef.current?.getBoundingClientRect();

          if (rect && room?.currentUserId) {
            execute({
              channelName: roomId,
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
