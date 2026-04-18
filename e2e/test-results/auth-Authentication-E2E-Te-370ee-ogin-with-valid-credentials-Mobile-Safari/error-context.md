# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.js >> Authentication E2E Tests >> should login with valid credentials
- Location: tests\auth.spec.js:29:3

# Error details

```
TimeoutError: page.waitForURL: Timeout 10000ms exceeded.
=========================== logs ===========================
waiting for navigation to "http://localhost:3001/" until "load"
============================================================
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
    - generic [ref=e17]:
      - heading "Кіру" [level=1] [ref=e18]
      - alert [ref=e19]:
        - img [ref=e21]
        - generic [ref=e23]: Кіру кезінде қате пайда болды
      - generic [ref=e24]:
        - generic [ref=e25]:
          - generic [ref=e26]:
            - text: Email
            - generic [ref=e27]: "*"
          - generic [ref=e28]:
            - textbox "Email" [ref=e29]: test_1776484162222@example.com
            - group:
              - generic: Email *
        - generic [ref=e30]:
          - generic [ref=e31]:
            - text: Құпиясөз
            - generic [ref=e32]: "*"
          - generic [ref=e33]:
            - textbox "Құпиясөз" [ref=e34]: TestPassword123!
            - group:
              - generic: Құпиясөз *
        - button "Кіру" [active] [ref=e35] [cursor=pointer]: Кіру
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Authentication E2E Tests', () => {
  4  |   const testEmail = `test_${Date.now()}@example.com`;
  5  |   const testPassword = 'TestPassword123!';
  6  | 
  7  |   test('should register a new user', async ({ page }) => {
  8  |     await page.goto('/register');
  9  |     
  10 |     // Wait for form to be ready
  11 |     await expect(page.locator('input[name="email"]')).toBeVisible();
  12 |     
  13 |     await page.fill('input[name="email"]', testEmail);
  14 |     await page.fill('input[name="password"]', testPassword);
  15 |     await page.fill('input[name="firstName"]', 'Test');
  16 |     await page.fill('input[name="lastName"]', 'User');
  17 |     await page.fill('input[name="phone"]', '+77001234567');
  18 |     
  19 |     await page.click('button[type="submit"]');
  20 |     
  21 |     // Wait for navigation
  22 |     await page.waitForTimeout(2000);
  23 |     
  24 |     // Should redirect to login or home
  25 |     const url = page.url();
  26 |     expect(url.includes('/login') || url === 'http://localhost:3001/' || url === 'http://localhost:3001').toBeTruthy();
  27 |   });
  28 | 
  29 |   test('should login with valid credentials', async ({ page }) => {
  30 |     await page.goto('/login');
  31 |     
  32 |     // Wait for form
  33 |     await expect(page.locator('input[name="email"]')).toBeVisible();
  34 |     
  35 |     await page.fill('input[name="email"]', testEmail);
  36 |     await page.fill('input[name="password"]', testPassword);
  37 |     
  38 |     await page.click('button[type="submit"]');
  39 |     
  40 |     // Wait for navigation with longer timeout
> 41 |     await page.waitForURL('http://localhost:3001/', { timeout: 10000 });
     |                ^ TimeoutError: page.waitForURL: Timeout 10000ms exceeded.
  42 |     
  43 |     // Check that user is logged in (navbar should show profile or logout button)
  44 |     await expect(page.locator('[data-testid="logout-button"], text=Профиль, text=Шығу').first()).toBeVisible({ timeout: 5000 });
  45 |   });
  46 | 
  47 |   test('should show error for invalid login', async ({ page }) => {
  48 |     await page.goto('/login');
  49 |     
  50 |     // Wait for form
  51 |     await expect(page.locator('input[name="email"]')).toBeVisible();
  52 |     
  53 |     await page.fill('input[name="email"]', 'wrong@example.com');
  54 |     await page.fill('input[name="password"]', 'wrongpassword');
  55 |     
  56 |     await page.click('button[type="submit"]');
  57 |     
  58 |     // Wait for error to appear
  59 |     await page.waitForTimeout(1000);
  60 |     
  61 |     // Should show error message (Alert component in MUI)
  62 |     await expect(page.locator('[role="alert"], .MuiAlert-root, text=/қате|жарамсыз|дұрыс|invalid/i').first()).toBeVisible({ timeout: 5000 });
  63 |   });
  64 | 
  65 |   test('should logout successfully', async ({ page }) => {
  66 |     // First login
  67 |     await page.goto('/login');
  68 |     await page.fill('input[name="email"]', testEmail);
  69 |     await page.fill('input[name="password"]', testPassword);
  70 |     await page.click('button[type="submit"]');
  71 |     
  72 |     // Wait for navigation to home
  73 |     await page.waitForURL('http://localhost:3001/', { timeout: 10000 });
  74 |     
  75 |     // Wait for logout button to be visible
  76 |     await expect(page.locator('[data-testid="logout-button"]')).toBeVisible({ timeout: 5000 });
  77 |     
  78 |     // Then logout
  79 |     await page.click('[data-testid="logout-button"]');
  80 |     
  81 |     // Wait for redirect to login
  82 |     await page.waitForURL(/.*login.*/, { timeout: 5000 });
  83 |   });
  84 | });
  85 | 
```