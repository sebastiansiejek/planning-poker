import { useRoomContext } from '@/widgets/Room/model/RoomContext';
import { CreateGameForm } from '@/widgets/Room/ui/CreateGameForm/CreateGameForm';
import { RevealCards } from '@/widgets/Room/ui/RevealCards/RevealCards';
import type { RoomTableProps } from '@/widgets/Room/ui/RoomTable/RoomTable.types';

export const RoomTable = (props: RoomTableProps) => {
  const { isRevealedCards, areVotes, isWaitingForStartGame } = props;
  const {
    room: { roomId, game },
  } = useRoomContext();

  return (
    <div className="bg-primary-500 flex items-center justify-center w-full h-full [grid-area:table] rounded p-4 min-w-72">
      {areVotes && !isRevealedCards && <RevealCards />}
      {(!game?.id || isRevealedCards) && (
        <CreateGameForm
          roomId={roomId}
          isWaitingForStartGame={isWaitingForStartGame}
        />
      )}
    </div>
  );
};
