import type { PusherNewMember } from '@/shared/types/pusher/pusher';
import type { RoomContextType } from '@/widgets/room/model/room-context';

export type RoomEvents =
  | 'gameCreated'
  | 'voted'
  | 'memberAdded'
  | 'revealVotes'
  | 'resetVotes'
  | 'memberRemoved';

export type RoomEventHandlers = {
  gameCreated: (data: RoomContextType['game']) => void;
  voted: (parameters: { userId: string }) => void;
  memberAdded: (parameters: PusherNewMember) => void;
  memberRemoved: (parameters: PusherNewMember) => void;
  revealVotes: () => void;
  resetVotes: () => void;
};
