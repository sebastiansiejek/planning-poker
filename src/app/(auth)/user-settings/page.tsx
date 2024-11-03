import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { getSession } from '@/shared/auth/auth';
import { routes } from '@/shared/routes/routes';
import { Container } from '@/shared/UIKit/Container/Container';
import { PageHeading } from '@/shared/UIKit/PageHeading/PageHeading';
import { getPageMetaData } from '@/shared/utils/getPageMetaData';
import { UserSettingsForm } from '@/widgets/UserSettingsForm/UserSettingsForm';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
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
