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
              className="text-sm flex items-center gap-2 p-1 transition hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
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
