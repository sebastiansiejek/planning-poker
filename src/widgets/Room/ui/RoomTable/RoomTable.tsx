import { ResetVoting } from '@/widgets/Room/ui/ResetVoting/ResetVoting';
import { RevealCards } from '@/widgets/Room/ui/RevealCards/RevealCards';
import type { RoomTableProps } from '@/widgets/Room/ui/RoomTable/RoomTable.types';

export const RoomTable = (props: RoomTableProps) => {
  const { isRevealedCards, areVotes } = props;

  return (
    <div className="bg-primary-100 dark:bg-primary-500 flex items-center justify-center w-full h-full [grid-area:table] rounded p-4 min-w-72">
      {areVotes && (isRevealedCards ? <ResetVoting /> : <RevealCards />)}
    </div>
  );
};
