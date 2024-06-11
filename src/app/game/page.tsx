import { getTranslations } from 'next-intl/server';

import { createOrJoinToRoom } from '@/app/actions/createOrJoinToRoom';
import { Button } from '@/shared/UIKit/Button/Button';
import { TextInput } from '@/shared/UIKit/TextInput/TextInput';

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
      />
      <Button type="submit">{t('submitButton.label')}</Button>
    </form>
  );
}
