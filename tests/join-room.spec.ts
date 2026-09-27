import { randomUUID } from 'node:crypto';

import { expect, test } from '@playwright/test';

import { getPrisma } from '@/shared/database/prisma';
import { databaseTestAuth } from '@/shared/lib/tests/utilities';
import { routes } from '@/shared/routes/routes';

databaseTestAuth();

test('signed-in user can create a room and join it by ID', async ({ page }) => {
  let roomId: string | undefined;

  try {
    await page.goto(routes.game.create.getPath());
    await page.getByTestId('game-name').click();
    await page.getByTestId('game-name').fill(`join-${randomUUID()}`);
    await page.getByTestId('create-game-submit').click();
    await page.waitForURL((url) =>
      /^\/en\/game\/(?!create$|join$)[^/]+$/.test(url.pathname) && url.pathname !== routes.game.create.getPath(),
    );
    roomId = new URL(page.url()).pathname.split('/').at(-1);
    expect(roomId).toBeTruthy();

    await page.goto(routes.game.join.getPath());
    await page.locator('input[name="id"]').click();
    await page.locator('input[name="id"]').fill(roomId!);
    await page.getByRole('button', { name: 'Join', exact: true }).click();
    await expect(page).toHaveURL('/en' + routes.game.singleGame.getPath(roomId!));
  } finally {
    if (roomId) await getPrisma().room.delete({ where: { id: roomId } });
  }
});

test('removed participant can join the same room again with its ID', async ({ page, browser }) => {
  const prisma = getPrisma();
  const memberId = randomUUID();
  const memberName = `Rejoining member ${randomUUID()}`;
  const sessionToken = randomUUID();
  const memberContext = await browser.newContext({ baseURL: 'http://localhost:3000' });
  let roomId: string | undefined;

  try {
    await prisma.user.create({
      data: {
        id: memberId,
        name: memberName,
        sessions: {
          create: { sessionToken, expires: new Date(Date.now() + 60 * 60 * 1000) },
        },
      },
    });
    await memberContext.addCookies([
      { name: 'next-auth.session-token', value: sessionToken, domain: 'localhost', path: '/' },
    ]);

    await page.goto(routes.game.create.getPath());
    await page.getByTestId('game-name').click();
    await page.getByTestId('game-name').fill(`rejoin-${randomUUID()}`);
    await page.getByTestId('create-game-submit').click();
    await page.waitForURL((url) =>
      /^\/en\/game\/(?!create$|join$)[^/]+$/.test(url.pathname),
    );
    roomId = new URL(page.url()).pathname.split('/').at(-1)!;

    const memberPage = await memberContext.newPage();
    await memberPage.goto(routes.game.join.getPath());
    await memberPage.locator('input[name="id"]').click();
    await memberPage.locator('input[name="id"]').fill(roomId);
    await memberPage.getByRole('button', { name: 'Join', exact: true }).click();
    await expect(memberPage).toHaveURL('/en' + routes.game.singleGame.getPath(roomId));
    await expect(memberPage.getByText(memberName, { exact: true })).toBeVisible();
    await expect(page.getByText(memberName, { exact: true })).toBeVisible();

    const participant = await prisma.participant.findUniqueOrThrow({
      where: { roomId_userId: { roomId, userId: memberId } },
    });
    await page.locator(`#member-${participant.id}`).hover();
    await page.getByRole('button', { name: 'Remove participant' }).click();
    await expect(memberPage).toHaveURL('/en/game/join');
    await expect.poll(async () => (await prisma.participant.findUniqueOrThrow({
      where: { id: participant.id },
    })).leftAt).not.toBeNull();

    await memberPage.goto(routes.game.singleGame.getPath(roomId));
    await expect(memberPage).toHaveURL('/en/game/join');
    await memberPage.locator('input[name="id"]').click();
    await memberPage.locator('input[name="id"]').fill(roomId);
    await memberPage.getByRole('button', { name: 'Join', exact: true }).click();
    await expect(memberPage).toHaveURL('/en' + routes.game.singleGame.getPath(roomId));
    await expect(memberPage.getByText(memberName, { exact: true })).toBeVisible();
    await expect(page.getByText(memberName, { exact: true })).toBeVisible();
    expect(await prisma.participant.findUniqueOrThrow({ where: { id: participant.id } })).toMatchObject({
      leftAt: null,
      name: memberName,
    });
  } finally {
    await memberContext.close();
    if (roomId) await prisma.room.deleteMany({ where: { id: roomId } });
    await prisma.user.delete({ where: { id: memberId } });
  }
});
