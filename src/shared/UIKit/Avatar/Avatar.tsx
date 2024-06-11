import Image from 'next/image';

import type { UserAvatarProps } from '@/shared/UIKit/Avatar/types';

export const Avatar = ({ url, size = 80 }: UserAvatarProps) => {
  return (
    <Image
      src={url}
      alt="avatar"
      width={size}
      height={size}
      className="rounded-full"
    />
  );
};
