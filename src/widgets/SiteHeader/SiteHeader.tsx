import { Navbar } from '@/widgets/Navbar/Navbar';
import { UserAvatar } from '@/widgets/SiteHeader/ui/UserAvatar/UserAvatar';
import { UserMenu } from '@/widgets/SiteHeader/ui/UserMenu/UserMenu';

export const SiteHeader = async () => {
  return (
    <div className="sticky flex items-center justify-between top-0 p-2">
      <Navbar />
      <div className="flex items-center gap-1 ml-auto">
        <UserAvatar />
        <UserMenu />
      </div>
    </div>
  );
};
