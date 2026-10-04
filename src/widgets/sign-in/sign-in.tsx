'use client';

import { Google_Sans } from 'next/font/google';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/shared/ui-kit/button/button';
import { renderClass } from '@/shared/utils/render-class/render-class';

const googleSans = Google_Sans({
  weight: '500',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
});

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
        type="button"
        variant="outline"
        className={renderClass(
          googleSans.className,
          'gap-2.5 rounded-sm border-[#747775] bg-white px-3 py-0 text-[#1f1f1f] leading-5 hover:bg-[#f2f2f2] hover:text-[#1f1f1f] active:bg-[#e8e8e8]',
        )}
        aria-busy={isPending}
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
        <Image
          src="/google-logo.png"
          alt=""
          width={20}
          height={20}
          className="h-5 w-5 shrink-0 object-contain"
          unoptimized
        />
        {translate('google')}
      </Button>
    </div>
  );
};
