import { Avatar, AvatarImage } from '@/shared/ui-kit/avatar/avatar';
import type { MemberAvatarProperties } from '@/widgets/member/ui/member-avatar/types';

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
