import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { getSession } from '@/shared/auth/auth';
import prisma from '@/shared/database/prisma';
import { routes } from '@/shared/routes/routes';
import { Container } from '@/shared/UIKit/Container/Container';
import { Heading } from '@/shared/UIKit/Heading/Heading';
import { PageHeading } from '@/shared/UIKit/PageHeading/PageHeading';
import { UserGames } from '@/widgets/UserGames/UserGames';

export default async function Home() {
  const session = await getSession();

  if (!session) {
    redirect(routes.login.getPath());
  }

  const rooms = await prisma.room.findMany({
    where: {
      RoomUser: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  const translate = await getTranslations();

  return (
    <Container>
      <PageHeading title="Dashboard" />
      <Heading variant="h2">{translate('Dashboard.userGames')}</Heading>
      <UserGames rooms={rooms} />
    </Container>
  );
}
