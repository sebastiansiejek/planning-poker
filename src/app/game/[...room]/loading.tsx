import { Skeleton } from '@/shared/UIKit/Skeleton/skeleton';
import { Member } from '@/widgets/Member/ui/member';
import { GameContainer } from '@/widgets/Room/ui/Game/GameContainer/game-container';
import { MemberContainer } from '@/widgets/Room/ui/MembersContainer/member-container';

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
