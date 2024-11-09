import type { MembersProps } from '@/widgets/Room/ui/Members/Members.types';
import { MembersContainer } from '@/widgets/Room/ui/MembersContainer/MembersContainer';
import { RoomMember } from '@/widgets/Room/ui/RoomMember/RoomMember';

export const Members = ({
  members,
  votedUserIds = [],
  votes = [],
  isRevealedCards,
  place,
  isVertical,
}: MembersProps) => {
  if (members.length === 0) {
    return null;
  }

  return (
    <MembersContainer place={place} isVertical={isVertical}>
      {members.map((member) => {
        const { id } = member;
        // @ts-ignore
        const isVoted = votedUserIds.includes(id);
        const vote = votes.find((oldVotes) => oldVotes.userId === id)?.vote;

        return (
          // @ts-ignore
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
