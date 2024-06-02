import { revealCards } from '@/app/actions/revealCards';
import type { RevealCardsProps } from '@/features/room/RevealCards/types';
import { Button } from '@/shared/UIKit/Button/Button';

export const RevealCards = ({
  meId,
  voteValue,
  channelName,
}: RevealCardsProps) => {
  return (
    <form action={revealCards}>
      <input type="hidden" name="userId" defaultValue={meId} />
      <input type="hidden" name="voteValue" defaultValue={voteValue} />
      <input type="hidden" name="channelName" defaultValue={channelName} />
      <Button type="submit">Reveal cards</Button>
    </form>
  );
};
