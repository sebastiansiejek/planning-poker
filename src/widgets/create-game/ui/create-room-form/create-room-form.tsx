'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useAction } from 'next-safe-action/hooks';
import { FormProvider, useForm } from 'react-hook-form';
import z from 'zod';

import { useRouter } from '@/i18n/navigation';
import { routes } from '@/shared/routes/routes';
import { Button } from '@/shared/ui-kit/button/button';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui-kit/form/ui';
import { FormField } from '@/shared/ui-kit/form/ui/form-field/form-field';
import { Input } from '@/shared/ui-kit/text-input/text-input';
import type { CreateOrJoinToRoomParameters } from '@/widgets/room/actions/create-room';
import { createRoom } from '@/widgets/room/actions/create-room';

export const CreateRoomForm = () => {
  const t = useTranslations('Game');
  const common = useTranslations('Common');
  const { push } = useRouter();
  const form = useForm<CreateOrJoinToRoomParameters>({
    resolver: zodResolver(
      z.object({
        name: z.string().trim().min(1, {
          message: t('inputName.error.required'),
        }).max(100, common('maxLength', { max: 100 })),
      }),
    ),
    defaultValues: {
      name: '',
    },
  });
  const { handleSubmit, setError } = form;
  const {
    execute,
    isPending,
    result: { data: createRoomResponse },
  } = useAction(createRoom, {
    onSuccess: ({ data }) => {
      if (data?.error && (data.error.code === 'P2002' || data.error.code === 'ROOM_LIMIT')) {
        setError('name', {
          message: t(`errors.${data.error.code}`),
          type: data.error.code,
        });
      }

      if (data?.success && data.data?.id) {
        push(routes.game.singleGame.getPath(data.data.id));
      }
    },
  });

  const roomExists = form.getFieldState('name')?.error?.type === 'P2002';

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(({ name }) => {
          execute({ name });
        })}
        className="flex flex-col gap-6 justify-center items-center w-96 mx-auto"
      >
        <FormField
          name="name"
          render={({ field: { ...field } }) => {
            return (
              <FormItem>
                <FormLabel>{t('inputName.label')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('inputName.placeholder')}
                    data-testid="game-name"
                    autoFocus
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <div className="flex gap-6">
          <Button
            type="submit"
            data-testid="create-game-submit"
            isLoading={isPending}
          >
            {t('create.label')}
          </Button>
          {roomExists && (
            <Button
              type="button"
              data-testid="join-to-game"
              onClick={() => {
                const roomId = createRoomResponse?.data?.id;

                if (roomId) {
                  push(routes.game.singleGame.getPath(roomId));
                }
              }}
            >
              {t('join.label')}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};
