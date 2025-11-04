import { test, expect } from '@playwright/test';

test.describe('Success Modal After Card Creation', () => {
  test('should show success modal with QR code and link after creating business card', async ({ page }) => {
    await page.goto('/create/business');
    
    // Fill form
    await page.getByLabel(/Full Name/i).fill('John Doe');
    await page.getByLabel(/Job Title/i).fill('Software Engineer');
    await page.getByLabel(/Company/i).fill('Tech Corp');
    await page.getByLabel(/Email/i).fill('john@example.com');
    await page.getByLabel(/Phone/i).fill('1234567890');
    
    // Submit form
    await page.getByRole('button', { name: /Create Card/i }).click();
    
    // Wait for success modal - use first() to handle multiple matches
    const successModal = page.getByText(/Your Card is Ready!/i).first();
    await expect(successModal).toBeVisible({ timeout: 10000 });
    
    // Check for QR code - use first() to handle multiple matches
    const qrCode = page.locator('svg[id^="qrcode-"]').first();
    await expect(qrCode).toBeVisible();
    
    // Check for card link input - use locator with value selector
    const linkInput = page.locator('input[value*="/card/"]').first();
    await expect(linkInput).toBeVisible();
    
    // Check for copy button - use first() to handle multiple matches
    const copyButton = page.getByRole('button', { name: /Copy Link/i }).first();
    await expect(copyButton).toBeVisible();
  });

  test('should show success modal after creating personal card', async ({ page }) => {
    await page.goto('/create/personal');
    
    // Fill form
    await page.getByLabel(/Full Name/i).fill('Jane Smith');
    await page.getByLabel(/Email/i).fill('jane@example.com');
    await page.getByLabel(/Phone/i).fill('9876543210');
    
    // Submit form
    await page.getByRole('button', { name: /Create Card/i }).click();
    
    // Wait for success modal - use first() to handle multiple matches
    const successModal = page.getByText(/Your Card is Ready!/i).first();
    await expect(successModal).toBeVisible({ timeout: 10000 });
    
    // Check for card link - use first() to handle multiple matches
    const linkInput = page.locator('input[value*="/card/"]').first();
    await expect(linkInput).toBeVisible();
  });

  test('should copy link to clipboard when copy button is clicked', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    await page.goto('/create/business');
    
    await page.getByLabel(/Full Name/i).fill('Test User');
    await page.getByLabel(/Job Title/i).fill('Developer');
    await page.getByLabel(/Company/i).fill('Company');
    await page.getByLabel(/Email/i).fill('test@example.com');
    await page.getByLabel(/Phone/i).fill('1234567890');
    
    await page.getByRole('button', { name: /Create Card/i }).click();
    
    // Wait for modal - use first() to handle multiple matches
    const successModal = page.getByText(/Your Card is Ready!/i).first();
    await expect(successModal).toBeVisible({ timeout: 10000 });
    
    // Click copy button - use first() to handle multiple matches
    const copyButton = page.getByRole('button', { name: /Copy Link/i }).first();
    await expect(copyButton).toBeVisible();
    
    // Get the expected URL from the input
    const urlInput = page.locator('input[value*="/card/"]').first();
    const expectedUrl = await urlInput.inputValue();
    
    // Click and wait for the button text to change
    await copyButton.click();
    
    // Wait for button to show "Copied!" state or verify clipboard
    try {
      await expect(copyButton).toHaveText(/Copied/i, { timeout: 3000 });
    } catch {
      // If text doesn't change, verify clipboard was written
      const clipboardText = await page.evaluate(async () => {
        return await navigator.clipboard.readText();
      });
      expect(clipboardText).toBe(expectedUrl);
    }
  });
});

