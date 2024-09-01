import { Member } from '@/widgets/Member/Member';
import { useRoomContext } from '@/widgets/room/model/RoomContext';
import type { MemberProps } from '@/widgets/room/ui/RoomMember/types';

export const RoomMember = (props: MemberProps) => {
  const { id } = props;
  const { room } = useRoomContext();

  return <Member {...props} isActionTooltip={room?.currentUserId !== id} />;
};
