import { randomUUID } from 'node:crypto';

import { expect, test } from '@playwright/test';

import { getPrisma } from '@/shared/database/prisma';
import { databaseTestAuth } from '@/shared/lib/tests/utilities';
import { routes } from '@/shared/routes/routes';

databaseTestAuth();

test('a signed-in nonmember cannot replay a room action', async ({ page, request }) => {
  const prisma = getPrisma();
  let roomId: string | undefined;
  let attackerId: string | undefined;

  try {
    await page.goto(routes.game.create.getPath());
    await page.getByTestId('game-name').click();
    await page.getByTestId('game-name').fill(`authorization-${randomUUID()}`);
    await page.getByTestId('create-game-submit').click();
    await page.waitForURL((url) =>
      /^\/game\/[^/]+$/.test(url.pathname) && url.pathname !== routes.game.create.getPath(),
    );
    roomId = new URL(page.url()).pathname.split('/').at(-1);
    expect(roomId).toBeTruthy();

    await page.getByTestId('create-game-trigger-button').click();
    const actionRequestPromise = page.waitForRequest(
      (sentRequest) => sentRequest.method() === 'POST' && !!sentRequest.headers()['next-action'],
    );
    await page.getByTestId('create-game-submit').click();
    const actionRequest = await actionRequestPromise;
    await page.getByTestId('voting-card-3').click();
    await page.getByTestId('reveal-cards-button').click();
    await expect(page.getByTestId('voting-avg')).toBeVisible();

    const gameCount = await prisma.game.count({ where: { roomId } });
    const attackerToken = randomUUID();
    const attacker = await prisma.user.create({
      data: {
        id: randomUUID(),
        name: 'Nonmember',
        sessions: {
          create: { sessionToken: attackerToken, expires: new Date(Date.now() + 60 * 60 * 1000) },
        },
      },
    });
    attackerId = attacker.id;

    const headers = { ...actionRequest.headers() };
    delete headers['content-length'];
    headers.cookie = `next-auth.session-token=${attackerToken}`;
    const response = await request.post(actionRequest.url(), {
      headers,
      data: actionRequest.postDataBuffer()!,
    });

    expect(response.status()).toBe(200);
    expect(await response.text()).toContain('unauthorized');
    expect(await prisma.game.count({ where: { roomId } })).toBe(gameCount);
  } finally {
    if (roomId) await prisma.room.delete({ where: { id: roomId } });
    if (attackerId) await prisma.user.delete({ where: { id: attackerId } });
  }
});
