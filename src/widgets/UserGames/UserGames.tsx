'use client';

import type { Room } from '@prisma/client';
import type { CellContext, ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { SquareArrowOutUpRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { routes } from '@/shared/routes/routes';
import { ButtonIcon } from '@/shared/UIKit/Button/ButtonIcon/ButtonIcon';
import { DataTable } from '@/shared/UIKit/DataTable/DataTable';

type UserGamesColumns = {
  name: string;
  actions: string;
  id: string;
  createdAt: string;
  _count: {
    RoomUser: number;
  };
};

type UserGamesProps = (Room & Pick<UserGamesColumns, '_count'>)[];

const Actions = ({
  row: {
    original: { id },
  },
}: CellContext<UserGamesColumns, unknown>) => {
  return (
    <div className="flex gap-2 justify-end">
      <Link href={routes.game.singleGame.getPath(id)}>
        <ButtonIcon icon={<SquareArrowOutUpRight />} />
      </Link>
    </div>
  );
};

export const UserGames = ({ rooms }: { rooms: UserGamesProps }) => {
  const [data] = useState(rooms);
  const translate = useTranslations();

  if (rooms.length === 0) {
    return null;
  }

  const columns: ColumnDef<UserGamesColumns>[] = [
    {
      accessorKey: 'name',
      header: translate('Common.name'),
    },
    {
      accessorKey: '_count.RoomUser',
      header: translate('Common.players_count'),
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: ({ getValue }) => {
        return <div>{getValue() as number}</div>;
      },
    },
    {
      accessorKey: 'createdAt',
      header: translate('Common.created_at'),
      cell: ({ getValue }) => dayjs(getValue() as string).format('DD/MM/YYYY'),
    },
    {
      accessorKey: 'actions',
      header: translate('Common.actions'),
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
