import type { Channel } from 'pusher-js';

import { PusherEvents } from '@/shared/pusher/config/pusher-events';
import { pusherClient } from '@/shared/pusher/lib/pusher-client';
import type { PusherNotification } from '@/shared/types/pusher/pusher';
import type { TriggerPaperThrowingParameters } from '@/widgets/room/actions/alerts/trigger-paper-throwing';

export class RoomPusherNotificationsListener {
  pusherClient = pusherClient();

  channel: Channel;

  constructor(roomId: string) {
    this.channel = this.pusherClient.subscribe(roomId);
  }

  onAlarm(currentUserId: string, callback: () => void) {
    this.channel.bind(
      PusherEvents.USER_ID(currentUserId),
      async (data: PusherNotification) => {
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
    this.channel.bind(
      PusherEvents.PAPER_THROWN,
      ({ targetUser, triggerUser }: TriggerPaperThrowingParameters) => {
        callback({ targetUser, triggerUser });
      },
    );
    return this;
  }
}
