import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { getSession } from '@/shared/auth/auth';
import { routes } from '@/shared/routes/routes';
import { Container } from '@/shared/ui-kit/container/container';
import { PageHeading } from '@/shared/ui-kit/page-heading/page-heading';
import { getPageMetaData } from '@/shared/utils/get-page-meta-data';
import { UserSettingsForm } from '@/widgets/user-settings-form/user-settings-form';

export async function generateMetadata(properties: {
  params: Promise<{ locale: string }>;
}) {
  const parameters = await properties.params;

  const { locale } = parameters;

  const translate = await getTranslations({ locale });

  return getPageMetaData({
    title: translate('UserSettings.title'),
  });
}

export default async function Home() {
  const session = await getSession();

  if (!session) {
    redirect(routes.login.getPath());
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
