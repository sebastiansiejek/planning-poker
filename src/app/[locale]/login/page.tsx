import { getLocale, getTranslations } from 'next-intl/server';
import { z } from 'zod';

import { getLoginCallback } from '@/shared/auth/login-callback';
import { Container } from '@/shared/ui-kit/container/container';
import { PageHeading } from '@/shared/ui-kit/page-heading/page-heading';
import { getPageMetaData } from '@/shared/utils/get-page-meta-data';
import { SignIn } from '@/widgets/sign-in/sign-in';

export async function generateMetadata() {
  const translate = await getTranslations('Common');
  return getPageMetaData({ title: translate('signIn') });
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await getLocale();
  const translate = await getTranslations();
  const query = z
    .object({
      callbackUrl: z.string().optional(),
      error: z.string().optional(),
    })
    .safeParse(await searchParams);
  const callbackUrl = getLoginCallback(query.data?.callbackUrl, locale);

  return (
    <Container>
      <PageHeading title={translate('Common.signIn')} />
      <SignIn callbackUrl={callbackUrl} hasError={!!query.data?.error} />
    </Container>
  );
}
