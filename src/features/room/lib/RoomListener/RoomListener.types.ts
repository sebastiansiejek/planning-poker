import type { PusherNewMember } from '@/shared/types/pusher/pusher';
import type { RoomContextType } from '@/widgets/Room/model/RoomContext';

export type RoomEvents =
  | 'gameCreated'
  | 'voted'
  | 'memberAdded'
  | 'revealVotes'
  | 'resetVotes'
  | 'memberRemoved';

export type RoomEventHandlers = {
  gameCreated: (data: RoomContextType['game']) => void;
  voted: (params: { userId: string }) => void;
  memberAdded: (params: PusherNewMember) => void;
  memberRemoved: (params: PusherNewMember) => void;
  revealVotes: () => void;
  resetVotes: () => void;
};
