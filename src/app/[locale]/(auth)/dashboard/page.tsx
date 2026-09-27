import { getLocale, getTranslations } from 'next-intl/server';

import { getPathname,redirect } from '@/i18n/navigation';
import { getSession } from '@/shared/auth/auth';
import { RoomServiceFactory } from '@/shared/factories/room-service-factory';
import { routes } from '@/shared/routes/routes';
import { Container } from '@/shared/ui-kit/container/container';
import { Heading } from '@/shared/ui-kit/heading/heading';
import { PageHeading } from '@/shared/ui-kit/page-heading/page-heading';
import { getPageMetaData } from '@/shared/utils/get-page-meta-data';
import { UserGames } from '@/widgets/user-games/user-games';

export async function generateMetadata() {
  const translate = await getTranslations();

  return getPageMetaData({
    title: translate('Dashboard.meta.title'),
  });
}

export default async function Home() {
  const locale = await getLocale();
  const session = await getSession();

  if (!session) {
    return redirect({ locale, href: { pathname: routes.login.getPath(), query: { callbackUrl: getPathname({ locale, href: routes.dashboard.getPath() }) } } });
  }

  const roomApiService = RoomServiceFactory.getService();

  const rooms = await roomApiService.getRoomsWhereTheUserIsAParticipant(
    session.user.id,
  );
  const translate = await getTranslations();

  return (
    <Container>
      <PageHeading title={translate('Dashboard.meta.title')} />
      <Heading variant="h2">{translate('Dashboard.userGames')}</Heading>
      <UserGames rooms={rooms} currentUserId={session.user.id} />
    </Container>
  );
}
