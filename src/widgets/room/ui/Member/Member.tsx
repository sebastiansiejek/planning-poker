import { cva } from 'class-variance-authority';
import { useRef } from 'react';

import { AlarmTrigger } from '@/app/alerts/widgets/AlarmTrigger/AlarmTrigger';
import { PaperTrigger } from '@/app/alerts/widgets/PaperTrigger/PaperTrigger';
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
  const memberRef = useRef<HTMLDivElement>(null);
  const { room } = useRoomContext();

  return (
    <div
      className="flex items-center flex-col min-w-16 min-h-28 text-center relative z-30"
      ref={memberRef}
    >
      {room?.currentUserId !== id && (
        <div className="flex gap-1">
          <AlarmTrigger userId={id} />
          <PaperTrigger userId={id} memberRef={memberRef} />
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
