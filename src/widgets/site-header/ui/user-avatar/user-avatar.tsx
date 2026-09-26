'use client';

import { useSession } from 'next-auth/react';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui-kit/avatar/avatar';

export const UserAvatar = () => {
  const { data } = useSession();
  const user = data?.user;
  if (!user) return null;

  const initials = user.name?.trim().split(/\s+/).slice(0, 2)
    .map((part) => part[0]).join('').toUpperCase() || '?';

  return (
    <Avatar aria-hidden="true">
      {user.image && <AvatarImage src={user.image} alt="" />}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};
