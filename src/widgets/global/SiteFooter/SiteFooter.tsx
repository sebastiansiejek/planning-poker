import { META_CONSTANTS } from '@/shared/global/model/META_CONSTANTS';
import { ThemeSwitcher } from '@/widgets/global/ThemeSwitcher/ThemeSwitcher';

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
      </footer>
    </div>
  );
};
