import { expect, test } from '@playwright/test';

import { databaseTestAuth } from '@/shared/lib/tests/utils';

databaseTestAuth();

const ROOM_NAME = 'test-room';

test('voting', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('start-new-game').click();
  await page.getByTestId('game-name').click();
  await page.getByTestId('game-name').fill(ROOM_NAME);
  await page.getByTestId('create-game-submit').click();

  await new Promise((resolve) => {
    setTimeout(resolve, 300);
  });

  const isMessageVisible = await page
    .locator('[data-testid="game-name"] + .form-message')
    .isVisible();

  if (isMessageVisible) {
    await page.getByTestId('join-to-game').click();
  }

  await page.waitForURL(/\/game\/\w+$/);
  await page.getByTestId('create-game-trigger-button').click();
  await page.getByTestId('create-game-submit').click();
  await page.getByTestId('voting-card-3').click();
  await page.getByTestId('reveal-cards-button').click();
  await expect(page.getByTestId('voting-avg')).toBeVisible();
});
