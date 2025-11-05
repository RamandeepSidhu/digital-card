import { Page } from '@playwright/test';

/**
 * Helper function to authenticate a user for tests
 * Creates a test user and signs them in
 */
export async function authenticateUser(page: Page): Promise<{ email: string; password: string; name: string }> {
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
  await page.waitForURL(/.*\/auth\/signin/, { timeout: 5000 });
  
  // Wait a bit for user to be saved
  await page.waitForTimeout(1000);
  
  // Sign in
  await page.getByLabel(/email/i).fill(testEmail);
  await page.getByLabel(/password/i).fill(testPassword);
  
  await page.getByRole('button', { name: /sign in/i }).click();
  
  // Should redirect to dashboard
  await page.waitForURL(/.*\/dashboard/, { timeout: 5000 });

  return { email: testEmail, password: testPassword, name: testName };
}

/**
 * Helper function to create a test card
 */
export async function createTestCard(page: Page, cardType: 'business' | 'bank' | 'personal' = 'business'): Promise<string | null> {
  await page.goto(`/create/${cardType}`);
  
  if (cardType === 'business') {
    await page.getByLabel(/Full Name/i).fill('Test User');
    await page.getByLabel(/Job Title/i).fill('Developer');
    await page.getByLabel(/Company/i).fill('Test Company');
    await page.getByLabel(/Email/i).fill('test@example.com');
    await page.getByLabel(/Phone/i).fill('1234567890');
  } else if (cardType === 'bank') {
    await page.getByLabel(/Account Holder Name/i).fill('Test User');
    await page.getByLabel(/Bank Name/i).fill('Test Bank');
    await page.getByLabel(/Account Number/i).fill('1234567890');
  } else {
    await page.getByLabel(/Full Name/i).fill('Test User');
    await page.getByLabel(/Email/i).fill('test@example.com');
    await page.getByLabel(/Phone/i).fill('1234567890');
  }
  
  await page.getByRole('button', { name: /Create Card/i }).click();
  
  // Wait for success modal
  const successModal = page.getByText(/Your Card is Ready!/i).first();
  await successModal.waitFor({ state: 'visible', timeout: 10000 });
  
  // Extract card ID from URL input
  const urlInput = page.locator('input[value*="/card/"]').first();
  await urlInput.waitFor({ state: 'visible', timeout: 5000 });
  
  const cardUrl = await urlInput.inputValue();
  const match = cardUrl.match(/\/card\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

