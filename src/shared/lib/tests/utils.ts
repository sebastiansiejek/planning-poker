import { test } from '@playwright/test';
import { hash } from 'bcryptjs';

import { UserApiService } from '@/shared/api/services/UserApiService';
import prisma from '@/shared/database/prisma';

const TEST_USER_EMAIL = 'test-planning-poker@sebastiansiejek.dev';

async function createTestSession() {
  const user = await new UserApiService().getOrCreateUserByEmail({
    email: TEST_USER_EMAIL,
    name: 'Test User',
  });

  const sessionToken = 'test-session-token';
  const hashedToken = await hash(sessionToken, 10);

  await prisma.session.deleteMany({
    where: {
      userId: user.id,
    },
  });

  await prisma.session.create({
    data: {
      userId: user.id,
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      sessionToken: hashedToken,
    },
  });

  return hashedToken;
}

const beforeDatabaseTestAuth = () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    const sessionToken = await createTestSession();

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
  test.afterAll(async () => {
    prisma.session.deleteMany({
      where: {
        user: {
          email: TEST_USER_EMAIL,
        },
      },
    });
  });
};

export const databaseTestAuth = () => {
  beforeDatabaseTestAuth();
  afterDatabaseTestAuth();
};
