import type { MembersProperties } from '@/widgets/Room/ui/Members/members.types';
import { MemberContainer } from '@/widgets/Room/ui/MembersContainer/member-container';
import { RoomMember } from '@/widgets/Room/ui/RoomMember/RoomMember';

export const Members = ({
  members,
  votedUserIds = [],
  votes = [],
  isRevealedCards,
  place,
  isVertical,
}: MembersProperties) => {
  if (members.length === 0) {
    return null;
  }

  return (
    <MemberContainer place={place} isVertical={isVertical}>
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
    </MemberContainer>
  );
};
