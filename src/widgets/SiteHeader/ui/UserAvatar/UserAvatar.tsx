'use client';

import { useSession } from 'next-auth/react';

import { Avatar, AvatarImage } from '@/shared/UIKit/Avatar/Avatar';

export const UserAvatar = () => {
  const { data } = useSession();
  const image = data?.user?.image;

  return (
    <div>
      {image && (
        <Avatar>
          <AvatarImage src={image} />
        </Avatar>
      )}
    </div>
  );
};
