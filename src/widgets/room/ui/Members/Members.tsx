import { cva } from 'class-variance-authority';

import type { PusherMember } from '@/types/pusher/pusher';
import { Member } from '@/widgets/room/ui/Member/Member';

export const Members = ({
  members,
  place,
  votedUserIds = [],
  isVertical,
}: {
  members: PusherMember[];
  place: 'top' | 'left' | 'right' | 'bottom';
  votedUserIds: string[];
  isVertical?: boolean;
}) => {
  return (
    <div
      className={cva('flex gap-8 h-full p-6 justify-center', {
        variants: {
          place: {
            top: '[grid-area:top]',
            left: '[grid-area:left]',
            right: '[grid-area:right]',
            bottom: '[grid-area:bottom]',
          },
          isVertical: {
            true: 'flex-col',
            false: 'flex-row',
          },
        },
      })({ place, isVertical })}
    >
      {members.map((member) => {
        const isVoted = votedUserIds.includes(member.id);

        return <Member key={member.id} isVoted={isVoted} {...member} />;
      })}
    </div>
  );
};
