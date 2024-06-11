import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

import { ThemeSwitcher } from '@/widgets/global/ThemeSwitcher/ThemeSwitcher';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <div className="h-screen flex flex-col">
              {children}
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
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
