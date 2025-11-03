import { test, expect } from '@playwright/test';

test.describe('Card Type Selection', () => {
  test('should display all three card type options on homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check for Business Card option
    const businessCard = page.getByRole('heading', { name: /Business Card/i });
    await expect(businessCard).toBeVisible();
    
    // Check for Bank Card option
    const bankCard = page.getByRole('heading', { name: /Bank Card/i });
    await expect(bankCard).toBeVisible();
    
    // Check for Personal Card option
    const personalCard = page.getByRole('heading', { name: /Personal Card/i });
    await expect(personalCard).toBeVisible();
  });

  test('should navigate to business card creation page', async ({ page }) => {
    await page.goto('/');
    
    // Click on Business Card option
    const businessLink = page.getByRole('link', { name: /Business Card/i });
    await expect(businessLink).toBeVisible();
    await businessLink.click();
    
    // Verify navigation to business card page
    await expect(page).toHaveURL('/create/business');
    await expect(page.getByRole('heading', { name: /Create Business Card/i })).toBeVisible();
  });

  test('should navigate to bank card creation page', async ({ page }) => {
    await page.goto('/');
    
    // Click on Bank Card option
    const bankLink = page.getByRole('link', { name: /Bank Card/i });
    await expect(bankLink).toBeVisible();
    await bankLink.click();
    
    // Verify navigation to bank card page
    await expect(page).toHaveURL('/create/bank');
    await expect(page.getByRole('heading', { name: /Create Bank Card/i })).toBeVisible();
  });

  test('should have working back navigation from business card page', async ({ page }) => {
    await page.goto('/create/business');
    
    // Click back link
    const backLink = page.getByRole('link', { name: /Back to Home/i });
    await expect(backLink).toBeVisible();
    await backLink.click();
    
    // Verify navigation back to home
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: /Digital Card Generator/i })).toBeVisible();
  });

  test('should have working back navigation from bank card page', async ({ page }) => {
    await page.goto('/create/bank');
    
    // Click back link
    const backLink = page.getByRole('link', { name: /Back to Home/i });
    await expect(backLink).toBeVisible();
    await backLink.click();
    
    // Verify navigation back to home
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: /Digital Card Generator/i })).toBeVisible();
  });

  test('should navigate to personal card creation page', async ({ page }) => {
    await page.goto('/');
    
    // Click on Personal Card option
    const personalLink = page.getByRole('link', { name: /Personal Card/i });
    await expect(personalLink).toBeVisible();
    await personalLink.click();
    
    // Verify navigation to personal card page
    await expect(page).toHaveURL('/create/personal');
    await expect(page.getByRole('heading', { name: /Create Personal Card/i })).toBeVisible();
  });

  test('should have hover effects on card type options', async ({ page }) => {
    await page.goto('/');
    
    const businessCard = page.getByRole('link', { name: /Business Card/i });
    
    // Hover over the card
    await businessCard.hover();
    
    // Wait a bit for transitions
    await page.waitForTimeout(300);
    
    // Verify the element is still visible (hover should not break layout)
    await expect(businessCard).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Cards should stack vertically on mobile
    const businessCard = page.getByRole('link', { name: /Business Card/i });
    const bankCard = page.getByRole('link', { name: /Bank Card/i });
    
    await expect(businessCard).toBeVisible();
    await expect(bankCard).toBeVisible();
    
    // Both cards should be visible in the viewport
    const businessBox = await businessCard.boundingBox();
    const bankBox = await bankCard.boundingBox();
    
    expect(businessBox).not.toBeNull();
    expect(bankBox).not.toBeNull();
  });
});

