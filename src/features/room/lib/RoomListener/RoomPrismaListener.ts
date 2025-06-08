import type { Channel } from 'pusher-js';

import { RoomListener } from '@/features/room/lib/RoomListener/RoomListener';
import { PUSHER_EVENTS } from '@/shared/pusher/config/PUSHER_EVENTS';
import { pusherClient } from '@/shared/pusher/lib/pusherClient';
import type { PusherNewMember } from '@/shared/types/pusher/pusher';
import type { RoomContextType } from '@/widgets/Room/model/RoomContext';

export class RoomPrismaListener extends RoomListener {
  pusherClient = pusherClient();

  channel: Channel;

  constructor(roomId: string) {
    super();
    this.channel = this.pusherClient.subscribe(roomId);
    this.onMemberAdded()
      .onVoted()
      .onVoted()
      .onResetVotes()
      .onRevealVotes()
      .onGameCreated()
      .onMemberRemoved();

    this.unsubscribeListener.push(() => this.pusherClient.unsubscribe(roomId));
  }

  private onMemberAdded() {
    this.channel.bind(PUSHER_EVENTS.MEMBER_ADDED, () =>
      this.emit('memberAdded'),
    );
    return this;
  }

  private onMemberRemoved() {
    this.channel.bind(PUSHER_EVENTS.MEMBER_REMOVED, (parameters: PusherNewMember) =>
      this.emit('memberRemoved', parameters),
    );
    return this;
  }

  private onVoted() {
    this.channel.bind(PUSHER_EVENTS.VOTED, (parameters: { userId: string }) =>
      this.emit('voted', parameters),
    );
    return this;
  }

  private onResetVotes() {
    this.channel.bind(PUSHER_EVENTS.RESET_VOTES, () => this.emit('resetVotes'));
    return this;
  }

  private onRevealVotes() {
    this.channel.bind(PUSHER_EVENTS.REVEAL_VOTES, () =>
      this.emit('revealVotes'),
    );
    return this;
  }

  private onGameCreated() {
    this.channel.bind(
      PUSHER_EVENTS.GAME_CREATED,
      (parameters: RoomContextType['game']) => this.emit('gameCreated', parameters),
    );
    return this;
  }
}
