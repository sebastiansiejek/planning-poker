'use client';

import { ChevronDown, LayoutDashboard, LogOut, Settings } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

import { getPathname, Link, usePathname } from '@/i18n/navigation';
import { routes } from '@/shared/routes/routes';
import { buttonVariants } from '@/shared/ui-kit/button/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui-kit/dropdown-menu/dropdown-menu';

export const UserMenu = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const { data } = useSession();
  const isLogged = !!data;
  const translations = useTranslations();
  const [isActive, setIsActive] = useState(false);

  if (!isLogged) {
    return (
      <Link
        className={buttonVariants({ variant: 'ghost' })}
        href={{
          pathname: routes.login.getPath(),
          query: { callbackUrl: getPathname({ locale, href: pathname }) },
        }}
      >
        {translations('Common.signIn')}
      </Link>
    );
  }

  return (
    <DropdownMenu onOpenChange={(open) => setIsActive(open)}>
      <DropdownMenuTrigger className="flex gap-2 items-center">
        <div>{data.user.name}</div>
        <ChevronDown
          className={isActive ? 'transform rotate-180' : ''}
          size={16}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link href={routes.dashboard.getPath()}>
          <DropdownMenuItem>
            <LayoutDashboard />
            {translations('UserMenu.dashboard')}
          </DropdownMenuItem>
        </Link>
        <Link href={routes.userSettings.getPath()}>
          <DropdownMenuItem>
            <Settings />
            {translations('UserSettings.title')}
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            signOut({
              callbackUrl: getPathname({ locale, href: routes.home.getPath() }),
            })
          }
        >
          <LogOut />
          {translations('UserMenu.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
