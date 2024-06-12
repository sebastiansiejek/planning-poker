'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState, useTransition } from 'react';

import { getGravatarUrl } from '@/shared/gravatar/getGravatarUrl';
import { Avatar } from '@/shared/UIKit/Avatar/Avatar';
import { Button } from '@/shared/UIKit/Button/Button';
import { TextInput } from '@/shared/UIKit/TextInput/TextInput';

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
        <TextInput
          name="email"
          placeholder={t('email.placeholder')}
          onChange={(e) => setEmail(e.currentTarget.value)}
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
            {t('show')}
          </Button>
        )}
      </div>
      <input type="hidden" name="gravatarUrl" value={url} />
      {email && url && (
        <div className="mt-2 flex justify-center">
          <Avatar url={url} size={40} />
        </div>
      )}
    </div>
  );
};
