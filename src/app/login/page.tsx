import { redirect } from 'next/navigation';

import type { LoginPageProps } from '@/app/login/types';
import { Button } from '@/shared/UIKit/Button/Button';
import { TextInput } from '@/shared/UIKit/TextInput/TextInput';
import { UserModel } from '@/shared/user/model/UserModel';

export default async function Page({ searchParams }: LoginPageProps) {
  const { room } = searchParams;

  const handleSubmit = async (formData: FormData) => {
    'use server';

    const name = formData.get('name') as string;

    if (name) {
      UserModel.setUserName(name);
      redirect(`/game/${room || ''}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-svh">
      <h1 className="mb-12 text-2xl font-medium">{room}</h1>
      <form action={handleSubmit} className="flex flex-col gap-6 items-center">
        <TextInput name="name" required placeholder="Enter your name" />
        <Button type="submit">Join</Button>
      </form>
    </div>
  );
}
