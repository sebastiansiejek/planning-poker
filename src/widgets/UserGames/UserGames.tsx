'use client';

import type { Room } from '@prisma/client';
import type { CellContext, ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { SquareArrowOutUpRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { routes } from '@/shared/routes/routes';
import { ButtonIcon } from '@/shared/UIKit/Button/ButtonIcon/ButtonIcon';
import { DataTable } from '@/shared/UIKit/DataTable/DataTable';

type UserGamesProps = {
  name: string;
  actions: string;
  id: string;
  createdAt: string;
};

const Actions = ({
  row: {
    original: { id },
  },
}: CellContext<UserGamesProps, unknown>) => {
  return (
    <div className="flex gap-2 justify-end">
      <Link href={routes.game.singleGame.getPath(id)}>
        <ButtonIcon icon={<SquareArrowOutUpRight />} />
      </Link>
    </div>
  );
};

export const UserGames = ({ rooms }: { rooms: Room[] }) => {
  const [data] = useState(rooms);

  if (rooms.length === 0) {
    return null;
  }

  const columns: ColumnDef<UserGamesProps>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ getValue }) => dayjs(getValue() as string).format('DD/MM/YYYY'),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      size: 1,
      meta: {
        className: 'text-right',
      },
      cell: Actions,
    },
  ];

  // @ts-ignore
  return <DataTable columns={columns} data={data} />;
};
