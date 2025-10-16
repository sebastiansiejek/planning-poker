import type { MembersProperties } from '@/widgets/room/ui/members/members.types';
import { MemberContainer } from '@/widgets/room/ui/members-container/member-container';
import { RoomMember } from '@/widgets/room/ui/room-member/room-member';

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
