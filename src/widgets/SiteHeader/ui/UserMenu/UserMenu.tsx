'use client';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import type { PropsWithChildren } from 'react';
import type { IconType } from 'react-icons';
import { IoIosArrowDown } from 'react-icons/io';
import { MdOutlineLogout } from 'react-icons/md';

import { Button } from '@/shared/UIKit/Button/Button';
import type { UserMenuProps } from '@/widgets/SiteHeader/ui/UserMenu/UserMenu.types';

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
  onClick: () => void;
}>) => {
  return (
    <MenuItem>
      <button
        type="button"
        className="w-full text-left flex items-center gap-2 dark:data-[focus]:bg-gray-700 data-[focus]:bg-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 p-2 rounded-md text-sm"
        onClick={onClick}
      >
        {Icon && <Icon />}
        {children}
      </button>
    </MenuItem>
  );
};

export const UserMenu = ({ isLogged }: UserMenuProps) => {
  const translations = useTranslations();

  if (!isLogged) {
    return (
      <Button variant="text" onClick={() => signIn()}>
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
        <MenuItemButton
          Icon={MdOutlineLogout}
          onClick={() =>
            signOut({
              redirect: false,
            })
          }
        >
          {translations('UserMenu.logout')}
        </MenuItemButton>
      </MenuItems>
    </Menu>
  );
};
