'use client';

import { hasLocale, useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui-kit/select/select';

export const LanguageSwitcher = () => {
  const locale = useLocale();
  const translate = useTranslations('Common');
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={locale}
      disabled={isPending}
      onValueChange={(nextLocale) => {
        if (!hasLocale(routing.locales, nextLocale)) return;
        startTransition(() => {
          router.replace(
            pathname + window.location.search + window.location.hash,
            { locale: nextLocale },
          );
        });
      }}
    >
      <SelectTrigger
        aria-label={translate('language')}
        size="sm"
        className="gap-1.5 border-0 bg-transparent px-2 shadow-none hover:bg-accent dark:bg-transparent dark:hover:bg-accent"
      >
        <SelectValue>{locale.toUpperCase()}</SelectValue>
      </SelectTrigger>
      <SelectContent position="popper" align="end">
        <SelectItem value="en" lang="en">
          English
        </SelectItem>
        <SelectItem value="pl" lang="pl">
          Polski
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
