import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { getSession } from '@/shared/auth/auth';
import { RoomServiceFactory } from '@/shared/factories/room-service-factory';
import { routes } from '@/shared/routes/routes';
import { Container } from '@/shared/UIKit/container/container';
import { Heading } from '@/shared/UIKit/heading/heading';
import { PageHeading } from '@/shared/UIKit/page-heading/page-heading';
import { getPageMetaData } from '@/shared/utils/get-page-meta-data';
import { JoinToRoom } from '@/widgets/join-to-room/join-to-room';
import { UserGames } from '@/widgets/user-games/user-games';

export async function generateMetadata(properties: {
  params: Promise<{ locale: string }>;
}) {
  const parameters = await properties.params;

  const { locale } = parameters;

  const translate = await getTranslations({ locale });

  return getPageMetaData({
    title: translate('Game.join.meta.title'),
    description: translate('Game.join.meta.title'),
  });
}

export default async function JoinToRoomPage() {
  const session = await getSession();
  const roomApiService = RoomServiceFactory.getService();
  const translate = await getTranslations();

  if (!session) {
    redirect(routes.login.getPath());
  }

  const rooms = await roomApiService.getRoomsWhereTheUserIsAParticipant(
    session.user.id,
  );

  return (
    <Container>
      <PageHeading title={translate('Game.join.label')} />
      <div className="space-y-10">
        <JoinToRoom />
        {rooms.length > 0 && (
          <>
            <Heading variant="h2">{translate('Dashboard.userGames')}</Heading>
            <UserGames rooms={rooms} />
          </>
        )}
      </div>
    </Container>
  );
}
