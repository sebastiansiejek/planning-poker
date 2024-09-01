import type { ILoader } from '@/types/types';
import type { MemberProps } from '@/widgets/room/ui/RoomMember/types';

export type MemberAvatarProps = Pick<MemberProps, 'avatarUrl'> & ILoader;
