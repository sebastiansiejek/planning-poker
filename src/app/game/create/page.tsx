import { getTranslations } from 'next-intl/server';

import { Container } from '@/shared/UIKit/Container/Container';
import { PageHeading } from '@/shared/UIKit/PageHeading/PageHeading';
import { CreateRoomForm } from '@/widgets/CreateGame/ui/CreateRoomForm/CreateRoomForm';

export default async function CreateGamePage() {
  const translate = await getTranslations();

  return (
    <Container>
      <PageHeading title={translate('Game.newGame.title')} />
      <CreateRoomForm />
    </Container>
  );
}
