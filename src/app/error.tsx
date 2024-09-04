'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/shared/UIKit/Button/Button';
import { Heading } from '@/shared/UIKit/Heading/Heading';

export default function Error({ reset }: { reset: () => void }) {
  const translate = useTranslations();

  return (
    <div className="flex items-center justify-center text-center flex-col h-screen w-screen p-2">
      <Heading variant="h1">{translate('ErrorPage.title')}</Heading>
      <Button className="mt-6" onClick={() => reset()}>
        {translate('ErrorPage.retry')}
      </Button>
    </div>
  );
}
