'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { FaGamepad, FaHome } from 'react-icons/fa';

import { routes } from '@/shared/routes/routes';
import { renderClass } from '@/shared/utils/renderClass/renderClass';

export const Navbar = () => {
  const translate = useTranslations('Navbar');
  const pathName = usePathname();
  const navbarLinks = useMemo(
    () => [
      {
        label: translate('home'),
        href: routes.home.getPath(),
        icon: <FaHome />,
      },
      {
        label: translate('createGame'),
        href: routes.game.getPath(),
        icon: <FaGamepad />,
      },
    ],
    [translate],
  );
  return (
    <nav className="flex">
      <ul className="flex gap-4">
        {navbarLinks.map(({ label, href, icon }) => (
          <li
            key={label}
            className={renderClass({
              'text-primary-500': pathName === href,
            })}
          >
            <Link
              href={href}
              className="flex items-center gap-2 transition hover:text-primary-500"
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
