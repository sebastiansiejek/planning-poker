import { getTranslations } from 'next-intl/server';

import type { LoginPageProps } from '@/app/login/types';
import { Button } from '@/shared/UIKit/Button/Button';
import { TextInput } from '@/shared/UIKit/TextInput/TextInput';
import { GravatarInput } from '@/widgets/LoginForm/ui/GravatarInput/GravatarInput';
import { login } from '@/widgets/room/actions/login';

export default async function Page({ searchParams }: LoginPageProps) {
  const { room } = searchParams;
  const t = await getTranslations('Login');

  return (
    <div className="flex flex-col items-center justify-center h-svh">
      <h1 className="mb-12 text-2xl font-medium">{room}</h1>
      <form action={login} className="flex flex-col gap-4 items-center">
        <TextInput
          name="name"
          required
          placeholder={t('inputName.placeholder')}
          data-testid="login-name"
        />
        <GravatarInput />
        <div className="mt-2">
          <Button type="submit" data-testid="login-submit">
            {t('submitButton.label')}
          </Button>
        </div>
        <input type="hidden" name="room" defaultValue={room} />
      </form>
    </div>
  );
}
