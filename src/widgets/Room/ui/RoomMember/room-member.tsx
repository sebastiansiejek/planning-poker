import { useSession } from 'next-auth/react';

import { Member } from '@/widgets/Member/ui/member';
import type { MemberProperties } from '@/widgets/Room/ui/RoomMember/types';

export const RoomMember = (properties: MemberProperties) => {
  const { id } = properties;
  const { data: session } = useSession();
  const isActionTooltip = session?.user.id !== id;

  return <Member {...properties} isActionTooltip={isActionTooltip} />;
};
