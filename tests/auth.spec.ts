import { expect, test } from '@playwright/test';

import { databaseTestAuth } from '@/shared/lib/tests/utils';
import { routes } from '@/shared/routes/routes';

databaseTestAuth();

test('Authenticated page access', async ({ page }) => {
  await page.goto(routes.dashboard.getPath());
  await expect(page.locator('h2')).toHaveText('Games in which you participate');
});
