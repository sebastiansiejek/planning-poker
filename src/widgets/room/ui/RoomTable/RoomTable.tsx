import { ResetVoting } from '@/features/room/ResetVoting/ResetVoting';
import { RevealCards } from '@/features/room/RevealCards/RevealCards';
import type { RevealCardsProps } from '@/features/room/RevealCards/types';

export const RoomTable = (props: RevealCardsProps) => {
  const { channelName, isRevealedCards } = props;

  return (
    <div className="bg-primary-100 flex items-center justify-center w-full h-full [grid-area:table] rounded p-4 min-w-72">
      {isRevealedCards ? (
        <ResetVoting channelName={channelName} />
      ) : (
        <RevealCards {...props} />
      )}
    </div>
  );
};
