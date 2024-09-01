import Skeleton from 'react-loading-skeleton';

import { Member } from '@/widgets/Member/ui/Member';
import { GameContainer } from '@/widgets/room/ui/Game/GameContainer/GameContainer';
import { MembersContainer } from '@/widgets/room/ui/MembersContainer/MembersContainer';

export default function RoomLoading() {
  return (
    <GameContainer>
      <MembersContainer place="top">
        <Member id="asfa" name="xv" isLoading />
      </MembersContainer>
      <MembersContainer place="left" isVertical>
        <Member id="asfa" name="xv" isLoading />
      </MembersContainer>
      <Skeleton count={1} height={100} />
      <MembersContainer place="right" isVertical>
        <Member id="asfa" name="xv" isLoading />
      </MembersContainer>
      <MembersContainer place="bottom">
        <Member id="asfa" name="xv" isLoading />
      </MembersContainer>
    </GameContainer>
  );
}
