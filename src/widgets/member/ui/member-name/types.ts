import type { ILoader } from '@/shared/types/types';
import type { MemberProperties } from '@/widgets/room/ui/room-member/types';

export type MemberNameProperties = Pick<MemberProperties, 'name'> & ILoader;
