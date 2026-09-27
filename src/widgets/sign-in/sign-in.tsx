'use client';

import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/shared/ui-kit/button/button';

export const SignIn = ({
  callbackUrl,
  hasError,
}: {
  callbackUrl: string;
  hasError: boolean;
}) => {
  const translate = useTranslations('Login');
  const [isPending, setIsPending] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      {(hasError || failed) && <p role="alert">{translate('error')}</p>}
      <Button
        isLoading={isPending}
        onClick={async () => {
          setIsPending(true);
          try {
            await signIn('google', { callbackUrl });
          } catch {
            setFailed(true);
          } finally {
            setIsPending(false);
          }
        }}
      >
        {translate('google')}
      </Button>
    </div>
  );
};
