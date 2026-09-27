'use client';

import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAction } from 'next-safe-action/hooks';

import { useRouter } from '@/i18n/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui-kit/alert-dialog/alert-dialog';
import { Button } from '@/shared/ui-kit/button/button';
import { toast } from '@/shared/ui-kit/toast/model/use-toast';
import { deleteRoom } from '@/widgets/room/actions/delete-room';

export const DeleteRoom = ({ roomId, name }: { roomId: string; name: string }) => {
  const translate = useTranslations('Dashboard.deleteRoom');
  const router = useRouter();
  const showError = () => toast({ title: translate('error'), variant: 'destructive' });
  const { execute, isPending } = useAction(deleteRoom, {
    onSuccess: ({ data }) => {
      if (data?.success) router.refresh();
      else showError();
    },
    onError: showError,
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="outline" size="icon" aria-label={translate('trigger', { name })}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{translate('title', { name })}</AlertDialogTitle>
          <AlertDialogDescription>{translate('description')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{translate('cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => execute({ roomId })}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {translate('confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
