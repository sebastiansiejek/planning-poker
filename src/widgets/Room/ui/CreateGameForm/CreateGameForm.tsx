import { useTranslations } from 'next-intl';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

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
// import { Textarea } from '@/shared/UIKit/Textarea/Textarea';
import { Input } from '@/shared/UIKit/TextInput/TextInput';
import type { CreateGameParams } from '@/widgets/Room/actions/createGame';
import { createGame } from '@/widgets/Room/actions/createGame';

type CreateGameFormProps = {
  roomId: string;
};

export const CreateGameForm = ({ roomId }: CreateGameFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { execute, isPending } = useAction(createGame, {
    onSuccess: () => {
      setIsOpen(false);
    },
  });
  const form = useForm<CreateGameParams>();
  const { handleSubmit } = form;
  const translate = useTranslations();

  return (
    <FormProvider {...form}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Create new game</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{translate('Game.newGame.title')}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
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
          </form>
          <DialogFooter>
            <Button
              onClick={handleSubmit(({ name, description }) => {
                execute({
                  name,
                  description,
                  roomId,
                });
              })}
              isLoading={isPending}
              type="submit"
            >
              {translate('Game.create.label')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
};
