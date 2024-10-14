import type { RoomProps } from '@/app/game/[...room]/types';
import { Heading } from '@/shared/UIKit/Heading/Heading';
import { Paragraph } from '@/shared/UIKit/Paragraph/Paragraph';
import { useRoomContext } from '@/widgets/Room/model/RoomContext';
import { CreateGameForm } from '@/widgets/Room/ui/CreateGameForm/CreateGameForm';

export const RoomSidebar = ({ name, id }: Pick<RoomProps, 'id' | 'name'>) => {
  const { room } = useRoomContext();
  const { game } = room || {};
  const { name: gameName, description: gameDescription } = game || {};

  return (
    <div>
      <Heading variant="h1">{name}</Heading>
      <hr className="mt-3 mb-4" />
      {!game && <CreateGameForm roomId={id} />}
      {game && (gameName || gameDescription) && (
        <div>
          {gameName && (
            <Heading variant="h2" htmlAttributes={{ className: 'border-none' }}>
              {gameName}
            </Heading>
          )}
          {gameDescription && <Paragraph>{gameDescription}</Paragraph>}
        </div>
      )}
    </div>
  );
};
