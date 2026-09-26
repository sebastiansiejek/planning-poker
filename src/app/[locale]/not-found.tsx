import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { routes } from '@/shared/routes/routes';
import { buttonVariants } from '@/shared/ui-kit/button/button';
import { Container } from '@/shared/ui-kit/container/container';
import { PageHeading } from '@/shared/ui-kit/page-heading/page-heading';

export default async function NotFound() {
  const translate = await getTranslations('NotFound');
  return (
    <Container>
      <PageHeading title={translate('title')} />
      <Link href={routes.home.getPath()} className={buttonVariants()}>
        {translate('home')}
      </Link>
    </Container>
  );
}
