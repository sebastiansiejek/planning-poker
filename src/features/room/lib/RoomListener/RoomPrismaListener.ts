import type { Channel } from 'pusher-js';

import { PUSHER_EVENTS } from '@/shared/pusher/config/PUSHER_EVENTS';
import { pusherClient } from '@/shared/pusher/lib/pusherClient';
import type { PusherNewMember } from '@/shared/types/pusher/pusher';
import type { Vote } from '@/shared/types/types';
import type { RoomContextType } from '@/widgets/Room/model/RoomContext';

export class RoomPrismaListener {
  pusherClient = pusherClient();

  channel: Channel;

  constructor(roomId: string) {
    this.channel = this.pusherClient.subscribe(roomId);
  }

  onMemberAdded(callback: (params: PusherNewMember) => void) {
    this.channel.bind(PUSHER_EVENTS.MEMBER_ADDED, callback);
    return this;
  }

  onMemberRemoved(callback: (params: PusherNewMember) => void) {
    this.channel.bind(PUSHER_EVENTS.MEMBER_REMOVED, callback);
    return this;
  }

  onVoted(callback: (params: { userId: string }) => void) {
    this.channel.bind(PUSHER_EVENTS.VOTED, callback);
    return this;
  }

  onShowVotes(callback: (params: Vote) => void) {
    this.channel.bind(PUSHER_EVENTS.SHOW_VOTES, callback);
    return this;
  }

  onResetVotes(callback: Function) {
    this.channel.bind(PUSHER_EVENTS.RESET_VOTES, callback);
    return this;
  }

  onRevealVotes(callback: Function) {
    this.channel.bind(PUSHER_EVENTS.REVEAL_VOTES, callback);
    return this;
  }

  onGameCreated(callback: (data: RoomContextType['game']) => void) {
    this.channel.bind(PUSHER_EVENTS.GAME_CREATED, callback);
    return this;
  }
}
