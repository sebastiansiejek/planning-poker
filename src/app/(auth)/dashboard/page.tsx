import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { getSession } from '@/shared/auth/auth';
import { RoomServiceFactory } from '@/shared/factories/room-service-factory';
import { routes } from '@/shared/routes/routes';
import { Container } from '@/shared/ui-kit/container/container';
import { Heading } from '@/shared/ui-kit/heading/heading';
import { PageHeading } from '@/shared/ui-kit/page-heading/page-heading';
import { getPageMetaData } from '@/shared/utils/get-page-meta-data';
import { UserGames } from '@/widgets/user-games/user-games';

export async function generateMetadata(properties: {
  params: Promise<{ locale: string }>;
}) {
  const parameters = await properties.params;

  const { locale } = parameters;

  const translate = await getTranslations({ locale });

  return getPageMetaData({
    title: translate('Dashboard.meta.title'),
  });
}

export default async function Home() {
  const session = await getSession();

  if (!session) {
    redirect(routes.login.getPath());
  }

  const roomApiService = RoomServiceFactory.getService();

  const rooms = await roomApiService.getRoomsWhereTheUserIsAParticipant(
    session.user.id,
  );
  const translate = await getTranslations();

  return (
    <Container>
      <PageHeading title="Dashboard" />
      <Heading variant="h2">{translate('Dashboard.userGames')}</Heading>
      <UserGames rooms={rooms} />
    </Container>
  );
}
