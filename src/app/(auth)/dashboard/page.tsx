import { redirect } from 'next/navigation';

import { getSession } from '@/shared/auth/auth';
import prisma from '@/shared/database/prisma';
import { routes } from '@/shared/routes/routes';
import { Container } from '@/shared/UIKit/Container/Container';
import { Heading } from '@/shared/UIKit/Heading/Heading';
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

  return (
    <Container>
      <Heading variant="h1">Dashboard</Heading>
      <Heading variant="h2">Rooms</Heading>
      <UserGames rooms={rooms} />
    </Container>
  );
}
