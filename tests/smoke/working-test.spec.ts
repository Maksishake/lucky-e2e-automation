/**
 * Working Test - Полностью рабочий тест
 */

import { test, expect } from '@playwright/test';
import { logger } from '@/core/logger';
import { TournamentPage } from '@/components/pages/tournament.page';
import { BuyBonusPage } from '@/components/pages/buybonus.page';

test.describe('Рабочие тесты', () => {
  test('Проверка загрузки главной страницы', async ({ page }) => {
    logger.testStart('Working Test', 'working-test.spec.ts');
    
    // Переходим на главную страницу
    await page.goto('https://luckycoin777.live');
    await page.waitForLoadState('domcontentloaded');
    
    // Проверяем заголовок страницы
    const title = await page.title();
    expect(title).toContain('Lucky');
    
    logger.info('Working Test', `Page title: ${title}`);
    logger.assertion('Page loaded successfully', true, true, true);
  });
  
  test('Проверка создания TournamentPage', async ({ page }) => {
    logger.testStart('Working Test', 'working-test.spec.ts');
    
    // Создаем экземпляр TournamentPage
    const tournamentPage = new TournamentPage(page);
    expect(tournamentPage).toBeDefined();
    
    // Проверяем методы
    expect(typeof tournamentPage.navigateToTournaments).toBe('function');
    expect(typeof tournamentPage.getAllTournaments).toBe('function');
    expect(typeof tournamentPage.validateTournamentPage).toBe('function');
    
    logger.assertion('TournamentPage created successfully', true, true, true);
  });
  
  test('Проверка создания BuyBonusPage', async ({ page }) => {
    logger.testStart('Working Test', 'working-test.spec.ts');
    
    // Создаем экземпляр BuyBonusPage
    const buyBonusPage = new BuyBonusPage(page);
    expect(buyBonusPage).toBeDefined();
    
    // Проверяем методы
    expect(typeof buyBonusPage.navigateToBuyBonus).toBe('function');
    expect(typeof buyBonusPage.verifyBuyBonusGamesDisplayed).toBe('function');
    expect(typeof buyBonusPage.validateBuyBonusPage).toBe('function');
    
    logger.assertion('BuyBonusPage created successfully', true, true, true);
  });
  
  test('Проверка навигации на страницу турниров', async ({ page }) => {
    logger.testStart('Working Test', 'working-test.spec.ts');
    
    const tournamentPage = new TournamentPage(page);
    
    // Переходим на страницу турниров
    await tournamentPage.navigateToTournaments();
    
    // Проверяем, что мы на правильной странице
    const currentUrl = page.url();
    expect(currentUrl).toContain('tournaments');
    
    logger.info('Working Test', `Current URL: ${currentUrl}`);
    logger.assertion('Navigation to tournaments page successful', true, true, true);
  });
  
  test('Проверка навигации на страницу покупки бонусов', async ({ page }) => {
    logger.testStart('Working Test', 'working-test.spec.ts');
    
    const buyBonusPage = new BuyBonusPage(page);
    
    // Переходим на страницу покупки бонусов
    await buyBonusPage.navigateToBuyBonus();
    
    // Проверяем, что мы на правильной странице
    const currentUrl = page.url();
    expect(currentUrl).toContain('buy-bonus');
    
    logger.info('Working Test', `Current URL: ${currentUrl}`);
    logger.assertion('Navigation to buy bonus page successful', true, true, true);
  });
});
