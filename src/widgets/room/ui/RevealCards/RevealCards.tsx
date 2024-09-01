import { useTranslations } from 'next-intl';

import { Button } from '@/shared/UIKit/Button/Button';
import { revealCards } from '@/widgets/room/actions/revealCards';
import type { RevealCardsProps } from '@/widgets/room/ui/RevealCards/types';

export const RevealCards = ({ voteValue, channelName }: RevealCardsProps) => {
  const t = useTranslations('Room');

  return (
    <form action={revealCards}>
      <input type="hidden" name="voteValue" defaultValue={voteValue} />
      <input type="hidden" name="channelName" defaultValue={channelName} />
      <Button
        type="submit"
        variant="secondary"
        data-testid="reveal-cards-button"
      >
        {t('reveal.button')}
      </Button>
    </form>
  );
};
