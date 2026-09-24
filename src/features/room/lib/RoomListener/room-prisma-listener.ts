import { RoomListener } from '@/features/room/lib/RoomListener/room-listener';
import { RealtimeEvents, RealtimeTopics } from '@/shared/realtime/config/realtime-events';
import { getSupabaseRealtimeClient } from '@/shared/realtime/lib/supabase-realtime-client';
import type { RealtimeNewMember } from '@/shared/types/realtime/realtime';
import type { RoomContextType } from '@/widgets/room/model/room-context';

export class RoomPrismaListener extends RoomListener {
  private readonly supabase = getSupabaseRealtimeClient();
  private readonly channel;

  constructor(private readonly roomId: string) {
    super();
    this.channel = this.supabase.channel(RealtimeTopics.roomEvents(roomId));
    this.onMemberAdded()
      .onMemberUpdated()
      .onVoted()
      .onRevealVotes()
      .onGameCreated()
      .onMemberRemoved();

    this.unsubscribeListener.push(() => {
      void this.supabase.removeChannel(this.channel);
    });
  }

  connect() {
    this.channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') this.emit('ready');
    });
  }

  private onMemberAdded() {
    this.channel.on(
      'broadcast',
      { event: RealtimeEvents.MEMBER_ADDED },
      ({ payload }) => this.emit('memberAdded', payload as RealtimeNewMember),
    );
    return this;
  }

  private onMemberUpdated() {
    this.channel.on(
      'broadcast',
      { event: RealtimeEvents.MEMBER_UPDATED },
      ({ payload }) => this.emit('memberUpdated', payload as { id: string; name: string }),
    );
    return this;
  }

  private onMemberRemoved() {
    this.channel.on(
      'broadcast',
      { event: RealtimeEvents.MEMBER_REMOVED },
      ({ payload }) => this.emit('memberRemoved', payload as RealtimeNewMember),
    );
    return this;
  }

  private onVoted() {
    this.channel.on(
      'broadcast',
      { event: RealtimeEvents.VOTED },
      ({ payload }) => this.emit('voted', payload as { participantId: string }),
    );
    return this;
  }

  private onRevealVotes() {
    this.channel.on('broadcast', { event: RealtimeEvents.REVEAL_VOTES }, () =>
      this.emit('revealVotes'),
    );
    return this;
  }

  private onGameCreated() {
    this.channel.on(
      'broadcast',
      { event: RealtimeEvents.GAME_CREATED },
      ({ payload }) =>
        this.emit(
          'gameCreated',
          payload as RoomContextType['game'],
        ),
    );
    return this;
  }
}
