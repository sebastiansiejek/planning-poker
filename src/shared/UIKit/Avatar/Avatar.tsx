import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';

import type { UserAvatarProps } from '@/shared/UIKit/Avatar/types';
import type { ILoader } from '@/types/types';

export const Avatar = ({
  url,
  size = 80,
  isLoading,
}: UserAvatarProps & ILoader) => {
  if (isLoading) return <Skeleton circle width={size} height={size} />;

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
