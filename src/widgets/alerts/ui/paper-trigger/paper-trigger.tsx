import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useAction } from 'next-safe-action/hooks';
import { useTransition } from 'react';

import { ButtonIcon } from '@/shared/ui-kit/button/button-icon/button-icon';
import type { PaperTriggerProperties } from '@/widgets/alerts/ui/paper-trigger/types';
import { triggerPaperThrowing } from '@/widgets/room/actions/alerts/trigger-paper-throwing';

export const PaperTrigger = ({ userId, memberRef }: PaperTriggerProperties) => {
  const t = useTranslations('Member');
  const [pendingNotification, startNotificationTransition] = useTransition();
  const parameters = useParams();

  if (parameters.room === undefined) {
    throw new Error('Room param is not defined');
  }

  const roomId = parameters.room.toString();
  const { execute } = useAction(triggerPaperThrowing);
  const { data } = useSession();

  if (!data) return null;
  const { id: currentUserId } = data.user;

  return (
    <ButtonIcon
      aria-label={t('notification.notice')}
      type="button"
      disabled={pendingNotification}
      onClick={() => {
        startNotificationTransition(async () => {
          const rect = memberRef.current?.getBoundingClientRect();

          if (rect) {
            execute({
              channelName: roomId,
              targetUser: {
                id: userId,
              },
              triggerUser: {
                id: currentUserId,
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
