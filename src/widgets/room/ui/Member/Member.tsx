import { cva } from 'class-variance-authority';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useRef, useTransition } from 'react';
import { MdNotificationsNone } from 'react-icons/md';

import { triggerPaperThrowing } from '@/app/actions/notifications/triggerPaperThrowing';
import { notifyUserByPusher } from '@/app/actions/notifyUserByPusher';
import { Avatar } from '@/shared/UIKit/Avatar/Avatar';
import { useRoomContext } from '@/widgets/room/model/RoomContext';
import type { MemberProps } from '@/widgets/room/ui/Member/types';

export const Member = ({
  id,
  name,
  isVoted,
  vote,
  isRevealedCards,
  avatarUrl,
}: MemberProps) => {
  // TODO: get params from context
  const params = useParams();
  const t = useTranslations('Member');
  const [pendingNotification, startNotificationTransition] = useTransition();
  const memberRef = useRef<HTMLDivElement>(null);
  const { room } = useRoomContext();

  return (
    <div
      className="flex items-center flex-col min-w-16 min-h-28 text-center relative z-30"
      ref={memberRef}
    >
      {room?.currentUserId !== id && (
        <div className="flex gap-1">
          <button
            aria-label={t('notification.trigger')}
            type="button"
            className="transition hover:text-primary-500"
            disabled={pendingNotification}
            onClick={() => {
              startNotificationTransition(async () => {
                const formData = new FormData();
                formData.append('channelName', `presence-${params.room}`);
                formData.append('userId', id);
                formData.append('type', 'alarm');
                await notifyUserByPusher(formData);
              });
            }}
          >
            <MdNotificationsNone />
          </button>
          <button
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
                      id,
                    },
                    triggerUser: {
                      id: room.currentUserId,
                    },
                  });
                }
              });
            }}
          >
            <Image
              className="cursor-pointer"
              src="/paper.png"
              alt="paper"
              width={20}
              height={20}
            />
          </button>
        </div>
      )}
      <div
        key={id}
        id={id}
        className={cva(
          'h-20 w-16 flex justify-center items-center rounded border-2 dark:border-gray-800 border-solid text-primary-500 font-bold text-xl',
          {
            variants: {
              isVoted: {
                false: '',
              },
              isRevealedCards: {
                true: '',
              },
            },
            compoundVariants: [
              {
                isVoted: true,
                isRevealedCards: true,
                className: 'border-primary-500',
              },
              {
                isVoted: false,
                isRevealedCards: false,
                className: 'bg-gray-200 dark:bg-gray-800',
              },
              {
                isVoted: true,
                isRevealedCards: false,
                className: 'bg-primary-500',
              },
            ],
          },
        )({ isVoted, isRevealedCards })}
      >
        {isRevealedCards && vote}
      </div>
      {avatarUrl && (
        <div className="mt-2">
          <Avatar url={avatarUrl} size={40} />
        </div>
      )}
      <div className="font-semibold mt-2">{name}</div>
    </div>
  );
};
