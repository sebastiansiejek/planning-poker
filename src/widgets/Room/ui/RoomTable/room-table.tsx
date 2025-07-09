import { useRoomContext } from '@/widgets/Room/model/room-context';
import { CreateGameForm } from '@/widgets/Room/ui/CreateGameForm/create-game-form';
import { RevealCards } from '@/widgets/Room/ui/RevealCards/reveal-cards';
import type { RoomTableProperties } from '@/widgets/Room/ui/RoomTable/room-table.types';

export const RoomTable = (properties: RoomTableProperties) => {
  const { isRevealedCards, areVotes, isWaitingForStartGame } = properties;
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
