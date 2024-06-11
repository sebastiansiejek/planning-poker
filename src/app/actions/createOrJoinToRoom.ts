'use server';

import { redirect } from 'next/navigation';

export const createOrJoinToRoom = async (formData: FormData) => {
  const name = formData.get('name');

  if (name) {
    redirect(`/game/${name}`);
  }
};
