import { randomUUID } from 'node:crypto';

import { expect, test } from '@playwright/test';

import { getPrisma } from '@/shared/database/prisma';
import { databaseTestAuth } from '@/shared/lib/tests/utilities';
import { routes } from '@/shared/routes/routes';

databaseTestAuth();

test('changing an account name updates another viewer’s room board', async ({ page, browser }) => {
  const prisma = getPrisma();
  const firstName = `Member ${randomUUID()}`;
  const updatedName = `Renamed ${randomUUID()}`;
  const secondUserId = randomUUID();
  const sessionToken = randomUUID();
  let roomId: string | undefined;
  const secondContext = await browser.newContext({ baseURL: 'http://localhost:3000' });

  try {
    await prisma.user.create({
      data: {
        id: secondUserId,
        name: firstName,
        sessions: {
          create: { sessionToken, expires: new Date(Date.now() + 60 * 60 * 1000) },
        },
      },
    });
    await secondContext.addCookies([
      { name: 'next-auth.session-token', value: sessionToken, domain: 'localhost', path: '/' },
    ]);

    await page.goto(routes.game.create.getPath());
    await page.getByTestId('game-name').click();
    await page.getByTestId('game-name').fill(`name-update-${randomUUID()}`);
    await page.getByTestId('create-game-submit').click();
    await page.waitForURL((url) =>
      /^\/en\/game\/(?!create$|join$)[^/]+$/.test(url.pathname) && url.pathname !== routes.game.create.getPath(),
    );
    roomId = new URL(page.url()).pathname.split('/').at(-1);
    expect(roomId).toBeTruthy();

    const secondPage = await secondContext.newPage();
    await secondPage.goto(routes.game.singleGame.getPath(roomId!));
    await page.reload();
    await expect(page.getByText(firstName, { exact: true })).toBeVisible();

    await secondPage.goto(routes.userSettings.getPath());
    await secondPage.getByRole('textbox', { name: 'Name' }).click();
    await secondPage.getByRole('textbox', { name: 'Name' }).fill(updatedName);
    const updateResponse = secondPage.waitForResponse(
      (response) => response.url().endsWith('/api/user') && response.request().method() === 'PUT',
    );
    await secondPage.getByRole('button', { name: 'Save' }).click();
    const savedResponse = await updateResponse;
    expect(savedResponse.status()).toBe(200);
    expect(savedResponse.request().postDataJSON().name).toBe(updatedName);

    await expect(page.getByText(updatedName, { exact: true })).toBeVisible();
    await expect(page.getByText(firstName, { exact: true })).toHaveCount(0);
    const participant = await prisma.participant.findUnique({
      where: { roomId_userId: { roomId: roomId!, userId: secondUserId } },
    });
    expect(participant?.name).toBe(updatedName);
  } finally {
    await secondContext.close();
    if (roomId) await prisma.room.delete({ where: { id: roomId } });
    await prisma.user.deleteMany({ where: { id: secondUserId } });
  }
});
