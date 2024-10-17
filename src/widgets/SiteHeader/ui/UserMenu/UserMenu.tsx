'use client';

import { ChevronDown, LayoutDashboard, LogOut } from 'lucide-react';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { routes } from '@/shared/routes/routes';
import { Button } from '@/shared/UIKit/Button/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/UIKit/DropdownMenu/DropdownMenu';

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
        <Link href={routes.dashboard.getPath()}>
          <DropdownMenuItem>
            <LayoutDashboard />
            {translations('UserMenu.dashboard')}
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
