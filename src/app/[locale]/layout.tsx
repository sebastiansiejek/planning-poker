import '@/app/globals.css';

import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

import { routing } from '@/i18n/routing';
import { getSession } from '@/shared/auth/auth';
import SessionProvider from '@/shared/auth/session-provider';
import { MetaConstants } from '@/shared/global/config/meta-constants';
import { Toaster } from '@/shared/ui-kit/toast/model/toaster';
import { getPageMetaData } from '@/shared/utils/get-page-meta-data';
import { SiteFooter } from '@/widgets/site-footer/ui/site-footer';
import { SiteHeader } from '@/widgets/site-header/site-header';

const inter = Inter({ subsets: ['latin', 'latin-ext'] });

export async function generateMetadata(properties: {
  params: Promise<{ locale: string }>;
}) {
  const parameters = await properties.params;

  const { locale } = parameters;

  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale });

  return getPageMetaData({
    description: t('Meta.description'),
    authors: [MetaConstants.author],
  });
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const session = await getSession();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <NextIntlClientProvider>
            <ThemeProvider attribute="class" disableTransitionOnChange>
              <div className="h-screen flex flex-col">
                <SiteHeader />
                {children}
                <SiteFooter />
              </div>
              <Toaster />
            </ThemeProvider>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
