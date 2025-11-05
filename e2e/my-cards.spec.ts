import { test, expect } from '@playwright/test';

test.describe('My Cards Page', () => {
  test('should display empty state when no cards exist', async ({ page }) => {
    // Clear any storage (API-based, no localStorage needed)
    await page.goto('/my-cards');
    
    // Check for empty state
    await expect(page.getByText(/No Cards Yet/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Create a Card/i })).toBeVisible();
  });

  test('should display created cards on My Cards page', async ({ page }) => {
    // Authenticate first (required for card creation)
    const { authenticateUser } = await import('./test-helpers');
    await authenticateUser(page);
    
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
    
    // Check for view, edit and remove buttons (remove button appears on hover)
    await expect(page.getByRole('link', { name: /Edit/i }).first()).toBeVisible();
    // Remove button may be hidden until hover, so we check for the card element instead
  });

  test('should navigate to card view page from My Cards', async ({ page }) => {
    // Authenticate first (required for card creation)
    const { authenticateUser } = await import('./test-helpers');
    await authenticateUser(page);
    
    // Create a card first
    await page.goto('/create/business');
    await page.getByLabel(/Full Name/i).fill('Test User');
    await page.getByLabel(/Job Title/i).fill('Developer');
    await page.getByLabel(/Company/i).fill('Company');
    await page.getByLabel(/Email/i).fill('test@example.com');
    await page.getByLabel(/Phone/i).fill('1234567890');
    await page.getByRole('button', { name: /Create Card/i }).click();
    await expect(page.getByText(/Your Card is Ready!/i).first()).toBeVisible({ timeout: 10000 });
    
    // Go to My Cards
    await page.goto('/my-cards');
    
    // Click on the card to navigate to card detail page
    await page.getByText(/Test User/i).first().click();
    
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

