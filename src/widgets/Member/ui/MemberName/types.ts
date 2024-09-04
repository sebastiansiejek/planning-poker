import type { ILoader } from '@/shared/types/types';
import type { MemberProps } from '@/widgets/Room/ui/RoomMember/types';

export type MemberNameProps = Pick<MemberProps, 'name'> & ILoader;
