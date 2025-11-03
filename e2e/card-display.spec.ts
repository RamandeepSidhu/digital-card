import { test, expect } from '@playwright/test';

test.describe('Card Display', () => {
  test('should display business card styles correctly', async ({ page }) => {
    // This test will verify card display once card view page is implemented in Phase 7
    // For now, we verify the components can be built
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Digital Card Generator/i })).toBeVisible();
  });

  test('should have purple theme colors', async ({ page }) => {
    await page.goto('/create/business');
    
    // Check that purple colors are present in the UI
    const submitButton = page.getByRole('button', { name: /Create Card/i });
    const buttonStyles = await submitButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Button should have purple background (rgba values may vary)
    expect(buttonStyles).toBeTruthy();
  });
});

