import { useRoomContext } from '@/widgets/Room/model/RoomContext';
import { CreateGameForm } from '@/widgets/Room/ui/CreateGameForm/CreateGameForm';
import { ResetVoting } from '@/widgets/Room/ui/ResetVoting/ResetVoting';
import { RevealCards } from '@/widgets/Room/ui/RevealCards/RevealCards';
import type { RoomTableProps } from '@/widgets/Room/ui/RoomTable/RoomTable.types';

export const RoomTable = (props: RoomTableProps) => {
  const { isRevealedCards, areVotes } = props;
  const { room } = useRoomContext();

  return (
    <div className="bg-primary-500 flex items-center justify-center w-full h-full [grid-area:table] rounded p-4 min-w-72">
      {areVotes && (isRevealedCards ? <ResetVoting /> : <RevealCards />)}
      {!room?.game?.id && <CreateGameForm roomId={room?.roomId || ''} />}
    </div>
  );
};
