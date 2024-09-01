import Skeleton from 'react-loading-skeleton';

import { Member } from '@/widgets/Member/ui/Member';
import { GameContainer } from '@/widgets/Room/ui/Game/GameContainer/GameContainer';
import { MembersContainer } from '@/widgets/Room/ui/MembersContainer/MembersContainer';

export default function RoomLoading() {
  return (
    <GameContainer>
      <MembersContainer place="top">
        <Member id="1" name="John Doe" isLoading />
      </MembersContainer>
      <MembersContainer place="left" isVertical>
        <Member id="2" name="Megan Fox" isLoading />
      </MembersContainer>
      <Skeleton count={1} height={100} />
      <MembersContainer place="right" isVertical>
        <Member id="3" name="Superman" isLoading />
      </MembersContainer>
      <MembersContainer place="bottom">
        <Member id="4" name="Marco" isLoading />
      </MembersContainer>
    </GameContainer>
  );
}
