'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useUpdateUserSettings } from '@/shared/hooks/useUpdateUserSettings/use-update-user-settings';
import type { UserUpsertPayload } from '@/shared/types/user/user';
import { Button } from '@/shared/ui-kit/button/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui-kit/form/ui';
import { Input } from '@/shared/ui-kit/text-input/text-input';
import { toast } from '@/shared/ui-kit/toast/model/use-toast';

export const UserSettingsForm = () => {
  const { trigger, isMutating } = useUpdateUserSettings();
  const translate = useTranslations();
  const { data } = useSession();
  const form = useForm<UserUpsertPayload>({
    resolver: zodResolver(z.object({
      name: z.string().trim().min(1, translate('Game.inputName.error.required')).max(100, translate('Common.maxLength', { max: 100 })),
    })),
    defaultValues: {
      name: data?.user.name || '',
    },
  });

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-6 items-start"
        onSubmit={form.handleSubmit(async ({ name }) => {
          try {
            await trigger({ name });
            toast({ title: translate('UserSettings.notifications.success') });
          } catch {
            toast({ title: translate('Common.saveError'), variant: 'destructive' });
          }
        })}
      >
        <FormField
          name="name"
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {translate('UserSettings.controls.name.label')}
              </FormLabel>
              <FormControl>
                <Input {...field} autoComplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" isLoading={isMutating}>
          {translate('UserSettings.controls.submit.title')}
        </Button>
      </form>
    </FormProvider>
  );
};
