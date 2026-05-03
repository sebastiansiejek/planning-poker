import { test, type TestInfo } from '@playwright/test';
import { hash } from 'bcryptjs';

import { PrismaSessionService } from '@/shared/api/services/prisma/prisma-session-service';
import { PrismaUserService } from '@/shared/api/services/prisma/prisma-user-service';

const TEST_USER_EMAIL_DOMAIN = 'sebastiansiejek.dev';
const testUserEmails = new Set<string>();

const getTestUserEmail = (testInfo: TestInfo) =>
  `test-planning-poker-${testInfo.parallelIndex}@${TEST_USER_EMAIL_DOMAIN}`;

async function createTestSession(email: string) {
  const user = await new PrismaUserService().getOrCreateUserByEmail({
    email,
    name: 'Test User',
  });

  const sessionToken = 'test-session-token';
  const hashedToken = await hash(sessionToken, 10);

  const sessionPrisma = new PrismaSessionService();

  await sessionPrisma.deleteMany({
    where: {
      userId: user.id,
    },
  });
  await sessionPrisma.create({
    userId: user.id,
    expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    sessionToken: hashedToken,
  });

  return hashedToken;
}

const beforeDatabaseTestAuth = () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await page.goto('http://localhost:3000');
    const email = getTestUserEmail(testInfo);
    testUserEmails.add(email);
    const sessionToken = await createTestSession(email);

    await page.context().addCookies([
      {
        name: 'next-auth.session-token',
        value: sessionToken,
        domain: 'localhost',
        path: '/',
        sameSite: 'Lax',
      },
    ]);
  });
};

const afterDatabaseTestAuth = () => {
  const sessionPrisma = new PrismaSessionService();

  test.afterAll(async () => {
    await sessionPrisma.deleteMany({
      where: {
        user: {
          email: {
            in: [...testUserEmails],
          },
        },
      },
    });
  });
};

export const databaseTestAuth = () => {
  beforeDatabaseTestAuth();
  afterDatabaseTestAuth();
};
