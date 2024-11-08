import Link from 'next/link';

import { META_CONSTANTS } from '@/shared/global/config/META_CONSTANTS';
import { Button } from '@/shared/UIKit/Button/Button';
import { ThemeSwitcher } from '@/widgets/ThemeSwitcher/ui/ThemeSwitcher';

export const SiteFooter = () => {
  return (
    <div className="mt-auto">
      <footer className="flex justify-center items-center gap-2 p-2 text-xs text-center mt-6 bg-gray-100 dark:bg-gray-900">
        <a
          href={META_CONSTANTS.author.url}
          target="_blank"
          rel="nofollow"
          className="transition hover:text-primary-500"
        >
          {META_CONSTANTS.author.name}
        </a>
        <ThemeSwitcher />
        <Link
          href="https://www.buymeacoffee.com/sebastiansiejek"
          target="_blank"
          passHref
          rel="noopener noreferrer"
        >
          <Button variant="secondary" size="sm">
            ☕ Buy me a coffee
          </Button>
        </Link>
      </footer>
    </div>
  );
};
