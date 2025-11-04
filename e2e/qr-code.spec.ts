import { test, expect } from '@playwright/test';

test.describe('QR Code Generation', () => {
  test('should display QR code after card creation', async ({ page }) => {
    // Create a business card first
    await page.goto('/create/business');
    
    // Fill form
    await page.getByLabel(/Full Name/i).fill('John Doe');
    await page.getByLabel(/Job Title/i).fill('Software Engineer');
    await page.getByLabel(/Company/i).fill('Tech Corp');
    await page.getByLabel(/Email/i).fill('john@example.com');
    await page.getByLabel(/Phone/i).fill('1234567890');
    
    // Submit form
    await page.getByRole('button', { name: /Create Card/i }).click();
    
    // Wait for success modal to appear (not navigation) - use first() to handle multiple matches
    const successModal = page.getByText(/Your Card is Ready!/i).first();
    await expect(successModal).toBeVisible({ timeout: 10000 });
    
    // Check for QR code SVG element in the modal
    const qrCode = page.locator('svg[id^="qrcode-"]');
    await expect(qrCode.first()).toBeVisible({ timeout: 5000 });
  });

  test('should display shareable URL', async ({ page }) => {
    await page.goto('/create/business');
    
    await page.getByLabel(/Full Name/i).fill('Test User');
    await page.getByLabel(/Job Title/i).fill('Developer');
    await page.getByLabel(/Company/i).fill('Company');
    await page.getByLabel(/Email/i).fill('test@example.com');
    await page.getByLabel(/Phone/i).fill('1234567890');
    
    await page.getByRole('button', { name: /Create Card/i }).click();
    
    // Wait for success modal - use first() to handle multiple matches
    await expect(page.getByText(/Your Card is Ready!/i).first()).toBeVisible({ timeout: 10000 });
    
    // Check for URL input in modal - use locator with value selector
    const urlInput = page.locator('input[value*="/card/"]').first();
    await expect(urlInput).toBeVisible();
    
    // URL should contain /card/ path
    const urlValue = await urlInput.inputValue();
    expect(urlValue).toMatch(/\/card\/[a-zA-Z0-9_-]+/);
  });

  test('should have copy URL functionality', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    await page.goto('/create/business');
    
    await page.getByLabel(/Full Name/i).fill('Copy Test');
    await page.getByLabel(/Job Title/i).fill('Developer');
    await page.getByLabel(/Company/i).fill('Company');
    await page.getByLabel(/Email/i).fill('copy@example.com');
    await page.getByLabel(/Phone/i).fill('1234567890');
    
    await page.getByRole('button', { name: /Create Card/i }).click();
    
    // Wait for success modal - use first() to handle multiple matches
    await expect(page.getByText(/Your Card is Ready!/i).first()).toBeVisible({ timeout: 10000 });
    
    // Click copy button in modal - use first() to handle multiple matches
    const copyButton = page.getByRole('button', { name: /Copy Link/i }).first();
    await expect(copyButton).toBeVisible();
    
    // Get the expected URL from the input
    const urlInput = page.locator('input[value*="/card/"]').first();
    const expectedUrl = await urlInput.inputValue();
    
    // Click and wait for the button text to change
    await copyButton.click();
    
    // Wait for button to show "Copied!" state or check clipboard
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

  test('should have download QR button', async ({ page }) => {
    await page.goto('/create/business');
    
    await page.getByLabel(/Full Name/i).fill('Download Test');
    await page.getByLabel(/Job Title/i).fill('Developer');
    await page.getByLabel(/Company/i).fill('Company');
    await page.getByLabel(/Email/i).fill('download@example.com');
    await page.getByLabel(/Phone/i).fill('1234567890');
    
    await page.getByRole('button', { name: /Create Card/i }).click();
    
    // Wait for success modal
    await expect(page.getByText(/Your Card is Ready!/i).first()).toBeVisible({ timeout: 10000 });
    
    // Get the card URL from the input and navigate directly to card page
    const urlInput = page.locator('input[value*="/card/"]').first();
    await expect(urlInput).toBeVisible();
    const cardUrl = await urlInput.inputValue();
    await page.goto(cardUrl);
    
    // Check for download button on card page
    const downloadButton = page.getByRole('button', { name: /Download QR/i });
    await expect(downloadButton).toBeVisible();
  });

  test('should have share buttons', async ({ page }) => {
    await page.goto('/create/business');
    
    await page.getByLabel(/Full Name/i).fill('Share Test');
    await page.getByLabel(/Job Title/i).fill('Developer');
    await page.getByLabel(/Company/i).fill('Company');
    await page.getByLabel(/Email/i).fill('share@example.com');
    await page.getByLabel(/Phone/i).fill('1234567890');
    
    await page.getByRole('button', { name: /Create Card/i }).click();
    
    // Wait for success modal
    await expect(page.getByText(/Your Card is Ready!/i).first()).toBeVisible({ timeout: 10000 });
    
    // Get the card URL and navigate directly to card page
    const urlInput = page.locator('input[value*="/card/"]').first();
    await expect(urlInput).toBeVisible();
    const cardUrl = await urlInput.inputValue();
    await page.goto(cardUrl);
    
    // Check for share buttons on card page
    await expect(page.getByRole('button', { name: /WhatsApp/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Email/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Twitter/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Facebook/i })).toBeVisible();
  });

  test('should display card preview on card view page', async ({ page }) => {
    // First create a card
    await page.goto('/create/business');
    
    await page.getByLabel(/Full Name/i).fill('Preview Test');
    await page.getByLabel(/Job Title/i).fill('Developer');
    await page.getByLabel(/Company/i).fill('Company');
    await page.getByLabel(/Email/i).fill('preview@example.com');
    await page.getByLabel(/Phone/i).fill('1234567890');
    
    await page.getByRole('button', { name: /Create Card/i }).click();
    
    // Wait for success modal
    await expect(page.getByText(/Your Card is Ready!/i).first()).toBeVisible({ timeout: 10000 });
    
    // Get the card URL and navigate directly to card page
    const urlInput = page.locator('input[value*="/card/"]').first();
    await expect(urlInput).toBeVisible();
    const cardUrl = await urlInput.inputValue();
    await page.goto(cardUrl);
    
    // Check that card content is displayed
    await expect(page.getByText(/Preview Test/i)).toBeVisible();
    await expect(page.getByText(/Developer/i)).toBeVisible();
    await expect(page.getByText(/Company/i).first()).toBeVisible();
  });

  test('should have Save to Contacts button for business cards', async ({ page }) => {
    await page.goto('/create/business');
    
    await page.getByLabel(/Full Name/i).fill('Contact Test');
    await page.getByLabel(/Job Title/i).fill('Developer');
    await page.getByLabel(/Company/i).fill('Company');
    await page.getByLabel(/Email/i).fill('contact@example.com');
    await page.getByLabel(/Phone/i).fill('1234567890');
    
    await page.getByRole('button', { name: /Create Card/i }).click();
    
    // Wait for success modal
    await expect(page.getByText(/Your Card is Ready!/i).first()).toBeVisible({ timeout: 10000 });
    
    // Get the card URL and navigate directly to card page
    const urlInput = page.locator('input[value*="/card/"]').first();
    await expect(urlInput).toBeVisible();
    const cardUrl = await urlInput.inputValue();
    await page.goto(cardUrl);
    
    // Check for Save to Contacts button on card page
    const saveButton = page.getByRole('button', { name: /Save to Contacts/i });
    await expect(saveButton).toBeVisible();
  });
});

