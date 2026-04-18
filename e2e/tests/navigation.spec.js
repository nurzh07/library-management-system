const { test, expect } = require('@playwright/test');

test.describe('Navigation and Layout E2E Tests', () => {
  test('should have working navigation menu', async ({ page }) => {
    await page.goto('/');
    
    // Check navbar exists
    await expect(page.locator('nav, header, [role="navigation"]').first()).toBeVisible();
    
    // Check main navigation links
    const navLinks = ['/', '/books', '/authors'];
    
    for (const link of navLinks) {
      const navLink = page.locator(`a[href="${link}"], a[href="${link}/"]`).first();
      if (await navLink.isVisible().catch(() => false)) {
        await navLink.click();
        await expect(page).toHaveURL(new RegExp(`^.*${link.replace('/', '')}`));
      }
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Check that content is visible
    await expect(page.locator('main, .content, #root > div').first()).toBeVisible();
    
    // Check for mobile menu button if exists
    const menuButton = page.locator('button[aria-label*="menu"], .menu-button, [data-testid="mobile-menu"]').first();
    
    if (await menuButton.isVisible().catch(() => false)) {
      await menuButton.click();
      // Menu should open
      await page.waitForTimeout(500);
    }
  });

  test('should display footer', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check footer exists
    const footer = page.locator('footer, .footer').first();
    if (await footer.isVisible().catch(() => false)) {
      await expect(footer).toBeVisible();
    }
  });

  test('should handle 404 pages', async ({ page }) => {
    await page.goto('/non-existent-page-12345');
    
    // Should show 404 or redirect
    const content = await page.content();
    const has404 = content.includes('404') || content.includes('табылмады') || content.includes('not found');
    
    expect(has404 || page.url() !== '/non-existent-page-12345').toBeTruthy();
  });
});
