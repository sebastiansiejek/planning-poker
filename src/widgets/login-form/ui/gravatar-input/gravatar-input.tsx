'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState, useTransition } from 'react';

import { getGravatarUrl } from '@/shared/lib/gravatar/get-gravatar-url';
import { Avatar, AvatarImage } from '@/shared/UIKit/avatar/avatar';
import { Button } from '@/shared/UIKit/button/button';
import { Input } from '@/shared/UIKit/text-input/text-input';

export const GravatarInput = () => {
  const t = useTranslations('Gravatar');
  const [email, setEmail] = useState('');
  const [url, setUrl] = useState('');
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!email) {
      setUrl('');
    }
  }, [email]);

  return (
    <div>
      <div className="flex gap-2">
        <Input
          name="email"
          placeholder={t('email.placeholder')}
          onChange={(event) => setEmail(event.currentTarget.value)}
        />
        {email && (
          <Button
            variant="secondary"
            isLoading={pending}
            onClick={() => {
              startTransition(async () => {
                const gravatarUrl = await getGravatarUrl(email);
                setUrl(gravatarUrl);
              });
            }}
          >
            {t('add')}
          </Button>
        )}
      </div>
      <input type="hidden" name="gravatarUrl" value={url} />
      {email && url && (
        <div className="mt-2 flex justify-center">
          <Avatar>
            <AvatarImage src={url} height={40} />
          </Avatar>
        </div>
      )}
    </div>
  );
};
