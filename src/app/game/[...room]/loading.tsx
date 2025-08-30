import { Skeleton } from '@/shared/UIKit/skeleton/skeleton';
import { Member } from '@/widgets/member/ui/member';
import { GameContainer } from '@/widgets/room/ui/game/game-container/game-container';
import { MemberContainer } from '@/widgets/room/ui/members-container/member-container';

export default function RoomLoading() {
  return (
    <GameContainer>
      <MemberContainer place="top">
        <Member id="1" name="John Doe" isLoading />
      </MemberContainer>
      <MemberContainer place="left" isVertical>
        <Member id="2" name="Megan Fox" isLoading />
      </MemberContainer>
      <Skeleton className="h-[10rem]" />
      <MemberContainer place="right" isVertical>
        <Member id="3" name="Superman" isLoading />
      </MemberContainer>
      <MemberContainer place="bottom">
        <Member id="4" name="Marco" isLoading />
      </MemberContainer>
    </GameContainer>
  );
}
