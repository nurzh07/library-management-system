const { test, expect } = require('@playwright/test');

test.describe('Authentication E2E Tests', () => {
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  test('should register a new user', async ({ page }) => {
    await page.goto('/register');
    
    // Wait for form to be ready
    await expect(page.locator('input[name="email"]')).toBeVisible();
    
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="phone"]', '+77001234567');
    
    await page.click('button[type="submit"]');
    
    // Wait for navigation
    await page.waitForTimeout(2000);
    
    // Should redirect to login or home
    const url = page.url();
    expect(url.includes('/login') || url === 'http://localhost:3001/' || url === 'http://localhost:3001').toBeTruthy();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Wait for form
    await expect(page.locator('input[name="email"]')).toBeVisible();
    
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    
    await page.click('button[type="submit"]');
    
    // Wait for navigation with longer timeout
    await page.waitForURL('http://localhost:3001/', { timeout: 10000 });
    
    // Check that user is logged in (navbar should show profile or logout button)
    await expect(page.locator('[data-testid="logout-button"], text=Профиль, text=Шығу').first()).toBeVisible({ timeout: 5000 });
  });

  test('should show error for invalid login', async ({ page }) => {
    await page.goto('/login');
    
    // Wait for form
    await expect(page.locator('input[name="email"]')).toBeVisible();
    
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    
    await page.click('button[type="submit"]');
    
    // Wait for error to appear
    await page.waitForTimeout(1000);
    
    // Should show error message (Alert component in MUI)
    await expect(page.locator('[role="alert"], .MuiAlert-root, text=/қате|жарамсыз|дұрыс|invalid/i').first()).toBeVisible({ timeout: 5000 });
  });

  test('should logout successfully', async ({ page }) => {
    // First login
    await page.goto('/login');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');
    
    // Wait for navigation to home
    await page.waitForURL('http://localhost:3001/', { timeout: 10000 });
    
    // Wait for logout button to be visible
    await expect(page.locator('[data-testid="logout-button"]')).toBeVisible({ timeout: 5000 });
    
    // Then logout
    await page.click('[data-testid="logout-button"]');
    
    // Wait for redirect to login
    await page.waitForURL(/.*login.*/, { timeout: 5000 });
  });
});
