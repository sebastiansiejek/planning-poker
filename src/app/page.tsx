import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { routes } from '@/shared/routes/routes';
import { Button } from '@/shared/UIKit/Button/Button';

export default async function Home() {
  const t = await getTranslations();

  return (
    <main className="container grid md:grid-cols-2 gap-6 h-svh items-center py-6">
      <div className="grid gap-4">
        <h1 className="text-4xl font-semibold">{t('Homepage.title')}</h1>
        <p className="text-balance whitespace-pre-line">
          {t('Homepage.description')}
        </p>
        <div className="mt-2">
          <Link href={routes.game.getPath()}>
            <Button data-testid="go-to-game">
              {t('Game.submitButton.label')}
            </Button>
          </Link>
        </div>
      </div>
      <div>
        <video src="/sample-game.webm" autoPlay loop muted playsInline />
      </div>
    </main>
  );
}
