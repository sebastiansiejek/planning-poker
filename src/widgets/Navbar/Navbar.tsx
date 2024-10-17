'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/shared/UIKit/NavigationMenu/NavigationMenu';
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

export const Navbar = () => {
  const items = useNavbarItems();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {items.map(({ label, icon, href, components }) => (
          <NavigationMenuItem key={label + href}>
            {components?.length && (
              <>
                <NavigationMenuTrigger className="gap-2">
                  {icon}
                  {label}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {components.map((props) => {
                      return <LinkItem key={props.href} {...props} />;
                    })}
                  </ul>
                </NavigationMenuContent>
              </>
            )}
            {href && <LinkItem href={href} icon={icon} label={label} />}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
