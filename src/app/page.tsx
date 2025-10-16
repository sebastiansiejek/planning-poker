import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { routes } from '@/shared/routes/routes';
import { Button, buttonVariants } from '@/shared/ui-kit/button/button';

export default async function Home() {
  const t = await getTranslations();

  return (
    <main className="container grid md:grid-cols-2 gap-6 h-svh items-center py-6">
      <div className="grid gap-4">
        <h1 className="text-4xl font-semibold">{t('Homepage.title')}</h1>
        <p className="text-balance whitespace-pre-line">
          {t('Homepage.description')}
        </p>
        <div className="flex items-center gap-4 mt-2 ">
          <Link href={routes.game.create.getPath()} className={buttonVariants()} data-testid="start-new-game">
              {t('Game.create.label')}
          </Link>
          <span>{t('Common.or')}</span>
          <Link href={routes.game.join.getPath()} className={buttonVariants()} data-testid="join-to-game">
            <Button >{t('Game.join.label')}</Button>
          </Link>
        </div>
      </div>
      <div>
        <video src="/sample-game.webm" autoPlay loop muted playsInline />
      </div>
    </main>
  );
}
