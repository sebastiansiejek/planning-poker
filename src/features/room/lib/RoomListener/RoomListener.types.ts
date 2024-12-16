import type { PusherNewMember } from '@/shared/types/pusher/pusher';
import type { Vote } from '@/shared/types/types';
import type { RoomContextType } from '@/widgets/Room/model/RoomContext';

interface IRoomListener {
  onMemberAdded(callback: (params: PusherNewMember) => void): this;

  onMemberRemoved(callback: (params: PusherNewMember) => void): this;

  onVoted(callback: (params: { userId: string }) => void): this;

  onShowVotes(callback: (params: Vote) => void): this;

  onResetVotes(callback: Function): this;

  onRevealVotes(callback: Function): this;

  onGameCreated(callback: (data: RoomContextType['game']) => void): this;
}

export type { IRoomListener };
