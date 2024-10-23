import './globals.css';

import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

import { getSession } from '@/shared/auth/auth';
import SessionProvider from '@/shared/auth/SessionProvider';
import { META_CONSTANTS } from '@/shared/global/config/META_CONSTANTS';
import { Toaster } from '@/shared/UIKit/Toast/model/Toaster';
import { SiteFooter } from '@/widgets/SiteFooter/ui/SiteFooter';
import { SiteHeader } from '@/widgets/SiteHeader/SiteHeader';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale });

  return {
    title: 'Planning Poker',
    description: t('Meta.description'),
    authors: [META_CONSTANTS.author],
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const session = await getSession();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <NextIntlClientProvider messages={messages}>
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
