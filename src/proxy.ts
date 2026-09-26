import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { hasLocale } from 'next-intl';
import createMiddleware from 'next-intl/middleware';

import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { ApiSessionClient } from '@/shared/api/session/api-session-client';
import { routes } from '@/shared/routes/routes';

const handleI18nRouting = createMiddleware(routing);

export const config = {
  matcher: '/((?!api|_next|_vercel|monitoring|.*\\..*).*)',
};

export async function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);
  if (response.headers.has('location')) return response;

  const [, locale, section] = request.nextUrl.pathname.split('/');
  if (!hasLocale(routing.locales, locale) || !['dashboard', 'game'].includes(section)) {
    return response;
  }

  const sessionCookie =
    request.cookies.get('next-auth.session-token')?.value ??
    request.cookies.get('__Secure-next-auth.session-token')?.value;
  if (sessionCookie) {
    const sessionResponse = await new ApiSessionClient().getSession({
      cookie: request.headers.get('cookie') || '',
      url: request.nextUrl.origin,
    });
    if (sessionResponse.status === 200) return response;
  }

  const loginUrl = new URL(getPathname({ locale, href: routes.login.getPath() }), request.url);
  loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname + request.nextUrl.search);
  const loginResponse = NextResponse.redirect(loginUrl);
  for (const cookie of response.cookies.getAll()) loginResponse.cookies.set(cookie);
  return loginResponse;
}
