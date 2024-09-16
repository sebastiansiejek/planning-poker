'use client';

import { useSession } from 'next-auth/react';

import { Avatar } from '@/shared/UIKit/Avatar/Avatar';

export const UserAvatar = () => {
  const { data } = useSession();
  const image = data?.user?.image;

  return <div>{image && <Avatar url={image} size={40} />}</div>;
};
