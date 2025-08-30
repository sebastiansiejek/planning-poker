import type { Channel } from 'pusher-js';

import { RoomListener } from '@/features/room/lib/RoomListener/room-listener';
import { PusherEvents } from '@/shared/pusher/config/pusher-events';
import { pusherClient } from '@/shared/pusher/lib/pusher-client';
import type { PusherNewMember } from '@/shared/types/pusher/pusher';
import type { RoomContextType } from '@/widgets/room/model/room-context';

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
    this.channel.bind(PusherEvents.MEMBER_ADDED, () =>
      this.emit('memberAdded'),
    );
    return this;
  }

  private onMemberRemoved() {
    this.channel.bind(PusherEvents.MEMBER_REMOVED, (parameters: PusherNewMember) =>
      this.emit('memberRemoved', parameters),
    );
    return this;
  }

  private onVoted() {
    this.channel.bind(PusherEvents.VOTED, (parameters: { userId: string }) =>
      this.emit('voted', parameters),
    );
    return this;
  }

  private onResetVotes() {
    this.channel.bind(PusherEvents.RESET_VOTES, () => this.emit('resetVotes'));
    return this;
  }

  private onRevealVotes() {
    this.channel.bind(PusherEvents.REVEAL_VOTES, () =>
      this.emit('revealVotes'),
    );
    return this;
  }

  private onGameCreated() {
    this.channel.bind(
      PusherEvents.GAME_CREATED,
      (parameters: RoomContextType['game']) => this.emit('gameCreated', parameters),
    );
    return this;
  }
}
