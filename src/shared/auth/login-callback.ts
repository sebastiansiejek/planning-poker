import { hasLocale } from 'next-intl';

import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { routes } from '@/shared/routes/routes';

export function getLoginCallback(
  value: string | undefined,
  locale: (typeof routing.locales)[number],
) {
  const fallback = getPathname({ locale, href: routes.dashboard.getPath() });
  if (!value) return fallback;

  try {
    const base = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const url = new URL(value, base);
    if (url.origin !== new URL(base).origin) return fallback;
    const segments = url.pathname.split('/');
    if (hasLocale(routing.locales, segments[1])) segments.splice(1, 1);
    const pathname = segments.join('/') || '/';
    if (pathname === routes.login.getPath() || pathname.startsWith('/api/'))
      return fallback;
    return getPathname({ locale, href: pathname }) + url.search + url.hash;
  } catch {
    return fallback;
  }
}
