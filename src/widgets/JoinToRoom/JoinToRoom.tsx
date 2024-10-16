'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';

import { routes } from '@/shared/routes/routes';
import { Button } from '@/shared/UIKit/Button/Button';
import { Container } from '@/shared/UIKit/Container/Container';
import { FormField } from '@/shared/UIKit/Form/FormField/FormField';
import { Input } from '@/shared/UIKit/TextInput/TextInput';

export const JoinToRoom = () => {
  const form = useForm({
    defaultValues: {
      id: '',
    },
  });
  const { register, handleSubmit } = form;
  const { push } = useRouter();
  const t = useTranslations('Game');

  return (
    <Container>
      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit(({ id }) => {
            push(routes.game.singleGame.getPath(id));
          })}
          className="flex flex-col gap-6 justify-center items-center h-svh w-96 mx-auto"
        >
          <FormField name="id" label={t('inputId.label')}>
            <Input
              {...register('id', {
                required: true,
              })}
              autoComplete="off"
              autoFocus
              placeholder="9y1xxayrk0001yy211ttts2ss"
            />
          </FormField>
          <Button type="submit">Join</Button>
        </form>
      </FormProvider>
    </Container>
  );
};
