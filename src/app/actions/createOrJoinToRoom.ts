'use server';

import { redirect } from 'next/navigation';
import z from 'zod';

export const createOrJoinToRoom = async (formData: FormData) => {
  const name = formData.get('name');

  try {
    z.string().parse(name);

    redirect(`/game/${name}`);
  } catch (error) {
    console.error(error);
  }
};
