import { Avatar, AvatarImage } from '@/shared/UIKit/Avatar/avatar';
import type { MemberAvatarProperties } from '@/widgets/Member/ui/MemberAvatar/types';

export const MemberAvatar = ({ image }: MemberAvatarProperties) => {
  if (!image) return null;

  return (
    <div className="mt-2">
      <Avatar>
        <AvatarImage src={image as string} height={40} />
      </Avatar>
    </div>
  );
};
