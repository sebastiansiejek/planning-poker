'use client';

import {
  Button as ButtonHeadlessUI,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import type { PropsWithChildren } from 'react';
import type { IconType } from 'react-icons';
import { IoIosArrowDown } from 'react-icons/io';
import { MdOutlineDashboard, MdOutlineLogout } from 'react-icons/md';

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
  Icon?: IconType;
  onClick?: () => void;
}>) => {
  return (
    <MenuItem>
      <ButtonHeadlessUI
        type="button"
        className="w-full text-left flex items-center gap-2 dark:data-[focus]:bg-gray-700 data-[focus]:bg-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 p-2 rounded-md text-sm"
        onClick={onClick}
      >
        {Icon && <Icon />}
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
            <IoIosArrowDown className={active ? 'transform rotate-180' : ''} />
          </>
        )}
      </MenuButton>
      <MenuItems
        anchor="bottom start"
        className="bg-gray-100 dark:bg-gray-800 w-56 mt-4 p-1"
      >
        <Link href={routes.dashboard.getPath()}>
          <MenuItemButton Icon={MdOutlineDashboard}>
            {translations('UserMenu.dashboard')}
          </MenuItemButton>
        </Link>
        <MenuItemButton Icon={MdOutlineLogout} onClick={() => signOut()}>
          {translations('UserMenu.logout')}
        </MenuItemButton>
      </MenuItems>
    </Menu>
  );
};
