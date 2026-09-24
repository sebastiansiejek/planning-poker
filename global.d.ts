import type en from './messages/en.json';
import type { PrismaClient } from '@prisma/client';

type Messages = typeof en;

declare global {
  // Use type safe message keys with `next-intl`
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface IntlMessages extends Messages {}
  var prismaGlobal: PrismaClient | undefined;
}
