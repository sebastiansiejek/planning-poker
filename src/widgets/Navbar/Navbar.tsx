'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { renderClass } from '@/shared/utils/renderClass/renderClass';
import { useNavbarItems } from '@/widgets/Navbar/lib/useNavbarItems/useNavbarItems';

export const Navbar = () => {
  const pathName = usePathname();
  const items = useNavbarItems();

  return (
    <nav>
      <ul className="flex gap-4">
        {items.map(({ label, href, icon }) => (
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
