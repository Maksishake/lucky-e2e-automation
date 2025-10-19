/**
 * Minimal Test - Минимальный рабочий тест
 */

import { test, expect } from '@playwright/test';

test.describe('Минимальный тест', () => {
  test('Проверка загрузки главной страницы', async ({ page }) => {
    // Переходим на главную страницу
    await page.goto('https://luckycoin777.live');
    
    // Ждем загрузки страницы
    await page.waitForLoadState('domcontentloaded');
    
    // Проверяем заголовок страницы
    const title = await page.title();
    expect(title).toContain('Lucky');
    
    console.log(`Page title: ${title}`);
  });
  
  test('Проверка наличия основных элементов', async ({ page }) => {
    // Переходим на главную страницу
    await page.goto('https://luckycoin777.live');
    await page.waitForLoadState('domcontentloaded');
    
    // Проверяем наличие основных элементов
    const header = page.locator('header');
    const main = page.locator('main');
    
    await expect(header).toBeVisible();
    await expect(main).toBeVisible();
    
    console.log('Main elements are visible');
  });
});
