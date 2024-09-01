import type { MembersProps } from '@/widgets/room/ui/Members/Members.types';
import { MembersContainer } from '@/widgets/room/ui/MembersContainer/MembersContainer';
import { RoomMember } from '@/widgets/room/ui/RoomMember/RoomMember';

export const Members = ({
  members,
  votedUserIds = [],
  votes = [],
  isRevealedCards,
  place,
  isVertical,
}: MembersProps) => {
  return (
    <MembersContainer place={place} isVertical={isVertical}>
      {members.map((member) => {
        const { id } = member;
        const isVoted = votedUserIds.includes(id);
        const vote = votes.find((oldVotes) => oldVotes.userId === id)?.value;

        return (
          <RoomMember
            key={id}
            isVoted={isVoted}
            vote={vote}
            isRevealedCards={isRevealedCards}
            {...member}
          />
        );
      })}
    </MembersContainer>
  );
};
