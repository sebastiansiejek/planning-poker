import { expect, test } from '@playwright/test';

import { databaseTestAuth } from '@/shared/lib/tests/utils';

databaseTestAuth();

test('voting', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('go-to-game').click();
  await page.getByTestId('game-name').click();
  await page.getByTestId('game-name').fill('Room123');
  await page.getByTestId('create-game-submit').click();
  await page.getByTestId('login-name').click();
  await page.getByTestId('login-name').fill('John');
  await page.getByTestId('login-submit').click();
  await page.getByTestId('voting-card-3').click();
  await page.getByTestId('reveal-cards-button').click();
  await expect(page.getByTestId('voting-avg')).toBeVisible();
});
