import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { MetaConstants } from '@/shared/global/config/meta-constants';
import { buttonVariants } from '@/shared/ui-kit/button/button';
import { LanguageSwitcher } from '@/widgets/language-switcher/language-switcher';
import { ThemeSwitcher } from '@/widgets/theme-switcher/ui/theme-switcher';

export const SiteFooter = () => {
  const translate = useTranslations('Common');
  return (
    <div className="mt-auto">
      <footer className="flex flex-wrap justify-center items-center gap-2 p-2 text-xs text-center mt-6 bg-gray-100 dark:bg-gray-900">
        <a
          href={MetaConstants.author.url}
          target="_blank"
          rel="nofollow"
          className="transition hover:text-primary-500"
        >
          {MetaConstants.author.name}
        </a>
        <ThemeSwitcher />
        <LanguageSwitcher />
        <Link
          href="https://www.buymeacoffee.com/sebastiansiejek"
          target="_blank"
          passHref
          rel="noopener noreferrer"
          className={buttonVariants({variant: 'secondary', size: 'sm'})}
        >
            ☕ {translate('buyCoffee')}
        </Link>
      </footer>
    </div>
  );
};
