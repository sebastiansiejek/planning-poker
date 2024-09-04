'use server';

import { redirect } from 'next/navigation';

import { UserModel } from '@/entities/user/model/UserModel';
import { routes } from '@/shared/routes/routes';

export const login = async (formData: FormData) => {
  'use server';

  const name = formData.get('name') as string;
  const room = formData.get('room') as string;
  const gravatarUrl = formData.get('gravatarUrl') as string;

  if (name) {
    UserModel.setUserName(name);
  }

  if (gravatarUrl) {
    UserModel.setAvatarUrl(gravatarUrl);
  }

  redirect(routes.game.singleGame.getPath(room || ''));
};
