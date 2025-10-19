/**
 * Game Page Smoke Tests - Базовые тесты страницы игры
 * Проверяет основную функциональность страницы игры
 */

import { test, expect } from '@playwright/test';
import { GamePage } from '@/components/pages/game.page';
import { logger } from '@/core/logger';

test.describe('Game Page Smoke Tests', () => {
  let gamePage: GamePage;

  test.beforeEach(async ({ page }) => {
    logger.testStart('Game Page Smoke Tests', 'game-page.spec.ts');
    gamePage = new GamePage(page, logger);
    
    // Переходим на страницу игры
    await page.goto('https://luckycoin777.live/play/real/gates-of-olympus');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Should load game page and display all elements', async () => {
    logger.info('Game Page Smoke Tests', 'Testing basic page loading');
    
    // Ждем загрузки страницы
    await gamePage.waitForGamePageToLoad();
    
    // Проверяем основные элементы
    const isLoaded = await gamePage.isGamePageLoaded();
    expect(isLoaded).toBe(true);
    
    // Валидируем страницу
    const isValid = await gamePage.validateGamePage();
    expect(isValid).toBe(true);
    
    logger.assertion('Game page loaded successfully', true, true, true);
  });

  test('Should display breadcrumbs correctly', async () => {
    logger.info('Game Page Smoke Tests', 'Testing breadcrumbs display');
    
    // Получаем хлебные крошки
    const breadcrumbs = await gamePage.getBreadcrumbs();
    expect(breadcrumbs.length).toBeGreaterThan(0);
    
    // Проверяем наличие основных элементов
    expect(breadcrumbs).toContain('Luckycoin');
    
    logger.assertion('Breadcrumbs displayed correctly', true, true, true);
  });

  test('Should toggle game mode successfully', async () => {
    logger.info('Game Page Smoke Tests', 'Testing game mode toggle');
    
    // Получаем текущий режим
    const initialMode = await gamePage.isRealModeEnabled();
    
    // Переключаем режим
    await gamePage.toggleGameMode();
    
    // Проверяем изменение
    const newMode = await gamePage.isRealModeEnabled();
    expect(newMode).toBe(!initialMode);
    
    logger.assertion('Game mode toggled successfully', true, true, true);
  });

  test('Should display game iframe', async () => {
    logger.info('Game Page Smoke Tests', 'Testing game iframe display');
    
    // Проверяем видимость iframe
    const isIframeVisible = await gamePage.isGameIframeVisible();
    expect(isIframeVisible).toBe(true);
    
    // Получаем источник iframe
    const iframeSrc = await gamePage.getGameIframeSrc();
    expect(iframeSrc).toBeTruthy();
    
    logger.assertion('Game iframe displayed correctly', true, true, true);
  });

  test('Should display recommendations section', async () => {
    logger.info('Game Page Smoke Tests', 'Testing recommendations section');
    
    // Получаем количество рекомендаций
    const recommendationsCount = await gamePage.getRecommendationsCount();
    expect(recommendationsCount).toBeGreaterThan(0);
    
    // Получаем заголовок
    const title = await gamePage.getRecommendationTitle();
    expect(title).toBeTruthy();
    
    logger.assertion('Recommendations section displayed correctly', true, true, true);
  });

  test('Should interact with game cards', async () => {
    logger.info('Game Page Smoke Tests', 'Testing game cards interaction');
    
    // Получаем все карточки
    const gameCards = await gamePage.getAllGameCards();
    expect(gameCards.length).toBeGreaterThan(0);
    
    // Проверяем первую карточку
    const firstCard = gameCards[0];
    expect(firstCard.title).toBeTruthy();
    expect(firstCard.subtitle).toBeTruthy();
    expect(firstCard.hasRealButton).toBe(true);
    expect(firstCard.hasDemoButton).toBe(true);
    
    logger.assertion('Game cards interaction working', true, true, true);
  });

  test('Should handle control buttons', async () => {
    logger.info('Game Page Smoke Tests', 'Testing control buttons');
    
    // Проверяем видимость кнопок
    const fullscreenVisible = await gamePage.fullscreenButton.isVisible();
    const favoriteVisible = await gamePage.favoriteButton.isVisible();
    const closeVisible = await gamePage.closeGameButton.isVisible();
    
    expect(fullscreenVisible).toBe(true);
    expect(favoriteVisible).toBe(true);
    expect(closeVisible).toBe(true);
    
    logger.assertion('Control buttons displayed correctly', true, true, true);
  });

  test('Should handle slider navigation', async () => {
    logger.info('Game Page Smoke Tests', 'Testing slider navigation');
    
    // Проверяем видимость стрелок
    const nextArrowVisible = await gamePage.nextArrow.isVisible();
    const prevArrowVisible = await gamePage.prevArrow.isVisible();
    
    expect(nextArrowVisible).toBe(true);
    expect(prevArrowVisible).toBe(true);
    
    logger.assertion('Slider navigation working', true, true, true);
  });
});
