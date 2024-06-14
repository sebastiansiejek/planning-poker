import { cva } from 'class-variance-authority';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useRef, useTransition } from 'react';
import { MdNotificationsNone } from 'react-icons/md';

import { notifyUserByPusher } from '@/app/actions/notifyUserByPusher';
import { Avatar } from '@/shared/UIKit/Avatar/Avatar';
import type { MemberProps } from '@/widgets/room/ui/Member/types';

export const Member = ({
  id,
  name,
  isVoted,
  vote,
  isRevealedCards,
  avatarUrl,
}: MemberProps) => {
  // const { notify } = useNotification();
  // TODO: get params from context
  const params = useParams();
  const t = useTranslations('Member');
  const memberRef = useRef<HTMLDivElement>(null);
  // const [scope, animate] = useAnimate();

  // useEffect(() => {
  //   const member = memberRef.current;
  //
  //   if (member && scope) {
  //     const position = member.getBoundingClientRect();
  //
  //     animate(
  //       scope.current,
  //       {
  //         transformOrigin: 'center',
  //         translateX: position.left,
  //         translateY: position.top,
  //       },
  //       {
  //         duration: 1.2,
  //         repeat: Infinity,
  //         ease: 'linear',
  //       },
  //     );
  //     animate(
  //       scope.current,
  //       {
  //         rotate: 360,
  //       },
  //       {
  //         duration: 0.5,
  //         repeat: Infinity,
  //         ease: 'linear',
  //       },
  //     );
  //   }
  // }, [animate, scope]);
  const [pendingNotification, startNotificationTransition] = useTransition();

  return (
    <div
      className="flex items-center flex-col min-w-16 min-h-28 text-center"
      ref={memberRef}
    >
      <div className="flex gap-1">
        <button
          aria-label={t('notification.trigger')}
          type="button"
          className="transition hover:text-primary-500"
          disabled={pendingNotification}
          onClick={() => {
            // notify(t('notification.notice'));
            startNotificationTransition(() => {
              const formData = new FormData();
              formData.append('channelName', `presence-${params.room}`);
              formData.append('userId', id);
              formData.append('type', 'alarm');
              notifyUserByPusher(formData);
            });
          }}
        >
          <MdNotificationsNone />
        </button>
        {/* <Image */}
        {/*  className="cursor-pointer" */}
        {/*  src="/paper.png" */}
        {/*  alt="paper" */}
        {/*  width={20} */}
        {/*  height={20} */}
        {/* /> */}
        {/* <Image */}
        {/*  className="fixed z-50 left-0 top-0" */}
        {/*  src="/paper.png" */}
        {/*  alt="paper" */}
        {/*  width={20} */}
        {/*  height={20} */}
        {/*  ref={scope} */}
        {/* /> */}
      </div>
      <div
        key={id}
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
