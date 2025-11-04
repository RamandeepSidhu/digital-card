import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page title is correct
    await expect(page).toHaveTitle(/Digital Card Generator/);
    
    // Check if the main heading is visible (new landing page structure)
    const heading = page.getByRole('heading', { name: /Create Beautiful/i });
    await expect(heading).toBeVisible();
    
    // Check if "Digital Cards" text is visible
    await expect(page.getByText(/Digital Cards/i)).toBeVisible();
  });

  test('should have proper meta description', async ({ page }) => {
    await page.goto('/');
    
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute(
      'content',
      /Create beautiful digital business cards and bank cards with unique QR codes/i
    );
  });

  test('should display hero section with CTA buttons', async ({ page }) => {
    await page.goto('/');
    
    // Check for hero section elements
    await expect(page.getByRole('heading', { name: /Create Beautiful/i })).toBeVisible();
    await expect(page.getByText(/Share your contact details/i)).toBeVisible();
    
    // Check for CTA buttons
    await expect(page.getByRole('link', { name: /Get Started Free/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Sign In/i })).toBeVisible();
  });

  test('should display "Why Choose Digital Cards?" section', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByRole('heading', { name: /Why Choose Digital Cards/i })).toBeVisible();
    await expect(page.getByText(/Instant Sharing/i)).toBeVisible();
    await expect(page.getByText(/Beautiful Designs/i)).toBeVisible();
    await expect(page.getByText(/Multiple Card Types/i)).toBeVisible();
  });

  test('should display "How It Works" section', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByRole('heading', { name: /How It Works/i })).toBeVisible();
    await expect(page.getByText(/Sign Up/i)).toBeVisible();
    await expect(page.getByText(/Fill Details/i)).toBeVisible();
    await expect(page.getByText(/Choose Design/i)).toBeVisible();
    await expect(page.getByText(/Share & Scan/i)).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check if the heading is still visible on mobile
    const heading = page.getByRole('heading', { name: /Create Beautiful/i });
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

  test('should navigate to sign up from CTA button', async ({ page }) => {
    await page.goto('/');
    
    const ctaButton = page.getByRole('link', { name: /Get Started Free/i }).first();
    await ctaButton.click();
    
    await expect(page).toHaveURL(/.*\/auth\/signup/);
  });
});

