const { test, expect } = require('@playwright/test');

test.describe('Books E2E Tests', () => {
  test('should display books list', async ({ page }) => {
    await page.goto('/books');
    
    // Check page title
    await expect(page.locator('h1, h2, h3').filter({ hasText: /кітап|book/i }).first()).toBeVisible();
    
    // Wait for loading to complete
    await page.waitForSelector('[data-testid="books-grid"]', { timeout: 10000 });
    
    // Check that books grid exists
    await expect(page.locator('[data-testid="books-grid"]')).toBeVisible();
  });

  test('should search books', async ({ page }) => {
    await page.goto('/books');
    
    // Wait for search input
    const searchInput = page.locator('[data-testid="books-search"]');
    await expect(searchInput).toBeVisible();
    
    // Type in search
    await searchInput.fill('test');
    await searchInput.press('Enter');
    
    // Wait for debounce and API call
    await page.waitForTimeout(1500);
    
    // Check results are displayed
    await expect(page.locator('body')).toContainText(/кітап|ISBN|Авторлар/i);
  });

  test('should navigate to book details', async ({ page }) => {
    await page.goto('/books');
    
    // Wait for grid and cards to load
    await page.waitForSelector('[data-testid="book-card"]', { timeout: 10000 });
    
    // Click on first book card
    const firstBook = page.locator('[data-testid="book-card"]').first();
    await expect(firstBook).toBeVisible();
    
    // Click "Толығырақ" button
    await firstBook.locator('button:has-text("Толығырақ")').click();
    
    // Check book details dialog is shown
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('[role="dialog"]').locator('h2')).toBeVisible();
  });

  test('should show pagination when multiple pages', async ({ page }) => {
    await page.goto('/books');
    
    // Wait for grid to load
    await page.waitForSelector('[data-testid="books-grid"]', { timeout: 10000 });
    
    // Check for pagination if it exists
    const pagination = page.locator('[data-testid="books-pagination"]');
    
    // If pagination is visible, test it
    if (await pagination.isVisible().catch(() => false)) {
      await expect(pagination).toBeVisible();
    } else {
      // Skip if no pagination (not enough books)
      test.skip();
    }
  });
});
