import { useAction } from 'next-safe-action/hooks';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/shared/UIKit/Button/Button';
import { Textarea } from '@/shared/UIKit/Textarea/Textarea';
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
  const { handleSubmit, control } = useForm<CreateGameParams>();

  return (
    <form
      onSubmit={handleSubmit(({ name, description }) => {
        execute({
          name,
          description,
          roomId,
        });
      })}
    >
      <Controller
        render={({ field }) => {
          // eslint-disable-next-line unused-imports/no-unused-vars
          const { ref, ...rest } = field;

          return <Textarea {...rest} placeholder="Task name" />;
        }}
        name="name"
        control={control}
      />
      <Controller
        render={({ field }) => {
          // eslint-disable-next-line unused-imports/no-unused-vars
          const { ref, ...rest } = field;

          return <Textarea {...rest} placeholder="Description" />;
        }}
        name="description"
        control={control}
      />
      <Button isLoading={isPending} type="submit">
        Create game
      </Button>
    </form>
  );
};
