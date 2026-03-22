'use client';

import type { CellContext, ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { SquareArrowOutUpRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { routes } from '@/shared/routes/routes';
import { ButtonIcon } from '@/shared/ui-kit/button/button-icon/button-icon';
import { DataTable } from '@/shared/ui-kit/data-table/data-table';

type UserGamesColumns = {
  name: string;
  actions?: string;
  id: string;
  createdAt: string | Date;
  author: {
    name: string;
  };
  _count: {
    RoomUser: number;
  };
};

type UserGamesProperties = UserGamesColumns[];

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

export const UserGames = ({ rooms }: { rooms: UserGamesProperties }) => {
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
      cell: ({ getValue }) => {
        return <div>{getValue() as number}</div>;
      },
    },
    {
      accessorKey: 'author.name',
      header: translate('Common.created_by'),
    },
    {
      accessorKey: 'createdAt',
      header: translate('Common.created_at'),
      cell: ({ getValue }) => dayjs(getValue() as string | Date).format('DD/MM/YYYY'),
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

  return <DataTable columns={columns} data={data} />;
};
