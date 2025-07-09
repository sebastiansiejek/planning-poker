import { MobileNavbar } from '@/widgets/MobileNavbar/mobile-navbar';
import { Navbar } from '@/widgets/Navbar/navbar';
import { UserAvatar } from '@/widgets/SiteHeader/ui/UserAvatar/user-avatar';
import { UserMenu } from '@/widgets/SiteHeader/ui/UserMenu/user-menu';

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
