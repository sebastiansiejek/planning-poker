'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';

import { useUpdateUserSettings } from '@/shared/hooks/useUpdateUserSettings/useUpdateUserSettings';
import type { UserUpsertPayload } from '@/shared/types/user/user';
import { Button } from '@/shared/UIKit/Button/Button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/UIKit/Form/ui';
import { Input } from '@/shared/UIKit/TextInput/TextInput';
import { toast } from '@/shared/UIKit/Toast/model/useToast';

export const UserSettingsForm = () => {
  const { trigger, isMutating } = useUpdateUserSettings();
  const translate = useTranslations();
  const { data } = useSession();
  const form = useForm<UserUpsertPayload>({
    defaultValues: {
      name: data?.user.name || '',
    },
  });

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-6 items-start"
        onSubmit={form.handleSubmit(async ({ name }) => {
          await trigger({
            name,
          });
          toast({
            title: translate('UserSettings.notifications.success'),
          });
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
