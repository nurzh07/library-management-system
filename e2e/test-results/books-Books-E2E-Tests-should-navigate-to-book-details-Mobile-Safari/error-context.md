# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: books.spec.js >> Books E2E Tests >> should navigate to book details
- Location: tests\books.spec.js:35:3

# Error details

```
TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('[data-testid="book-card"]') to be visible

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e6]:
      - link "LMS · Кітапхана" [ref=e7]:
        - /url: /
        - heading "LMS · Кітапхана" [level=6] [ref=e9]
      - generic [ref=e10]:
        - link "Кітаптар" [ref=e11] [cursor=pointer]:
          - /url: /books
          - text: Кітаптар
        - link "Авторлар" [ref=e12] [cursor=pointer]:
          - /url: /authors
          - text: Авторлар
        - link "Кіру" [ref=e13] [cursor=pointer]:
          - /url: /login
          - text: Кіру
        - link "Тіркелу" [ref=e14] [cursor=pointer]:
          - /url: /register
          - text: Тіркелу
  - main [ref=e15]:
    - generic [ref=e16]:
      - heading "Кітаптар" [level=1] [ref=e17]
      - generic [ref=e19]:
        - generic: Іздеу
        - generic [ref=e20]:
          - textbox "Іздеу" [ref=e21]:
            - /placeholder: Кітап атауы немесе ISBN бойынша іздеу
          - group:
            - generic: Іздеу
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Books E2E Tests', () => {
  4  |   test('should display books list', async ({ page }) => {
  5  |     await page.goto('/books');
  6  |     
  7  |     // Check page title
  8  |     await expect(page.locator('h1, h2, h3').filter({ hasText: /кітап|book/i }).first()).toBeVisible();
  9  |     
  10 |     // Wait for loading to complete
  11 |     await page.waitForSelector('[data-testid="books-grid"]', { timeout: 10000 });
  12 |     
  13 |     // Check that books grid exists
  14 |     await expect(page.locator('[data-testid="books-grid"]')).toBeVisible();
  15 |   });
  16 | 
  17 |   test('should search books', async ({ page }) => {
  18 |     await page.goto('/books');
  19 |     
  20 |     // Wait for search input
  21 |     const searchInput = page.locator('[data-testid="books-search"]');
  22 |     await expect(searchInput).toBeVisible();
  23 |     
  24 |     // Type in search
  25 |     await searchInput.fill('test');
  26 |     await searchInput.press('Enter');
  27 |     
  28 |     // Wait for debounce and API call
  29 |     await page.waitForTimeout(1500);
  30 |     
  31 |     // Check results are displayed
  32 |     await expect(page.locator('body')).toContainText(/кітап|ISBN|Авторлар/i);
  33 |   });
  34 | 
  35 |   test('should navigate to book details', async ({ page }) => {
  36 |     await page.goto('/books');
  37 |     
  38 |     // Wait for grid and cards to load
> 39 |     await page.waitForSelector('[data-testid="book-card"]', { timeout: 10000 });
     |                ^ TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
  40 |     
  41 |     // Click on first book card
  42 |     const firstBook = page.locator('[data-testid="book-card"]').first();
  43 |     await expect(firstBook).toBeVisible();
  44 |     
  45 |     // Click "Толығырақ" button
  46 |     await firstBook.locator('button:has-text("Толығырақ")').click();
  47 |     
  48 |     // Check book details dialog is shown
  49 |     await expect(page.locator('[role="dialog"]')).toBeVisible();
  50 |     await expect(page.locator('[role="dialog"]').locator('h2')).toBeVisible();
  51 |   });
  52 | 
  53 |   test('should show pagination when multiple pages', async ({ page }) => {
  54 |     await page.goto('/books');
  55 |     
  56 |     // Wait for grid to load
  57 |     await page.waitForSelector('[data-testid="books-grid"]', { timeout: 10000 });
  58 |     
  59 |     // Check for pagination if it exists
  60 |     const pagination = page.locator('[data-testid="books-pagination"]');
  61 |     
  62 |     // If pagination is visible, test it
  63 |     if (await pagination.isVisible().catch(() => false)) {
  64 |       await expect(pagination).toBeVisible();
  65 |     } else {
  66 |       // Skip if no pagination (not enough books)
  67 |       test.skip();
  68 |     }
  69 |   });
  70 | });
  71 | 
```