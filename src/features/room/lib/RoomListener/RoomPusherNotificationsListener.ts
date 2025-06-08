import type { Channel } from 'pusher-js';

import { PUSHER_EVENTS } from '@/shared/pusher/config/PUSHER_EVENTS';
import { pusherClient } from '@/shared/pusher/lib/pusherClient';
import type { PusherNotification } from '@/shared/types/pusher/pusher';
import type { TriggerPaperThrowingParameters } from '@/widgets/Room/actions/alerts/triggerPaperThrowing';

export class RoomPusherNotificationsListener {
  pusherClient = pusherClient();

  channel: Channel;

  constructor(roomId: string) {
    this.channel = this.pusherClient.subscribe(roomId);
  }

  onAlarm(currentUserId: string, callback: Function) {
    this.channel.bind(
      PUSHER_EVENTS.USER_ID(currentUserId),
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
      PUSHER_EVENTS.PAPER_THROWN,
      ({ targetUser, triggerUser }: TriggerPaperThrowingParameters) => {
        callback({ targetUser, triggerUser });
      },
    );
    return this;
  }
}
