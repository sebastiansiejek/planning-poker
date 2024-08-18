import { cva } from 'class-variance-authority';

import { Member } from '@/widgets/room/ui/Member/Member';
import type { MembersProps } from '@/widgets/room/ui/Members/Members.types';

export const Members = ({
  members,
  place,
  votedUserIds = [],
  isVertical,
  votes = [],
  isRevealedCards,
}: MembersProps) => {
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
            true: 'lg:flex-col',
            false: 'flex-row',
          },
        },
      })({ place, isVertical })}
    >
      {members.map((member) => {
        const { id } = member;
        const isVoted = votedUserIds.includes(id);
        const vote = votes.find((oldVotes) => oldVotes.userId === id)?.value;

        return (
          <Member
            key={id}
            isVoted={isVoted}
            vote={vote}
            isRevealedCards={isRevealedCards}
            {...member}
          />
        );
      })}
    </div>
  );
};
