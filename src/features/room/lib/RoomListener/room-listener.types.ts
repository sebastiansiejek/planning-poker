import type { RealtimeNewMember } from '@/shared/types/realtime/realtime';
import type { RoomContextType } from '@/widgets/room/model/room-context';

export type RoomEvents =
  | 'ready'
  | 'disconnected'
  | 'gameCreated'
  | 'voted'
  | 'memberAdded'
  | 'memberUpdated'
  | 'revealVotes'
  | 'memberRemoved';

export type RoomEventHandlers = {
  ready: () => void;
  disconnected: () => void;
  gameCreated: (data: RoomContextType['game']) => void;
  voted: (parameters: { participantId: string }) => void;
  memberAdded: (parameters: RealtimeNewMember) => void;
  memberUpdated: (parameters: { id: string; name: string }) => void;
  memberRemoved: (parameters: RealtimeNewMember) => void;
  revealVotes: () => void;
};
