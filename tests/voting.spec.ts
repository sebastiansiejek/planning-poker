import { expect, test } from '@playwright/test';

import { databaseTestAuth } from '@/shared/lib/tests/utilities';

databaseTestAuth();

test('voting', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('start-new-game').click();
  await page.getByTestId('game-name').click();
  await page.getByTestId('game-name').fill(`test-${Math.random()}`);
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
  const estimate = page.getByRole('group', { name: 'Choose your estimate' }).getByRole('radio', { name: '3', exact: true });
  await estimate.focus();
  await expect(estimate).toBeFocused();
  await page.keyboard.press('Space');
  await expect(estimate).toBeChecked();
  await page.getByTestId('reveal-cards-button').click();
  await expect(page.getByTestId('voting-avg')).toBeVisible();
});
