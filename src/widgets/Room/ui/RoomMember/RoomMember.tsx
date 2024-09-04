import { Member } from '@/widgets/Member/ui/Member';
import { useRoomContext } from '@/widgets/Room/model/RoomContext';
import type { MemberProps } from '@/widgets/Room/ui/RoomMember/types';

export const RoomMember = (props: MemberProps) => {
  const { id } = props;
  const { room } = useRoomContext();

  return <Member {...props} isActionTooltip={room?.currentUserId !== id} />;
};
