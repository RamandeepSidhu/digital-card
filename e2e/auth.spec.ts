import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to sign in page', async ({ page }) => {
    const signInLink = page.getByRole('link', { name: /sign in/i }).first();
    await signInLink.click();
    
    await expect(page).toHaveURL(/.*\/auth\/signin/);
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
  });

  test('should navigate to sign up page', async ({ page }) => {
    const signUpLink = page.getByRole('link', { name: /get started/i }).first();
    await signUpLink.click();
    
    await expect(page).toHaveURL(/.*\/auth\/signup/);
    await expect(page.getByRole('heading', { name: /create your/i })).toBeVisible();
  });

  test('should show sign up form fields', async ({ page }) => {
    await page.goto('/auth/signup');
    
    await expect(page.getByLabel(/full name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/^password$/i)).toBeVisible();
    await expect(page.getByLabel(/confirm password/i)).toBeVisible();
  });

  test('should show sign in form fields', async ({ page }) => {
    await page.goto('/auth/signin');
    
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible();
  });

  test('should validate email format on signup', async ({ page }) => {
    await page.goto('/auth/signup');
    
    await page.getByLabel(/full name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/^password$/i).fill('password123');
    await page.getByLabel(/confirm password/i).fill('password123');
    
    // Try to submit - should show validation error
    await page.getByRole('button', { name: /sign up/i }).click();
    
    // Check if there's an error message or the form doesn't submit
    // The browser's HTML5 validation should prevent submission
    const emailInput = page.getByLabel(/email/i);
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).toBeTruthy();
  });

  test('should validate password length on signup', async ({ page }) => {
    await page.goto('/auth/signup');
    
    await page.getByLabel(/full name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/^password$/i).fill('12345'); // Too short
    await page.getByLabel(/confirm password/i).fill('12345');
    
    // Try to submit
    await page.getByRole('button', { name: /sign up/i }).click();
    
    // Should show error or validation message
    const passwordInput = page.getByLabel(/^password$/i);
    const validationMessage = await passwordInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).toBeTruthy();
  });

  test('should show error when passwords do not match', async ({ page }) => {
    await page.goto('/auth/signup');
    
    await page.getByLabel(/full name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/^password$/i).fill('password123');
    await page.getByLabel(/confirm password/i).fill('differentpassword');
    
    await page.getByRole('button', { name: /sign up/i }).click();
    
    // Should show error message
    await expect(page.getByText(/passwords do not match/i)).toBeVisible();
  });

  test('should successfully sign up and login', async ({ page }) => {
    // Generate unique email for this test
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;
    const testPassword = 'testpassword123';
    const testName = 'Test User';

    // Sign up
    await page.goto('/auth/signup');
    
    await page.getByLabel(/full name/i).fill(testName);
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/^password$/i).fill(testPassword);
    await page.getByLabel(/confirm password/i).fill(testPassword);
    
    await page.getByRole('button', { name: /sign up/i }).click();
    
    // Should redirect to sign in page
    await expect(page).toHaveURL(/.*\/auth\/signin/);
    
    // Wait a bit for user to be saved
    await page.waitForTimeout(1000);
    
    // Now try to sign in
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/password/i).fill(testPassword);
    
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
    
    // Should see welcome message
    await expect(page.getByText(/welcome/i)).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/signin');
    
    await page.getByLabel(/email/i).fill('nonexistent@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Should show error message
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });

  test('should prevent duplicate signups', async ({ page }) => {
    // Generate unique email for this test
    const timestamp = Date.now();
    const testEmail = `duplicate${timestamp}@example.com`;
    const testPassword = 'testpassword123';
    const testName = 'Test User';

    // First signup
    await page.goto('/auth/signup');
    
    await page.getByLabel(/full name/i).fill(testName);
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/^password$/i).fill(testPassword);
    await page.getByLabel(/confirm password/i).fill(testPassword);
    
    await page.getByRole('button', { name: /sign up/i }).click();
    
    // Should redirect to sign in
    await expect(page).toHaveURL(/.*\/auth\/signin/);
    
    // Wait for user to be saved
    await page.waitForTimeout(1000);
    
    // Try to sign up again with same email
    await page.goto('/auth/signup');
    
    await page.getByLabel(/full name/i).fill(testName);
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/^password$/i).fill(testPassword);
    await page.getByLabel(/confirm password/i).fill(testPassword);
    
    await page.getByRole('button', { name: /sign up/i }).click();
    
    // Should show error about existing user
    await expect(page.getByText(/user with this email already exists/i)).toBeVisible();
  });
});

