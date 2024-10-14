import type { RoomProps } from '@/app/game/[...room]/types';
import { Heading } from '@/shared/UIKit/Heading/Heading';
import { Paragraph } from '@/shared/UIKit/Paragraph/Paragraph';
import { CreateGameForm } from '@/widgets/Room/ui/CreateGameForm/CreateGameForm';

export const RoomSidebar = ({
  name,
  id,
  activeGame,
}: Pick<RoomProps, 'activeGame' | 'id' | 'name'>) => {
  const { name: gameName, description: gameDescription } = activeGame || {};

  return (
    <div>
      <Heading variant="h1">{name}</Heading>
      <hr className="mt-3 mb-4" />
      {!activeGame && <CreateGameForm roomId={id} />}
      {activeGame && (gameName || gameDescription) && (
        <div>
          {gameName && <Heading variant="h2">{gameName}</Heading>}
          {gameDescription && <Paragraph>{gameDescription}</Paragraph>}
        </div>
      )}
    </div>
  );
};
