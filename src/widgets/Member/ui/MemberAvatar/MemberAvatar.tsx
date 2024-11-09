import { Avatar, AvatarImage } from '@/shared/UIKit/Avatar/Avatar';
import type { MemberAvatarProps } from '@/widgets/Member/ui/MemberAvatar/types';

export const MemberAvatar = ({ image }: MemberAvatarProps) => {
  if (!image) return null;

  return (
    <div className="mt-2">
      <Avatar>
        <AvatarImage src={image as string} height={40} />
      </Avatar>
    </div>
  );
};
