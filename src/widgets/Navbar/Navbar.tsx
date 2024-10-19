'use client';

import type { NavigationMenuProps } from '@radix-ui/react-navigation-menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/shared/UIKit/NavigationMenu/NavigationMenu';
import { renderClass } from '@/shared/utils/renderClass/renderClass';
import { useNavbarItems } from '@/widgets/Navbar/lib/useNavbarItems/useNavbarItems';

const LinkItem = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon?: ReactNode;
  label: string;
}) => {
  const pathName = usePathname();

  return (
    <Link href={href} legacyBehavior passHref>
      <NavigationMenuLink
        className={navigationMenuTriggerStyle({
          className: 'gap-2',
        })}
        active={pathName === href}
      >
        {icon && icon}
        {label}
      </NavigationMenuLink>
    </Link>
  );
};

export const Navbar = ({
  orientation = 'horizontal',
}: Pick<NavigationMenuProps, 'orientation'>) => {
  const isVertical = orientation === 'vertical';
  const items = useNavbarItems();

  return (
    <NavigationMenu orientation={orientation}>
      <NavigationMenuList
        className={renderClass({
          'flex-col items-start': isVertical,
        })}
      >
        {items.map(({ label, icon, href }) => (
          <NavigationMenuItem
            className={renderClass({
              '!ml-0': isVertical,
            })}
            key={label + href}
          >
            <LinkItem href={href} icon={icon} label={label} />
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
