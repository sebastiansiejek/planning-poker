import { getLocale, getTranslations } from 'next-intl/server';

import { getPathname,redirect } from '@/i18n/navigation';
import { getSession } from '@/shared/auth/auth';
import { routes } from '@/shared/routes/routes';
import { Container } from '@/shared/ui-kit/container/container';
import { PageHeading } from '@/shared/ui-kit/page-heading/page-heading';
import { getPageMetaData } from '@/shared/utils/get-page-meta-data';
import { UserSettingsForm } from '@/widgets/user-settings-form/user-settings-form';

export async function generateMetadata() {
  const translate = await getTranslations();

  return getPageMetaData({
    title: translate('UserSettings.title'),
  });
}

export default async function Home() {
  const locale = await getLocale();
  const session = await getSession();

  if (!session) {
    return redirect({ locale, href: { pathname: routes.login.getPath(), query: { callbackUrl: getPathname({ locale, href: routes.userSettings.getPath() }) } } });
  }

  const translate = await getTranslations();

  return (
    <Container>
      <PageHeading title={translate('UserSettings.title')} />
      <div className="max-w-96">
        <UserSettingsForm />
      </div>
    </Container>
  );
}
