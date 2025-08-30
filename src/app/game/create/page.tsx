import { getTranslations } from 'next-intl/server';

import { Container } from '@/shared/UIKit/container/container';
import { PageHeading } from '@/shared/UIKit/page-heading/page-heading';
import { getPageMetaData } from '@/shared/utils/get-page-meta-data';
import { CreateRoomForm } from '@/widgets/create-game/ui/create-room-form/create-room-form';

export async function generateMetadata(properties: {
  params: Promise<{ locale: string }>;
}) {
  const parameters = await properties.params;

  const { locale } = parameters;

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
