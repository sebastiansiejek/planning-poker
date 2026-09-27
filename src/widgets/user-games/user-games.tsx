'use client';

import type { CellContext, ColumnDef } from '@tanstack/react-table';
import { SquareArrowOutUpRight } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { routes } from '@/shared/routes/routes';
import { buttonVariants } from '@/shared/ui-kit/button/button';
import { DataTable } from '@/shared/ui-kit/data-table/data-table';
import { DeleteRoom } from '@/widgets/user-games/delete-room';

type UserGamesColumns = {
  name: string;
  actions?: string;
  id: string;
  authorId: string;
  createdAt: string | Date;
  author: {
    name: string;
  };
  _count: {
    participants: number;
  };
};

type UserGamesProperties = UserGamesColumns[];

const Actions = ({
  row: {
    original: { id, name, authorId },
  },
  currentUserId,
}: CellContext<UserGamesColumns, unknown> & { currentUserId: string }) => {
  const translate = useTranslations('Common');
  return (
    <div className="flex gap-2 justify-end">
      <Link href={routes.game.singleGame.getPath(id)} aria-label={translate('openRoom')} className={buttonVariants({ variant: 'outline', size: 'icon' })}><SquareArrowOutUpRight /></Link>
      {authorId === currentUserId && <DeleteRoom roomId={id} name={name} />}
    </div>
  );
};

export const UserGames = ({ rooms, currentUserId }: { rooms: UserGamesProperties; currentUserId: string }) => {
  const translate = useTranslations();
  const format = useFormatter();

  if (rooms.length === 0) {
    return null;
  }

  const columns: ColumnDef<UserGamesColumns>[] = [
    {
      accessorKey: 'name',
      header: translate('Common.name'),
    },
    {
      accessorKey: '_count.participants',
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
      cell: ({ getValue }) => format.dateTime(new Date(getValue() as string | Date), { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' }),
    },
    {
      accessorKey: 'actions',
      header: translate('Common.actions'),
      size: 1,
      meta: {
        className: 'text-right',
      },
      cell: (context) => <Actions {...context} currentUserId={currentUserId} />,
    },
  ];

  return <DataTable columns={columns} data={rooms} />;
};
