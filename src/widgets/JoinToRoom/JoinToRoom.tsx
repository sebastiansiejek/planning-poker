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
import { joinToRoomValidator } from '@/widgets/Room/actions/joinToRoomValidator';

export const JoinToRoom = () => {
  const translate = useTranslations('Game');
  const form = useForm({
    resolver: zodResolver(
      z.object({
        id: z.string().min(1, {
          message: translate('inputId.error.required'),
        }),
      }),
    ),
    defaultValues: {
      id: '',
    },
  });
  const { handleSubmit, setError, setValue } = form;
  const { push } = useRouter();
  const { execute } = useAction(joinToRoomValidator, {
    onSuccess: ({ data, input: { id } }) => {
      if (!data?.success) {
        setError('id', {
          message: translate('inputId.error.notFound'),
        });
        setValue('id', '');
        return;
      }

      if (data?.success) {
        push(routes.game.singleGame.getPath(id));
      }
    },
  });

  return (
    <Container>
      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit(({ id }) => {
            execute({ id });
          })}
          className="flex flex-col gap-6 justify-center items-center h-svh w-96 mx-auto"
        >
          <FormField
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translate('inputId.label')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="off"
                    autoFocus
                    placeholder="9y1xxayrk0001yy211ttts2ss"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Join</Button>
        </form>
      </FormProvider>
    </Container>
  );
};
