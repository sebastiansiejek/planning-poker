'use client';

import {
  Button as ButtonHeadlessUI,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import type { LucideProps } from 'lucide-react';
import { ArrowDown, LayoutDashboard, LogOut } from 'lucide-react';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import type { FC, PropsWithChildren } from 'react';

import { routes } from '@/shared/routes/routes';
import { Button } from '@/shared/UIKit/Button/Button';

const UserName = () => {
  const { data } = useSession();

  if (!data) {
    return null;
  }

  const {
    user: { name },
  } = data;

  return <div>{name}</div>;
};

const MenuItemButton = ({
  children,
  Icon,
  onClick,
}: PropsWithChildren<{
  Icon?: FC<LucideProps>;
  onClick?: () => void;
}>) => {
  return (
    <MenuItem>
      <ButtonHeadlessUI
        type="button"
        className="w-full text-left flex items-center gap-2 dark:data-[focus]:bg-gray-700 data-[focus]:bg-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 p-2 rounded-md text-sm"
        onClick={onClick}
      >
        {Icon && <Icon size={16} />}
        {children}
      </ButtonHeadlessUI>
    </MenuItem>
  );
};

export const UserMenu = () => {
  const { data } = useSession();
  const isLogged = !!data;
  const translations = useTranslations();

  if (!isLogged) {
    return (
      <Button variant="ghost" onClick={() => signIn()}>
        {translations('Common.signIn')}
      </Button>
    );
  }

  return (
    <Menu as="nav">
      <MenuButton className="flex items-center gap-1">
        {({ active }) => (
          <>
            <UserName />
            <ArrowDown
              className={active ? 'transform rotate-180' : ''}
              size={16}
            />
          </>
        )}
      </MenuButton>
      <MenuItems
        anchor="bottom start"
        className="bg-gray-100 dark:bg-gray-800 w-56 mt-4 p-1"
      >
        <Link href={routes.dashboard.getPath()}>
          <MenuItemButton Icon={LayoutDashboard}>
            {translations('UserMenu.dashboard')}
          </MenuItemButton>
        </Link>
        <MenuItemButton Icon={LogOut} onClick={() => signOut()}>
          {translations('UserMenu.logout')}
        </MenuItemButton>
      </MenuItems>
    </Menu>
  );
};
