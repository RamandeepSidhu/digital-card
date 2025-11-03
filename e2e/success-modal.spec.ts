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

  test('should copy link to clipboard when copy button is clicked', async ({ page }) => {
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
    await copyButton.click();
    
    // Check for success feedback - use first() to handle multiple matches
    await expect(page.getByText(/Copied!/i).first()).toBeVisible();
  });
});

