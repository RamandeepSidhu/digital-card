import { test, expect } from '@playwright/test';

test.describe('My Cards Page', () => {
  test('should display empty state when no cards exist', async ({ page }) => {
    // Clear localStorage
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    
    await page.goto('/my-cards');
    
    // Check for empty state
    await expect(page.getByText(/No Cards Yet/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Create a Card/i })).toBeVisible();
  });

  test('should display created cards on My Cards page', async ({ page }) => {
    // First create a card
    await page.goto('/create/business');
    
    await page.getByLabel(/Full Name/i).fill('John Doe');
    await page.getByLabel(/Job Title/i).fill('Engineer');
    await page.getByLabel(/Company/i).fill('Company');
    await page.getByLabel(/Email/i).fill('john@example.com');
    await page.getByLabel(/Phone/i).fill('1234567890');
    
    await page.getByRole('button', { name: /Create Card/i }).click();
    
    // Wait for modal - use first() to handle multiple matches
    const successModal = page.getByText(/Your Card is Ready!/i).first();
    await expect(successModal).toBeVisible({ timeout: 10000 });
    
    // Navigate to My Cards page
    await page.goto('/my-cards');
    
    // Check that card is displayed
    await expect(page.getByText(/Business Card/i).first()).toBeVisible();
    await expect(page.getByText(/John Doe/i).first()).toBeVisible();
    
    // Check for view and delete buttons
    await expect(page.getByRole('link', { name: /View/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Delete/i }).first()).toBeVisible();
  });

  test('should navigate to card view page from My Cards', async ({ page }) => {
    // Create a card first
    await page.goto('/create/business');
    await page.getByLabel(/Full Name/i).fill('Test User');
    await page.getByLabel(/Job Title/i).fill('Developer');
    await page.getByLabel(/Company/i).fill('Company');
    await page.getByLabel(/Email/i).fill('test@example.com');
    await page.getByLabel(/Phone/i).fill('1234567890');
    await page.getByRole('button', { name: /Create Card/i }).click();
    await expect(page.getByText(/Your Card is Ready!/i)).toBeVisible({ timeout: 10000 });
    
    // Go to My Cards
    await page.goto('/my-cards');
    
    // Click view button
    const viewButton = page.getByRole('link', { name: /View/i }).first();
    await viewButton.click();
    
    // Should navigate to card page
    await expect(page).toHaveURL(/\/card\/[a-zA-Z0-9_-]+/);
  });

  test('should have My Cards link on homepage', async ({ page }) => {
    await page.goto('/');
    
    const myCardsLink = page.getByRole('link', { name: /My Cards/i });
    await expect(myCardsLink).toBeVisible();
    
    await myCardsLink.click();
    await expect(page).toHaveURL('/my-cards');
  });
});

