import { expect, test } from '@playwright/test';

test('starts the Three.js bootstrap scene', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveText(/Three.js is ready/);
  await expect(page.locator('#game-canvas canvas')).toBeVisible();
});
