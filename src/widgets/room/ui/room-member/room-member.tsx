import { Member } from '@/widgets/member/ui/member';
import { useRoomContext } from '@/widgets/room/model/room-context';
import type { MemberProperties } from '@/widgets/room/ui/room-member/types';

export const RoomMember = (properties: MemberProperties) => {
  const { id } = properties;
  const { room } = useRoomContext();
  const isActionTooltip = room.participantId !== id;

  return <Member {...properties} isActionTooltip={isActionTooltip} canKick={room.isOwner} />;
};
