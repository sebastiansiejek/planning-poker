'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/shared/UIKit/Button/Button';
import { TextInput } from '@/shared/UIKit/TextInput/TextInput';
import { createOrJoinToRoom } from '@/widgets/Room/actions/createOrJoinToRoom';

export const CreateOrJoinGameForm = () => {
  const t = useTranslations('Game');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setIsLoading(true);
        await createOrJoinToRoom(new FormData(event.currentTarget));
        setIsLoading(false);
      }}
      className="flex flex-col gap-6 justify-center items-center h-svh p-8"
    >
      <TextInput
        required
        placeholder={t('inputName.placeholder')}
        name="name"
        data-testid="game-name"
      />
      <Button
        type="submit"
        data-testid="create-game-submit"
        isLoading={isLoading}
      >
        {t('submitButton.label')}
      </Button>
    </form>
  );
};
