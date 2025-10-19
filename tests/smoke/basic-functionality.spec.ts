/**
 * Basic Functionality Tests - Базовые тесты функциональности
 */

import { test, expect } from '@playwright/test';
import { logger } from '@/core/logger';
import { GameServiceFactory } from '@/core/factories/GameServiceFactory';
import { Routes } from '@/config/routes';
import { IGameOrchestrator } from '@/core/interfaces/IGame.interface';

test.describe('Базовая функциональность', () => {
  let gameService: IGameOrchestrator;
  let page: any;
  
  test.beforeEach(async ({ page: testPage }) => {
    logger.testStart('Basic Functionality Tests', 'basic-functionality.spec.ts');
    page = testPage;
    gameService = GameServiceFactory.createGameOrchestrator(page);
    
    // Переходим на главную страницу
    await page.goto(Routes.HOME);
    await page.waitForLoadState('domcontentloaded');
    
    logger.info('Basic Functionality Tests', 'Page loaded successfully');
  });
  
  test('Проверка загрузки главной страницы', async () => {
    // Проверяем заголовок страницы
    await expect(page).toHaveTitle(/Luckycoin|Lucky/);
    
    // Проверяем основные элементы
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    
    logger.assertion('Main page loaded correctly', true, true, true);
  });
  
  test('Проверка инициализации игрового сервиса', async () => {
    expect(gameService).toBeDefined();
    expect(typeof gameService.getGamesCount).toBe('function');
    expect(typeof gameService.getAllGamesWithIndexes).toBe('function');
    
    logger.assertion('Game service initialized correctly', true, true, true);
  });
  
  test('Проверка загрузки игр', async () => {
    // Ждем загрузки игр
    await gameService.waitForGamesToLoad();
    
    // Проверяем количество игр
    const gamesCount = await gameService.getGamesCount();
    expect(gamesCount).toBeGreaterThan(0);
    
    logger.info('Basic Functionality Tests', `Found ${gamesCount} games`);
    logger.assertion('Games loaded successfully', true, true, true);
  });
  
  test('Проверка получения информации об играх', async () => {
    // Ждем загрузки игр
    await gameService.waitForGamesToLoad();
    
    // Получаем информацию о первой игре
    const firstGame = await gameService.getGameByIndex(0);
    expect(firstGame).toBeDefined();
    expect(firstGame?.title).toBeTruthy();
    expect(firstGame?.provider).toBeTruthy();
    
    logger.info('Basic Functionality Tests', `First game: ${firstGame?.title} (${firstGame?.provider})`);
    logger.assertion('Game info retrieved successfully', true, true, true);
  });
  
  test('Проверка валидации URL', async () => {
    // Тестируем валидацию URL
    const validUrl = 'https://luckycoin777.live/play/real/some-game';
    const invalidUrl = 'https://example.com/invalid';
    
    const isValidUrl = await gameService.validateGameUrl(validUrl);
    const isInvalidUrl = await gameService.validateGameUrl(invalidUrl);
    
    expect(isValidUrl).toBe(true);
    expect(isInvalidUrl).toBe(false);
    
    logger.assertion('URL validation working correctly', true, true, true);
  });
  
  test('Проверка элементов игры', async () => {
    // Ждем загрузки игр
    await gameService.waitForGamesToLoad();
    
    // Проверяем наличие элементов игры
    const hasGameElements = await gameService.checkGameElements();
    expect(hasGameElements).toBe(true);
    
    logger.assertion('Game elements present', true, true, true);
  });
});
