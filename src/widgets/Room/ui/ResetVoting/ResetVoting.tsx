import { useTranslations } from 'next-intl';
import { useAction } from 'next-safe-action/hooks';

import { useCountdown } from '@/shared/hooks/useCountdown/useCountdown';
import { Button } from '@/shared/UIKit/Button/Button';
import { resetVotes } from '@/widgets/Room/actions/resetVotes';
import { useRoomContext } from '@/widgets/Room/model/RoomContext';
import { useIsFinishedGame } from '@/widgets/Room/model/selectors/useIsFinishedGame';

export const ResetVoting = () => {
  const isFinishedGame = useIsFinishedGame();
  const t = useTranslations('Room');
  const { counter } = useCountdown({ time: 3000, enabled: !isFinishedGame });
  const isCounter = counter > 0;
  const {
    room: { roomId },
  } = useRoomContext();

  const { execute } = useAction(resetVotes);

  return (
    <div>
      <Button
        variant="secondary"
        disabled={isCounter}
        onClick={() => {
          execute({
            channelName: roomId,
          });
        }}
      >
        <span>
          {t('reset.button')} {isCounter && `(${counter})`}
        </span>
      </Button>
    </div>
  );
};
