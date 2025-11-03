import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page title is correct
    await expect(page).toHaveTitle(/Digital Card Generator/);
    
    // Check if the main heading is visible
    const heading = page.getByRole('heading', { name: /Digital Card Generator/i });
    await expect(heading).toBeVisible();
    
    // Check if the subtitle is visible
    const subtitle = page.getByText(/Create beautiful shareable digital cards/i);
    await expect(subtitle).toBeVisible();
  });

  test('should have proper meta description', async ({ page }) => {
    await page.goto('/');
    
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute(
      'content',
      /Create beautiful shareable digital cards/i
    );
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check if the heading is still visible on mobile
    const heading = page.getByRole('heading', { name: /Digital Card Generator/i });
    await expect(heading).toBeVisible();
  });

  test('should have proper HTML structure', async ({ page }) => {
    await page.goto('/');
    
    // Check if the main element exists
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    // Check if the page is using the correct lang attribute
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'en');
  });
});

