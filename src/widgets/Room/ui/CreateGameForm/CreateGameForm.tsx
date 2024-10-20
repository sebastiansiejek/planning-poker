import { useTranslations } from 'next-intl';
import { useAction } from 'next-safe-action/hooks';
import { FormProvider, useForm } from 'react-hook-form';

import { Button } from '@/shared/UIKit/Button/Button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/UIKit/Form/ui';
import { Textarea } from '@/shared/UIKit/Textarea/Textarea';
import { Input } from '@/shared/UIKit/TextInput/TextInput';
import type { CreateGameParams } from '@/widgets/Room/actions/createGame';
import { createGame } from '@/widgets/Room/actions/createGame';

type CreateGameFormProps = {
  roomId: string;
};

export const CreateGameForm = ({ roomId }: CreateGameFormProps) => {
  const { execute, isPending } = useAction(createGame, {
    // onSuccess: ({ data }) => {
    //   TODO: Display error message
    // },
  });
  const form = useForm<CreateGameParams>();
  const { handleSubmit } = form;
  const translate = useTranslations();

  return (
    <FormProvider {...form}>
      <form
        className="space-y-4"
        onSubmit={handleSubmit(({ name, description }) => {
          execute({
            name,
            description,
            roomId,
          });
        })}
      >
        <FormField
          name="name"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>{translate('Game.newGame.name.label')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          name="description"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>
                  {translate('Game.newGame.description.label')}
                </FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button isLoading={isPending} type="submit">
          Create game
        </Button>
      </form>
    </FormProvider>
  );
};
