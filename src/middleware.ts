// export { default } from 'next-auth/middleware';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ApiSessionClient } from '@/shared/api/session/ApiSessionClient';
import { routes } from '@/shared/routes/routes';

export const config = { matcher: ['/dashboard/:path*', '/game/:path*'] };

// eslint-disable-next-line func-names,import/no-anonymous-default-export
export default async function (request: NextRequest) {
  const sessionCookie = request.cookies.get('next-auth.session-token')?.value;

  if (sessionCookie) {
    const apiSessionClient = new ApiSessionClient();
    const sessionResponse = await apiSessionClient.getSession({
      cookie: request.headers.get('cookie') || '',
      url: request.nextUrl.origin,
    });

    if (sessionResponse.status !== 200) {
      return NextResponse.redirect(
        new URL(routes.login.getPath(), request.url),
      );
    }
  }

  if (!sessionCookie) {
    return NextResponse.redirect(new URL(routes.login.getPath(), request.url));
  }

  return NextResponse.next();
}
