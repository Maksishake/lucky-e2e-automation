/**
 * Simple Test - Простой тест без навигации
 */

import { test, expect } from '@playwright/test';
import { logger } from '@/core/logger';
import { TournamentPage } from '@/components/pages/tournament.page';
import { BuyBonusPage } from '@/components/pages/buybonus.page';

test.describe('Простые тесты', () => {
  test('Проверка загрузки главной страницы', async ({ page }) => {
    logger.testStart('Simple Test', 'simple-test.spec.ts');
    
    // Переходим на главную страницу
    await page.goto('https://luckycoin777.live');
    await page.waitForLoadState('domcontentloaded');
    
    // Проверяем заголовок страницы
    const title = await page.title();
    expect(title).toContain('Lucky');
    
    logger.info('Simple Test', `Page title: ${title}`);
    logger.assertion('Page loaded successfully', true, true, true);
  });
  
  test('Проверка создания страниц', async ({ page }) => {
    logger.testStart('Simple Test', 'simple-test.spec.ts');
    
    // Создаем экземпляры страниц
    const tournamentPage = new TournamentPage(page);
    const buyBonusPage = new BuyBonusPage(page);
    
    expect(tournamentPage).toBeDefined();
    expect(buyBonusPage).toBeDefined();
    
    // Проверяем методы
    expect(typeof tournamentPage.navigateToTournaments).toBe('function');
    expect(typeof buyBonusPage.navigateToBuyBonus).toBe('function');
    
    logger.assertion('Pages created successfully', true, true, true);
  });
  
  test('Проверка базовых методов страниц', async ({ page }) => {
    logger.testStart('Simple Test', 'simple-test.spec.ts');
    
    const tournamentPage = new TournamentPage(page);
    
    // Проверяем базовые методы
    expect(typeof tournamentPage.getAllTournaments).toBe('function');
    expect(typeof tournamentPage.validateTournamentPage).toBe('function');
    expect(typeof tournamentPage.getPageStats).toBe('function');
    
    logger.assertion('Page methods available', true, true, true);
  });
  
  test('Проверка компонентов', async ({ page }) => {
    logger.testStart('Simple Test', 'simple-test.spec.ts');
    
    const tournamentPage = new TournamentPage(page);
    
    // Проверяем компоненты
    expect(tournamentPage.tournamentPageComponent).toBeDefined();
    expect(tournamentPage.pageHeaderComponent).toBeDefined();
    expect(tournamentPage.pageContentComponent).toBeDefined();
    
    logger.assertion('Components available', true, true, true);
  });
});