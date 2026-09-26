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
