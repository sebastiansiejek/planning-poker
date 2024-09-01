'use server';

import { redirect } from 'next/navigation';

import { routes } from '@/shared/routes/routes';

export const createOrJoinToRoom = async (formData: FormData) => {
  const name = formData.get('name') as string;

  if (name) {
    redirect(routes.game.singleGame.getPath(name));
  }
};
