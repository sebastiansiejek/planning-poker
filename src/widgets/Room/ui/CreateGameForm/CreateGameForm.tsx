import type { Room } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { useAction } from 'next-safe-action/hooks';
import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useCountdown } from '@/shared/hooks/useCountdown/useCountdown';
import { Button } from '@/shared/UIKit/Button/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/UIKit/Dialog/Dialog';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/UIKit/Form/ui';
import { Input } from '@/shared/UIKit/TextInput/TextInput';
import type { CreateGameParams } from '@/widgets/Room/actions/createGame';
import { createGame } from '@/widgets/Room/actions/createGame';
import { resetVotes } from '@/widgets/Room/actions/resetVotes';

export const CreateGameForm = ({
  roomId,
  isWaitingForStartGame,
}: {
  roomId: Room['id'];
  isWaitingForStartGame: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { execute, isPending } = useAction(createGame, {
    onSuccess: () => {
      setIsOpen(false);
    },
  });
  const form = useForm<CreateGameParams>();
  const { handleSubmit } = form;
  const translate = useTranslations();
  const { execute: executeResetVotes } = useAction(resetVotes);
  const { counter } = useCountdown({
    time: 3000,
    enabled: isWaitingForStartGame,
  });
  const isCounter = useMemo(() => counter > 0, [counter]);

  return (
    <FormProvider {...form}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            disabled={isCounter}
            data-testid="create-game-trigger-button"
          >
            <span>
              {translate('Game.create.label')} {isCounter && `(${counter})`}
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <form
            className="space-y-4"
            onSubmit={handleSubmit(({ name, description }) => {
              executeResetVotes({
                channelName: roomId,
              });
              execute({
                name,
                description,
                roomId,
              });
            })}
          >
            <DialogHeader>
              <DialogTitle>{translate('Game.newGame.title')}</DialogTitle>
            </DialogHeader>
            <FormField
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>
                      {translate('Game.newGame.name.label')}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            {/* <FormField */}
            {/*  name="description" */}
            {/*  render={({ field }) => { */}
            {/*    return ( */}
            {/*      <FormItem> */}
            {/*        <FormLabel> */}
            {/*          {translate('Game.newGame.description.label')} */}
            {/*        </FormLabel> */}
            {/*        <FormControl> */}
            {/*          <Textarea {...field} /> */}
            {/*        </FormControl> */}
            {/*        <FormMessage /> */}
            {/*      </FormItem> */}
            {/*    ); */}
            {/*  }} */}
            {/* /> */}
            <DialogFooter>
              <Button
                isLoading={isPending}
                type="submit"
                data-testid="create-game-submit"
              >
                {translate('Game.create.label')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
};
