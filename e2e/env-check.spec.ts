import { test, expect } from '@playwright/test';

test.describe('Environment and Configuration', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check page loads
    await expect(page).toHaveTitle(/Digital Card/i);
    await expect(page.getByRole('heading', { name: /Digital Card Generator/i })).toBeVisible();
  });

  test('should display all three card types', async ({ page }) => {
    await page.goto('/');
    
    // All three card types should be visible
    await expect(page.getByRole('heading', { name: /Business Card/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Bank Card/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Personal Card/i })).toBeVisible();
  });

  test('should have My Cards link on homepage', async ({ page }) => {
    await page.goto('/');
    
    const myCardsLink = page.getByRole('link', { name: /My Cards/i });
    await expect(myCardsLink).toBeVisible();
    await expect(myCardsLink).toHaveAttribute('href', '/my-cards');
  });

  test('should navigate to personal card form', async ({ page }) => {
    await page.goto('/');
    
    const personalLink = page.getByRole('link', { name: /Personal Card/i });
    await personalLink.click();
    
    await expect(page).toHaveURL('/create/personal');
    await expect(page.getByRole('heading', { name: /Create Personal Card/i })).toBeVisible();
  });
});

