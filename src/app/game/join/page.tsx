import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { getSession } from '@/shared/auth/auth';
import { routes } from '@/shared/routes/routes';
import { Container } from '@/shared/UIKit/Container/Container';
import { Heading } from '@/shared/UIKit/Heading/Heading';
import { PageHeading } from '@/shared/UIKit/PageHeading/PageHeading';
import { JoinToRoom } from '@/widgets/JoinToRoom/JoinToRoom';
import { RoomApiService } from '@/widgets/Room/api/RoomApiService';
import { UserGames } from '@/widgets/UserGames/UserGames';

export default async function JoinToRoomPage() {
  const session = await getSession();
  const roomApiService = new RoomApiService();
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
