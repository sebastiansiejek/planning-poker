import type { RealtimeNewMember } from '@/shared/types/realtime/realtime';
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
  memberAdded: (parameters: RealtimeNewMember) => void;
  memberRemoved: (parameters: RealtimeNewMember) => void;
  revealVotes: () => void;
  resetVotes: () => void;
};
