import { useRoomContext } from '@/widgets/room/model/room-context';
import { CreateGameForm } from '@/widgets/room/ui/create-game-form/create-game-form';
import { RevealCards } from '@/widgets/room/ui/reveal-cards/reveal-cards';
import type { RoomTableProperties } from '@/widgets/room/ui/room-table/room-table.types';

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
