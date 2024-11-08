import { test } from '@playwright/test';
import { hash } from 'bcryptjs';

import { SessionPrismaService } from '@/shared/api/services/SessionPrismaService';
import { UserApiService } from '@/shared/api/services/UserApiService';

const TEST_USER_EMAIL = 'test-planning-poker@sebastiansiejek.dev';

async function createTestSession() {
  const user = await new UserApiService().getOrCreateUserByEmail({
    email: TEST_USER_EMAIL,
    name: 'Test User',
  });

  const sessionToken = 'test-session-token';
  const hashedToken = await hash(sessionToken, 10);

  const sessionPrisma = new SessionPrismaService();

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
  const sessionPrisma = new SessionPrismaService();

  test.afterAll(async () => {
    sessionPrisma.deleteMany({
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
