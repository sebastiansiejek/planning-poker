import type { Room } from '@prisma/client';
import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';

import { routes } from '@/shared/routes/routes';
import { Button } from '@/shared/UIKit/Button/Button';
import { deleteRoom } from '@/widgets/Room/actions/deleteRoom';

export const UserGameRow = ({ name, id }: Room) => {
  const { execute, isPending } = useAction(deleteRoom, {});
  const handleDelete = async () => {
    execute({ id: id as string });
  };

  return (
    <tr key={id}>
      <td>{name}</td>
      <td>
        <Link href={routes.game.singleGame.getPath(id as string)}>
          <Button>Join</Button>
        </Link>
      </td>
      <td>
        <Button color="danger" onClick={handleDelete} isLoading={isPending}>
          Delete
        </Button>
      </td>
    </tr>
  );
};
