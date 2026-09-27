import { getLocale, getTranslations } from 'next-intl/server';

import { getPathname,redirect } from '@/i18n/navigation';
import { getSession } from '@/shared/auth/auth';
import { RoomServiceFactory } from '@/shared/factories/room-service-factory';
import { routes } from '@/shared/routes/routes';
import { Container } from '@/shared/ui-kit/container/container';
import { Heading } from '@/shared/ui-kit/heading/heading';
import { PageHeading } from '@/shared/ui-kit/page-heading/page-heading';
import { getPageMetaData } from '@/shared/utils/get-page-meta-data';
import { JoinToRoom } from '@/widgets/join-to-room/join-to-room';
import { UserGames } from '@/widgets/user-games/user-games';

export async function generateMetadata() {
  const translate = await getTranslations();

  return getPageMetaData({
    title: translate('Game.join.meta.title'),
    description: translate('Game.join.meta.description'),
  });
}

export default async function JoinToRoomPage() {
  const locale = await getLocale();
  const session = await getSession();
  const roomApiService = RoomServiceFactory.getService();
  const translate = await getTranslations();

  if (!session) {
    return redirect({ locale, href: { pathname: routes.login.getPath(), query: { callbackUrl: getPathname({ locale, href: routes.game.join.getPath() }) } } });
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
            <UserGames rooms={rooms} currentUserId={session.user.id} />
          </>
        )}
      </div>
    </Container>
  );
}
