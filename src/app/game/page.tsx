import { getTranslations } from 'next-intl/server';

import { Button } from '@/shared/UIKit/Button/Button';
import { TextInput } from '@/shared/UIKit/TextInput/TextInput';
import { createOrJoinToRoom } from '@/widgets/room/actions/createOrJoinToRoom';

export default async function CreateGamePage() {
  const t = await getTranslations('Game');

  return (
    <form
      action={createOrJoinToRoom}
      className="flex flex-col gap-6 justify-center items-center h-svh p-8"
    >
      <TextInput
        required
        placeholder={t('inputName.placeholder')}
        name="name"
        data-testid="game-name"
      />
      <Button type="submit" data-testid="create-game-submit">
        {t('submitButton.label')}
      </Button>
    </form>
  );
}
