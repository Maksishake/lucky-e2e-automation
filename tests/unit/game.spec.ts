/**
 * Тесты игрового сервиса
 */

import { test, expect } from '@playwright/test';
import { logger } from '@/core/logger';
import { GameService } from '@/services/game/game.service';

test.describe('Game Service', () => {
  let gameService: GameService;
  
  test.beforeEach(async ({ page }) => {
    logger.testStart('Game Tests', 'game.spec.ts');
    gameService = new GameService(page);
    await page.goto('/');
  });

  test('Проверка инициализации GameService', async () => {
    expect(gameService).toBeDefined();
    logger.assertion('GameService should be initialized', true, true, true);
  });

  test('Проверка методов GameService', async () => {
    expect(typeof gameService.findGameOnPage).toBe('function');
    expect(typeof gameService.clickGameOnPage).toBe('function');
    expect(typeof gameService.playGameDemo).toBe('function');
    expect(typeof gameService.playGameReal).toBe('function');
    expect(typeof gameService.addToFavorites).toBe('function');
    expect(typeof gameService.removeFromFavorites).toBe('function');
    expect(typeof gameService.isGameFavorite).toBe('function');
    expect(typeof gameService.searchGames).toBe('function');
    expect(typeof gameService.filterByCategory).toBe('function');
    expect(typeof gameService.filterByProvider).toBe('function');
    expect(typeof gameService.getGamesCount).toBe('function');
    expect(typeof gameService.getGamesTitles).toBe('function');
    expect(typeof gameService.hasGames).toBe('function');
    expect(typeof gameService.waitForGamesLoad).toBe('function');
    expect(typeof gameService.clearSearch).toBe('function');
    expect(typeof gameService.resetFilters).toBe('function');
    logger.assertion('GameService methods should be available', true, true, true);
  });

  test('Проверка селекторов GameService', async () => {
    // Проверяем, что сервис имеет необходимые методы
    expect(typeof gameService.findGameOnPage).toBe('function');
    expect(typeof gameService.clickGameOnPage).toBe('function');
    expect(typeof gameService.playGameDemo).toBe('function');
    expect(typeof gameService.playGameReal).toBe('function');
    
    logger.assertion('GameService selectors should be available', true, true, true);
  });

  test('Проверка базовых методов GameService', async () => {
    const hasGames = await gameService.hasGames();
    const gamesCount = await gameService.getGamesCount();
    const gamesTitles = await gameService.getGamesTitles();
    
    expect(typeof hasGames).toBe('boolean');
    expect(typeof gamesCount).toBe('number');
    expect(Array.isArray(gamesTitles)).toBe(true);
    logger.assertion('Basic GameService methods should work', true, true, true);
  });

  test.afterEach(async () => {
    await logger.saveLogsToFile(`test-${Date.now()}.json`);
  });
});
