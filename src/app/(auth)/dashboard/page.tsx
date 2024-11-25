import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { RoomApiService } from '@/shared/api/services/prisma/RoomApiService';
import { getSession } from '@/shared/auth/auth';
import { routes } from '@/shared/routes/routes';
import { Container } from '@/shared/UIKit/Container/Container';
import { Heading } from '@/shared/UIKit/Heading/Heading';
import { PageHeading } from '@/shared/UIKit/PageHeading/PageHeading';
import { getPageMetaData } from '@/shared/utils/getPageMetaData';
import { UserGames } from '@/widgets/UserGames/UserGames';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
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

  const roomApiService = new RoomApiService();

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
