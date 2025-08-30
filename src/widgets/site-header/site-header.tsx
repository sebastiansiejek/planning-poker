import { MobileNavbar } from '@/widgets/mobile-navbar/mobile-navbar';
import { Navbar } from '@/widgets/navbar/navbar';
import { UserAvatar } from '@/widgets/site-header/ui/user-avatar/user-avatar';
import { UserMenu } from '@/widgets/site-header/ui/user-menu/user-menu';

export const SiteHeader = async () => {
  return (
    <div className="sticky bg-white dark:bg-gray-900 flex items-center justify-between top-0 p-2 z-20">
      <div className="lg:hidden">
        <MobileNavbar />
      </div>
      <div className="hidden lg:block">
        <Navbar />
      </div>
      <div className="flex items-center gap-1 ml-auto">
        <UserAvatar />
        <UserMenu />
      </div>
    </div>
  );
};
