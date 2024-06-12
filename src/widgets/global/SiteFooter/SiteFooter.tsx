import { ThemeSwitcher } from '@/widgets/global/ThemeSwitcher/ThemeSwitcher';

export const SiteFooter = () => {
  return (
    <div className="mt-auto">
      <footer className="flex justify-center items-center gap-2 p-2 text-xs text-center mt-6 bg-gray-100 dark:bg-gray-900">
        <a
          href="https://sebastiansiejek.dev"
          target="_blank"
          rel="nofollow"
          className="transition hover:text-primary-500"
        >
          sebastiansiejek.dev
        </a>
        <ThemeSwitcher />
      </footer>
    </div>
  );
};
