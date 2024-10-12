import { Avatar } from '@/shared/UIKit/Avatar/Avatar';
import type { MemberAvatarProps } from '@/widgets/Member/ui/MemberAvatar/types';

export const MemberAvatar = ({ image, isLoading }: MemberAvatarProps) => {
  if (!image && !isLoading) return null;

  return (
    <div className="mt-2">
      <Avatar url={image as string} size={40} isLoading={isLoading} />
    </div>
  );
};
