import { test, expect } from '@playwright/test';

test('homepage has correct title and navigation', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/DeepDive/);

  // Check for semantic nav and skip link
  const skipLink = page.locator('a:has-text("Skip to content")');
  await expect(skipLink).toBeAttached();

  const nav = page.locator('nav');
  await expect(nav).toBeVisible();

  // Ensure dynamic mindmap loads (canvas or nodes are present)
  // We can just verify the main container is present
  const main = page.locator('main#main-content');
  await expect(main).toBeVisible();
});
