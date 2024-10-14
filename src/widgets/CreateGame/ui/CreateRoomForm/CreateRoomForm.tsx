'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAction } from 'next-safe-action/hooks';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { routes } from '@/shared/routes/routes';
import { Button } from '@/shared/UIKit/Button/Button';
import { FormField } from '@/shared/UIKit/Form/FormField/FormField';
import { Input } from '@/shared/UIKit/TextInput/TextInput';
import type { CreateOrJoinToRoomParams } from '@/widgets/Room/actions/createRoom';
import { createRoom } from '@/widgets/Room/actions/createRoom';

export const CreateRoomForm = () => {
  const t = useTranslations('Game');
  const { push } = useRouter();
  const form = useForm<CreateOrJoinToRoomParams>({
    defaultValues: {
      name: '',
    },
  });
  const { handleSubmit, setError, control } = form;
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
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(({ name }) => {
          execute({ name });
        })}
        className="flex flex-col gap-6 justify-center items-center h-svh p-8 w-96 mx-auto"
      >
        <Controller
          name="name"
          control={control}
          render={({ field: { ref, ...field } }) => {
            return (
              <FormField name="name" label={t('inputName.label')}>
                <Input
                  placeholder={t('inputName.placeholder')}
                  data-testid="game-name"
                  required
                  ref={ref}
                  autoFocus
                  autoComplete="off"
                  {...field}
                />
              </FormField>
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
  );
};
