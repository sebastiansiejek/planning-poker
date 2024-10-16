'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAction } from 'next-safe-action/hooks';
import { FormProvider, useForm } from 'react-hook-form';
import z from 'zod';

import { routes } from '@/shared/routes/routes';
import { Button } from '@/shared/UIKit/Button/Button';
import { Container } from '@/shared/UIKit/Container/Container';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/UIKit/Form/ui';
import { FormField } from '@/shared/UIKit/Form/ui/FormField/FormField';
import { Input } from '@/shared/UIKit/TextInput/TextInput';
import type { CreateOrJoinToRoomParams } from '@/widgets/Room/actions/createRoom';
import { createRoom } from '@/widgets/Room/actions/createRoom';

export const CreateRoomForm = () => {
  const t = useTranslations('Game');
  const { push } = useRouter();
  const form = useForm<CreateOrJoinToRoomParams>({
    resolver: zodResolver(
      z.object({
        name: z.string().min(1, {
          message: t('inputName.error.required'),
        }),
      }),
    ),
    defaultValues: {
      name: '',
    },
  });
  const { handleSubmit, setError } = form;
  const { execute, isPending } = useAction(createRoom, {
    onSuccess: ({ data }) => {
      if (data?.error) {
        if (data.error.code === 'P2002') {
          setError('name', {
            message: t(`errors.${data.error.code}`),
          });
        }
      }
      if (data?.success && data.data) {
        push(routes.game.singleGame.getPath(data.data.id));
      }
    },
  });

  return (
    <Container>
      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit(({ name }) => {
            execute({ name });
          })}
          className="flex flex-col gap-6 justify-center items-center h-svh w-96 mx-auto"
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
          <Button
            type="submit"
            data-testid="create-game-submit"
            isLoading={isPending}
          >
            {t('create.label')}
          </Button>
        </form>
      </FormProvider>
    </Container>
  );
};
