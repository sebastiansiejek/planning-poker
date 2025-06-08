import { useSession } from 'next-auth/react';

import { Member } from '@/widgets/Member/ui/Member';
import type { MemberProps } from '@/widgets/Room/ui/RoomMember/types';

export const RoomMember = (properties: MemberProps) => {
  const { id } = properties;
  const { data: session } = useSession();
  const isActionTooltip = session?.user.id !== id;

  return <Member {...properties} isActionTooltip={isActionTooltip} />;
};
