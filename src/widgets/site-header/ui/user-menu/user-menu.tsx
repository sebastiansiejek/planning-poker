'use client';

import { ChevronDown, LayoutDashboard, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { routes } from '@/shared/routes/routes';
import { Button } from '@/shared/UIKit/button/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/UIKit/dropdown-menu/dropdown-menu';

export const UserMenu = () => {
  const { data } = useSession();
  const isLogged = !!data;
  const translations = useTranslations();
  const [isActive, setIsActive] = useState(false);

  if (!isLogged) {
    return (
      <Button variant="ghost" onClick={() => signIn()}>
        {translations('Common.signIn')}
      </Button>
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
        <Link href={routes.dashboard.getPath()} legacyBehavior>
          <DropdownMenuItem>
            <LayoutDashboard />
            {translations('UserMenu.dashboard')}
          </DropdownMenuItem>
        </Link>
        <Link href={routes.userSettings.getPath()} legacyBehavior>
          <DropdownMenuItem>
            <Settings />
            {translations('UserSettings.title')}
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut />
          {translations('UserMenu.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
