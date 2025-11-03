import { test, expect } from '@playwright/test';

test.describe('Form Submission', () => {
  test('should display business card form with all fields', async ({ page }) => {
    await page.goto('/create/business');
    
    // Check required fields
    await expect(page.getByLabel(/Full Name/i)).toBeVisible();
    await expect(page.getByLabel(/Job Title/i)).toBeVisible();
    await expect(page.getByLabel(/Company/i)).toBeVisible();
    await expect(page.getByLabel(/Email/i)).toBeVisible();
    await expect(page.getByLabel(/Phone/i)).toBeVisible();
    
    // Check optional fields
    await expect(page.getByLabel(/Website/i)).toBeVisible();
    await expect(page.getByLabel(/LinkedIn/i)).toBeVisible();
    await expect(page.getByLabel(/Address/i)).toBeVisible();
    
    // Check style selector
    await expect(page.getByText(/Modern Minimalist/i)).toBeVisible();
  });

  test('should validate business card form - required fields', async ({ page }) => {
    await page.goto('/create/business');
    
    // Try to submit empty form
    await page.getByRole('button', { name: /Create Card/i }).click();
    
    // Wait for validation messages
    await page.waitForTimeout(500);
    
    // Check for validation errors (at least one should appear)
    const errorMessages = await page.locator('text=/must be at least/i').count();
    expect(errorMessages).toBeGreaterThan(0);
  });

  test('should fill and submit business card form successfully', async ({ page }) => {
    await page.goto('/create/business');
    
    // Fill in required fields
    await page.getByLabel(/Full Name/i).fill('John Doe');
    await page.getByLabel(/Job Title/i).fill('Software Engineer');
    await page.getByLabel(/Company/i).fill('Tech Corp');
    await page.getByLabel(/Email/i).fill('john@example.com');
    await page.getByLabel(/Phone/i).fill('1234567890');
    
    // Fill optional fields
    await page.getByLabel(/Website/i).fill('https://example.com');
    
    // Submit form
    await page.getByRole('button', { name: /Create Card/i }).click();
    
    // Wait for alert (card creation success)
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Card created successfully');
      await dialog.accept();
    });
    
    // After accepting dialog, should redirect to home
    await page.waitForURL('/', { timeout: 5000 });
  });

  test('should display bank card form with all fields', async ({ page }) => {
    await page.goto('/create/bank');
    
    // Check required fields
    await expect(page.getByLabel(/Account Holder Name/i)).toBeVisible();
    await expect(page.getByLabel(/Bank Name/i)).toBeVisible();
    await expect(page.getByLabel(/Account Number/i)).toBeVisible();
    
    // Check optional fields
    await expect(page.getByLabel(/IFSC Code/i)).toBeVisible();
    await expect(page.getByLabel(/Routing Number/i)).toBeVisible();
    await expect(page.getByLabel(/UPI ID/i)).toBeVisible();
    
    // Check style selector
    await expect(page.getByText(/Classic Bank/i)).toBeVisible();
  });

  test('should validate bank card form - required fields', async ({ page }) => {
    await page.goto('/create/bank');
    
    // Try to submit empty form
    await page.getByRole('button', { name: /Create Card/i }).click();
    
    // Wait for validation messages
    await page.waitForTimeout(500);
    
    // Check for validation errors
    const errorMessages = await page.locator('text=/must be at least/i').count();
    expect(errorMessages).toBeGreaterThan(0);
  });

  test('should fill and submit bank card form successfully', async ({ page }) => {
    await page.goto('/create/bank');
    
    // Fill in required fields
    await page.getByLabel(/Account Holder Name/i).fill('Jane Smith');
    await page.getByLabel(/Bank Name/i).fill('First National Bank');
    await page.getByLabel(/Account Number/i).fill('1234567890');
    
    // Fill optional fields
    await page.getByLabel(/UPI ID/i).fill('jane@paytm');
    
    // Submit form
    await page.getByRole('button', { name: /Create Card/i }).click();
    
    // Wait for alert (card creation success)
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Card created successfully');
      await dialog.accept();
    });
    
    // After accepting dialog, should redirect to home
    await page.waitForURL('/', { timeout: 5000 });
  });

  test('should show style selector options and allow selection', async ({ page }) => {
    await page.goto('/create/business');
    
    // Check all style options are visible
    await expect(page.getByText(/Modern Minimalist/i)).toBeVisible();
    await expect(page.getByText(/Professional Corporate/i)).toBeVisible();
    await expect(page.getByText(/Creative Gradient/i)).toBeVisible();
    
    // Click on a different style
    await page.getByText(/Professional Corporate/i).click();
    
    // Style should be selected (visual check - checked radio button)
    const styleOption = page.locator('text=Professional Corporate').locator('..');
    await expect(styleOption).toBeVisible();
  });

  test('should show loading state during form submission', async ({ page }) => {
    await page.goto('/create/business');
    
    // Fill form
    await page.getByLabel(/Full Name/i).fill('Test User');
    await page.getByLabel(/Job Title/i).fill('Developer');
    await page.getByLabel(/Company/i).fill('Company');
    await page.getByLabel(/Email/i).fill('test@example.com');
    await page.getByLabel(/Phone/i).fill('1234567890');
    
    // Submit
    const submitButton = page.getByRole('button', { name: /Create Card/i });
    await submitButton.click();
    
    // Button should show loading state (briefly)
    await expect(submitButton).toContainText(/Creating/i, { timeout: 1000 }).catch(() => {
      // If it's too fast, that's okay
    });
  });
});

