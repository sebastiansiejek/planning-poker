import { useTranslations } from 'next-intl';
import { useAction } from 'next-safe-action/hooks';

import { Button } from '@/shared/UIKit/Button/Button';
import { revealCards } from '@/widgets/Room/actions/revealCards';
import { useRoomContext } from '@/widgets/Room/model/RoomContext';

export const RevealCards = () => {
  const t = useTranslations('Room');
  const { execute, isPending } = useAction(revealCards);
  const { room } = useRoomContext();
  const gameId = room?.game?.id as string;
  const roomId = room?.roomId as string;

  return (
    <Button
      onClick={() => execute({ gameId, roomId })}
      type="submit"
      variant="secondary"
      data-testid="reveal-cards-button"
      isLoading={isPending}
    >
      {t('reveal.button')}
    </Button>
  );
};
