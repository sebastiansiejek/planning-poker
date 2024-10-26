import { useSession } from 'next-auth/react';

import { Member } from '@/widgets/Member/ui/Member';
import type { MemberProps } from '@/widgets/Room/ui/RoomMember/types';

export const RoomMember = (props: MemberProps) => {
  const { id } = props;
  const { data: session } = useSession();
  const isActionTooltip = session?.user.id !== id;

  return <Member {...props} isActionTooltip={isActionTooltip} />;
};
