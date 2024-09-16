import type { Session } from 'next-auth';

import { Avatar } from '@/shared/UIKit/Avatar/Avatar';

export const UserAvatar = ({ image }: Pick<Session['user'], 'image'>) => {
  return <div>{image && <Avatar url={image} size={40} />}</div>;
};
