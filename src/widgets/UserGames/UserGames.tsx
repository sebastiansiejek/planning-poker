'use client';

import type { Room } from '@prisma/client';
import type { CellContext, ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { SquareArrowOutUpRight, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';

import { routes } from '@/shared/routes/routes';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/UIKit/AlertDialog/AlertDialog';
import { Button } from '@/shared/UIKit/Button/Button';
import { ButtonIcon } from '@/shared/UIKit/Button/ButtonIcon/ButtonIcon';
import { DataTable } from '@/shared/UIKit/DataTable/DataTable';
import { deleteRoom } from '@/widgets/Room/actions/deleteRoom';

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
  const [open, setOpen] = useState(false);
  const { execute, isPending } = useAction(deleteRoom, {
    onSuccess: () => {
      setOpen(false);
    },
  });
  const translate = useTranslations();

  const handleDelete = async () => {
    execute({ id });
  };

  return (
    <div className="flex gap-2 justify-end">
      <Link href={routes.game.singleGame.getPath(id)}>
        <ButtonIcon icon={<SquareArrowOutUpRight />} />
      </Link>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <ButtonIcon icon={<Trash2 className="text-red-500" />} />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {translate('AlertDialog.delete.title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {translate('AlertDialog.delete.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {translate('AlertDialog.delete.cancel')}
            </AlertDialogCancel>
            <Button isLoading={isPending} onClick={() => handleDelete()}>
              {translate('AlertDialog.delete.confirm')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
