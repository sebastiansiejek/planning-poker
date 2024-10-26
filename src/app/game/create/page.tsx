import { getTranslations } from 'next-intl/server';

import { Container } from '@/shared/UIKit/Container/Container';
import { PageHeading } from '@/shared/UIKit/PageHeading/PageHeading';
import { getPageMetaData } from '@/shared/utils/getPageMetaData';
import { CreateRoomForm } from '@/widgets/CreateGame/ui/CreateRoomForm/CreateRoomForm';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const translate = await getTranslations({ locale });

  return getPageMetaData({
    title: translate('Game.create.meta.title'),
    description: translate('Game.create.meta.description'),
  });
}

export default async function CreateGamePage() {
  const translate = await getTranslations();

  return (
    <Container>
      <PageHeading title={translate('Game.newGame.title')} />
      <CreateRoomForm />
    </Container>
  );
}
