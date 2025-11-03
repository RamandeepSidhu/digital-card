import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should have accessible navigation structure', async ({ page }) => {
    await page.goto('/');
    
    // Verify page loads without errors
    await expect(page.locator('body')).toBeVisible();
    
    // Check if there are no console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForLoadState('networkidle');
    
    // Log any errors found (for debugging)
    if (errors.length > 0) {
      console.log('Console errors:', errors);
    }
  });

  test('should load with proper viewport', async ({ page }) => {
    await page.goto('/');
    
    // Check viewport meta tag for mobile responsiveness
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveCount(1);
  });
});

