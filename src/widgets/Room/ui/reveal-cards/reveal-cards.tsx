import { useTranslations } from 'next-intl';
import { useAction } from 'next-safe-action/hooks';

import { Button } from '@/shared/UIKit/button/button';
import { revealCards } from '@/widgets/room/actions/reveal-cards';
import { useRoomContext } from '@/widgets/room/model/room-context';

export const RevealCards = () => {
  const t = useTranslations('Room');
  const { execute, isPending } = useAction(revealCards);
  const {
    room: { roomId, game },
  } = useRoomContext();
  const gameId = game?.id as string;

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
