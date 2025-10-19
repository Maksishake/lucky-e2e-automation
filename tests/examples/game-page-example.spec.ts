/**
 * Game Page Example - Пример использования GamePage
 * Демонстрирует все возможности работы со страницей игры
 */

import { test, expect } from '@playwright/test';
import { GamePage } from '@/components/pages/game.page';
import { logger } from '@/core/logger';

test.describe('Game Page Example Tests', () => {
  let gamePage: GamePage;

  test.beforeEach(async ({ page }) => {
    logger.testStart('Game Page Example', 'game-page-example.spec.ts');
    gamePage = new GamePage(page, logger);
    
    // Переходим на страницу игры (замените на реальный URL)
    await page.goto('https://luckycoin777.live/play/real/gates-of-olympus');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Should load game page successfully', async () => {
    logger.info('Game Page Example', 'Testing game page loading');
    
    // Проверяем, что страница загрузилась
    const isLoaded = await gamePage.isGamePageLoaded();
    expect(isLoaded).toBe(true);
    
    // Валидируем страницу
    const isValid = await gamePage.validateGamePage();
    expect(isValid).toBe(true);
    
    logger.assertion('Game page loaded', true, true, true);
  });

  test('Should display breadcrumbs correctly', async () => {
    logger.info('Game Page Example', 'Testing breadcrumbs display');
    
    // Получаем хлебные крошки
    const breadcrumbs = await gamePage.getBreadcrumbs();
    expect(breadcrumbs.length).toBeGreaterThan(0);
    
    // Проверяем, что есть нужные элементы
    expect(breadcrumbs).toContain('Luckycoin');
    expect(breadcrumbs).toContain('Всі ігри');
    
    logger.assertion('Breadcrumbs displayed', true, true, true);
  });

  test('Should toggle game mode', async () => {
    logger.info('Game Page Example', 'Testing game mode toggle');
    
    // Проверяем текущий режим
    const isRealMode = await gamePage.isRealModeEnabled();
    logger.info('Game Page Example', `Current mode: ${isRealMode ? 'Real' : 'Demo'}`);
    
    // Переключаем режим
    await gamePage.toggleGameMode();
    
    // Проверяем, что режим изменился
    const newMode = await gamePage.isRealModeEnabled();
    expect(newMode).toBe(!isRealMode);
    
    logger.assertion('Game mode toggled', true, true, true);
  });

  test('Should set real mode', async () => {
    logger.info('Game Page Example', 'Testing real mode setting');
    
    // Устанавливаем реальный режим
    await gamePage.setRealMode();
    
    // Проверяем, что режим установлен
    const isRealMode = await gamePage.isRealModeEnabled();
    expect(isRealMode).toBe(true);
    
    logger.assertion('Real mode set', true, true, true);
  });

  test('Should set demo mode', async () => {
    logger.info('Game Page Example', 'Testing demo mode setting');
    
    // Устанавливаем демо режим
    await gamePage.setDemoMode();
    
    // Проверяем, что режим установлен
    const isRealMode = await gamePage.isRealModeEnabled();
    expect(isRealMode).toBe(false);
    
    logger.assertion('Demo mode set', true, true, true);
  });

  test('Should interact with control buttons', async () => {
    logger.info('Game Page Example', 'Testing control buttons');
    
    // Проверяем видимость кнопок
    const fullscreenVisible = await gamePage.fullscreenButton.isVisible();
    const favoriteVisible = await gamePage.favoriteButton.isVisible();
    const closeVisible = await gamePage.closeGameButton.isVisible();
    
    expect(fullscreenVisible).toBe(true);
    expect(favoriteVisible).toBe(true);
    expect(closeVisible).toBe(true);
    
    // Тестируем переключение избранного
    await gamePage.toggleFavorite();
    
    logger.assertion('Control buttons working', true, true, true);
  });

  test('Should display game iframe', async () => {
    logger.info('Game Page Example', 'Testing game iframe');
    
    // Проверяем видимость iframe
    const isIframeVisible = await gamePage.isGameIframeVisible();
    expect(isIframeVisible).toBe(true);
    
    // Получаем источник iframe
    const iframeSrc = await gamePage.getGameIframeSrc();
    expect(iframeSrc).toContain('game');
    
    logger.assertion('Game iframe displayed', true, true, true);
  });

  test('Should display recommendations section', async () => {
    logger.info('Game Page Example', 'Testing recommendations section');
    
    // Получаем количество рекомендаций
    const recommendationsCount = await gamePage.getRecommendationsCount();
    expect(recommendationsCount).toBeGreaterThan(0);
    
    // Получаем заголовок секции
    const title = await gamePage.getRecommendationTitle();
    expect(title).toContain('Recommendations');
    
    logger.assertion('Recommendations section displayed', true, true, true);
  });

  test('Should interact with game cards', async () => {
    logger.info('Game Page Example', 'Testing game cards interaction');
    
    // Получаем все карточки игр
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

  test('Should find game by title', async () => {
    logger.info('Game Page Example', 'Testing game search by title');
    
    // Ищем игру по названию
    const gameIndex = await gamePage.findGameCardByTitle('Aztec Gems');
    
    if (gameIndex !== null) {
      expect(gameIndex).toBeGreaterThanOrEqual(0);
      
      // Получаем информацию о найденной игре
      const gameCard = await gamePage.getGameCardByIndex(gameIndex);
      expect(gameCard?.title).toContain('Aztec Gems');
      
      logger.assertion('Game found by title', true, true, true);
    } else {
      logger.info('Game Page Example', 'Game not found in recommendations');
    }
  });

  test('Should find game by provider', async () => {
    logger.info('Game Page Example', 'Testing game search by provider');
    
    // Ищем игру по провайдеру
    const gameIndex = await gamePage.findGameCardByProvider('Pragmatic Play');
    
    if (gameIndex !== null) {
      expect(gameIndex).toBeGreaterThanOrEqual(0);
      
      // Получаем информацию о найденной игре
      const gameCard = await gamePage.getGameCardByIndex(gameIndex);
      expect(gameCard?.subtitle).toContain('Pragmatic Play');
      
      logger.assertion('Game found by provider', true, true, true);
    } else {
      logger.info('Game Page Example', 'Game not found for provider');
    }
  });

  test('Should interact with slider arrows', async () => {
    logger.info('Game Page Example', 'Testing slider arrows');
    
    // Проверяем видимость стрелок
    const nextArrowVisible = await gamePage.nextArrow.isVisible();
    const prevArrowVisible = await gamePage.prevArrow.isVisible();
    
    expect(nextArrowVisible).toBe(true);
    expect(prevArrowVisible).toBe(true);
    
    // Тестируем навигацию
    await gamePage.clickNextArrow();
    await gamePage.clickPrevArrow();
    
    logger.assertion('Slider arrows working', true, true, true);
  });

  test('Should take screenshot', async () => {
    logger.info('Game Page Example', 'Testing screenshot functionality');
    
    // Делаем скриншот страницы
    const screenshot = await gamePage.takeGamePageScreenshot('game-page-test');
    expect(screenshot).toBeTruthy();
    
    logger.assertion('Screenshot taken', true, true, true);
  });

  test('Should scroll to recommendations', async () => {
    logger.info('Game Page Example', 'Testing scroll functionality');
    
    // Прокручиваем к рекомендациям
    await gamePage.scrollToRecommendations();
    
    // Проверяем, что секция видима
    const isVisible = await gamePage.recommendationsSection.isVisible();
    expect(isVisible).toBe(true);
    
    logger.assertion('Scroll to recommendations working', true, true, true);
  });
});
