import type { SupabaseClient } from '@supabase/supabase-js';

import { RealtimeEvents, RealtimeTopics } from '@/shared/realtime/config/realtime-events';
import type { RealtimeNotification } from '@/shared/types/realtime/realtime';
import type { TriggerPaperThrowingParameters } from '@/widgets/room/actions/alerts/trigger-paper-throwing';

export class RoomSupabaseNotificationsListener {
  private readonly channel;

  constructor(private readonly roomId: string, private readonly supabase: SupabaseClient) {
    this.channel = this.supabase.channel(
      RealtimeTopics.roomNotifications(roomId),
      { config: { private: true } },
    );
  }

  connect(onReady: () => void, onDisconnected: () => void) {
    this.channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') onReady();
      else onDisconnected();
    });
  }

  onAlarm(currentUserId: string, callback: () => void) {
    this.channel.on(
      'broadcast',
      { event: RealtimeEvents.USER_ID(currentUserId) },
      async ({ payload }) => {
        const data = payload as RealtimeNotification;
        if (data.type === 'alarm') {
          callback();
          const audio = new Audio('/alarm.mp3');

          if (audio.paused) {
            await audio.play();
          }
        }
      },
    );

    return this;
  }

  onThrownPaper(
    callback: (
      argument: Pick<TriggerPaperThrowingParameters, 'triggerUser' | 'targetUser'>,
    ) => void,
  ) {
    this.channel.on(
      'broadcast',
      { event: RealtimeEvents.PAPER_THROWN },
      ({ payload }) => {
        const { targetUser, triggerUser } =
          payload as TriggerPaperThrowingParameters;
        callback({ targetUser, triggerUser });
      },
    );
    return this;
  }

  unsubscribe() {
    void this.supabase.removeChannel(this.channel);
  }
}
