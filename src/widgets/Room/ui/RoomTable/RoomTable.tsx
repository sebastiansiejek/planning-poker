import { ResetVoting } from '@/widgets/Room/ui/ResetVoting/ResetVoting';
import { RevealCards } from '@/widgets/Room/ui/RevealCards/RevealCards';
import type { RevealCardsProps } from '@/widgets/Room/ui/RevealCards/types';

export const RoomTable = (props: RevealCardsProps) => {
  const { channelName, isRevealedCards } = props;

  return (
    <div className="bg-primary-100 dark:bg-primary-500 flex items-center justify-center w-full h-full [grid-area:table] rounded p-4 min-w-72">
      {isRevealedCards ? (
        <ResetVoting channelName={channelName} />
      ) : (
        <RevealCards {...props} />
      )}
    </div>
  );
};
