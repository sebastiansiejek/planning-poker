import { Avatar } from '@/shared/UIKit/Avatar/Avatar';
import type { MemberAvatarProps } from '@/widgets/Member/MemberAvatar/types';

export const MemberAvatar = ({ avatarUrl, isLoading }: MemberAvatarProps) => {
  if (!avatarUrl && !isLoading) return null;

  return (
    <div className="mt-2">
      <Avatar url={avatarUrl as string} size={40} isLoading={isLoading} />
    </div>
  );
};
