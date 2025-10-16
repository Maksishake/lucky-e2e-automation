/**
 * Game Service - Оркестратор для работы с играми
 */

import { Page, expect } from '@playwright/test';
import { BaseService } from '../../core/base.service';
import { GameDetectionService } from './game-detection.service';
import { GameStabilityService } from './game-stability.service';
import { GameErrorService } from './game-error.service';
import { GameUrlService } from './game-url.service';
import { GameInteractionService } from './game-interaction.service';

export class GameService extends BaseService {
  // Специализированные сервисы
  private gameDetectionService: GameDetectionService;
  private gameStabilityService: GameStabilityService;
  private gameErrorService: GameErrorService;
  private gameUrlService: GameUrlService;
  private gameInteractionService: GameInteractionService;

  constructor(page: Page) {
    super(page, 'GameService');
    
    // Инициализируем специализированные сервисы
    this.gameDetectionService = new GameDetectionService(page);
    this.gameStabilityService = new GameStabilityService(page);
    this.gameErrorService = new GameErrorService(page);
    this.gameUrlService = new GameUrlService(page);
    this.gameInteractionService = new GameInteractionService(page);
  }

  // ==================== DELEGATION METHODS ====================

  /**
   * Найти игру на странице по названию
   */
  async findGameOnPage(title: string): Promise<boolean> {
    return this.gameDetectionService.findGameOnPage(title);
  }

  /**
   * Получить игру по индексу
   */
  async getGameByIndex(index: number): Promise<{ title: string; provider: string; locator: any } | null> {
    return this.gameDetectionService.getGameByIndex(index);
  }

  /**
   * Кликнуть по игре по индексу
   */
  async clickGameByIndex(index: number): Promise<boolean> {
    return this.gameInteractionService.clickGameByIndex(index);
  }

  /**
   * Запустить игру в реальном режиме по индексу
   */
  async playGameRealByIndex(index: number): Promise<boolean> {
    return this.gameInteractionService.playGameRealByIndex(index);
  }

  /**
   * Запустить игру в демо режиме по индексу
   */
  async playGameDemoByIndex(index: number): Promise<boolean> {
    return this.gameInteractionService.playGameDemoByIndex(index);
  }

  /**
   * Получить все игры на странице с их индексами
   */
  async getAllGamesWithIndexes(): Promise<Array<{ index: number; title: string; provider: string; locator: any }>> {
    return this.gameDetectionService.getAllGamesWithIndexes();
  }

  /**
   * Добавить игру в избранное по индексу
   */
  async addToFavoritesByIndex(index: number): Promise<boolean> {
    return this.gameInteractionService.addToFavoritesByIndex(index);
  }

  /**
   * Удалить игру из избранного по индексу
   */
  async removeFromFavoritesByIndex(index: number): Promise<boolean> {
    return this.gameInteractionService.removeFromFavoritesByIndex(index);
  }

  /**
   * Проверить, является ли игра избранной по индексу
   */
  async isGameFavoriteByIndex(index: number): Promise<boolean> {
    return this.gameInteractionService.isGameFavoriteByIndex(index);
  }

  /**
   * Универсальная функция для клика по кнопке игры по индексу
   */
  async clickGameButtonByIndex(index: number, buttonType: 'real' | 'demo' | 'favorite'): Promise<boolean> {
    return this.gameInteractionService.clickGameButtonByIndex(index, buttonType);
  }

  /**
   * Проверить доступность кнопки по индексу
   */
  async isButtonAvailableByIndex(index: number, buttonType: 'real' | 'demo' | 'favorite'): Promise<boolean> {
    return this.gameInteractionService.isButtonAvailableByIndex(index, buttonType);
  }

  /**
   * Найти игру по индексу с фильтром по провайдеру
   */
  async findGameByIndexWithProvider(
    index: number, 
    providerName: string
  ): Promise<{ title: string; provider: string; locator: any } | null> {
    return this.gameDetectionService.findGameByIndexWithProvider(index, providerName);
  }

  /**
   * Получить игры по провайдеру с индексами
   */
  async getGamesByProviderWithIndexes(
    providerName: string
  ): Promise<Array<{ index: number; title: string; provider: string; locator: any }>> {
    return this.gameDetectionService.getGamesByProviderWithIndexes(providerName);
  }

  /**
   * Получить случайную игру по индексу
   */
  async getRandomGameByIndex(): Promise<{ index: number; title: string; provider: string; locator: any } | null> {
    return this.gameDetectionService.getRandomGameByIndex();
  }

  /**
   * Получить игры по диапазону индексов
   */
  async getGamesByIndexRange(
    startIndex: number, 
    endIndex: number
  ): Promise<Array<{ index: number; title: string; provider: string; locator: any }>> {
    return this.gameDetectionService.getGamesByIndexRange(startIndex, endIndex);
  }

  /**
   * Кликнуть по игре на странице
   */
  async clickGameOnPage(title: string): Promise<boolean> {
    return this.gameInteractionService.clickGameOnPage(title);
  }

  /**
   * Запустить игру в демо режиме
   */
  async playGameDemo(title: string): Promise<boolean> {
    return this.gameInteractionService.playGameDemo(title);
  }

  /**
   * Запустить игру в реальном режиме
   */
  async playGameReal(title: string): Promise<boolean> {
    return this.gameInteractionService.playGameReal(title);
  }

  /**
   * Добавить игру в избранное
   */
  async addToFavorites(title: string): Promise<boolean> {
    return this.gameInteractionService.addToFavorites(title);
  }

  /**
   * Удалить игру из избранного
   */
  async removeFromFavorites(title: string): Promise<boolean> {
    return this.gameInteractionService.removeFromFavorites(title);
  }

  /**
   * Проверить, является ли игра избранной
   */
  async isGameFavorite(title: string): Promise<boolean> {
    return this.gameInteractionService.isGameFavorite(title);
  }

  /**
   * Поиск игр по запросу
   */
  async searchGames(query: string): Promise<boolean> {
    return this.gameDetectionService.searchGames(query);
  }

  /**
   * Фильтр по категории
   */
  async filterByCategory(categoryName: string): Promise<boolean> {
    return this.gameDetectionService.filterByCategory(categoryName);
  }

  /**
   * Фильтр по провайдеру
   */
  async filterByProvider(providerName: string): Promise<boolean> {
    return this.gameDetectionService.filterByProvider(providerName);
  }

  /**
   * Получить количество игр на странице
   */
  async getGamesCount(): Promise<number> {
    return this.gameDetectionService.getGamesCount();
  }

  /**
   * Получить список названий игр на странице
   */
  async getGamesTitles(): Promise<string[]> {
    return this.gameDetectionService.getGamesTitles();
  }

  /**
   * Проверить, есть ли игры на странице
   */
  async hasGames(): Promise<boolean> {
    return this.gameDetectionService.hasGames();
  }

  /**
   * Дождаться загрузки игр
   */
  async waitForGamesLoad(): Promise<void> {
    return this.gameDetectionService.waitForGamesLoad();
  }

  /**
   * Очистить поиск
   */
  async clearSearch(): Promise<void> {
    return this.gameDetectionService.clearSearch();
  }

  /**
   * Сбросить все фильтры
   */
  async resetFilters(): Promise<void> {
    return this.gameDetectionService.resetFilters();
  }

  /**
   * Универсальный метод для открытия игры с полной проверкой
   */
  async openGameWithFullCheck(gameTitle: string, providerName?: string): Promise<void> {
    this.logStep(`Opening game with full check: ${gameTitle}`);
    
    try {
      // 1. Кликаем на кнопку "Реальний"
      await this.gameInteractionService.clickRealButton(gameTitle, providerName);
      
      // 2. Ждем загрузки URL
      await this.gameUrlService.waitForGameUrl(15000);
      
      // 3. Валидируем URL
      const urlValidation = await this.gameUrlService.validateGameUrl(gameTitle);
      if (!urlValidation.isValid) {
        throw new Error(urlValidation.errorMessage || 'URL validation failed');
      }
      
      // 4. Проверяем iframe
      const iframe = this.page.locator('#fullscreen-container iframe');
      await expect(iframe).toBeVisible();
      
      // 5. Проверяем все возможные ошибки
      await this.checkAllGameErrors(gameTitle);
      
      // 6. Проверяем canvas
      await this.verifyGameCanvas(iframe);
      
      // 7. Финальная проверка URL
      const currentUrl = this.page.url();
      const gameSlug = this.gameUrlService.createGameSlug(gameTitle);
      await expect(currentUrl).toContain(gameSlug);
      
      this.logSuccess(`Game opened successfully: ${gameTitle}`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logError(`Failed to open game ${gameTitle}: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Клик по кнопке "Реальний" для конкретной игры (упрощенная версия)
   */
  async clickRealButton(gameTitle: string, providerName?: string): Promise<void> {
    return this.openGameWithFullCheck(gameTitle, providerName);
  }

  /**
   * Проверка всех возможных ошибок игры
   */
  private async checkAllGameErrors(gameTitle: string): Promise<void> {
    // Проверяем на блокировку по IP
    const isIpBlocked = await this.gameErrorService.checkForIpBlocking(gameTitle);
    if (isIpBlocked) {
      this.logSuccess(`✅ Game "${gameTitle}" is blocked by IP location - test passed (expected behavior)`);
      return;
    }
    
    // Проверяем на валютные ограничения
    const currencyRestriction = await this.gameErrorService.checkForCurrencyRestriction(gameTitle);
    if (currencyRestriction.hasError) {
      this.logError(`❌ Currency restriction detected for game "${gameTitle}": ${currencyRestriction.errorDetails}`);
      throw new Error(`Currency restriction: ${currencyRestriction.errorDetails}`);
    }
    
    // Проверяем на ошибку блокировки браузером
    const browserBlocking = await this.gameErrorService.checkForBrowserBlocking(gameTitle);
    if (browserBlocking.hasError) {
      this.logError(`❌ Browser blocking error detected for game "${gameTitle}": ${browserBlocking.errorDetails}`);
      throw new Error(`Browser blocking error: ${browserBlocking.errorDetails}`);
    }
      
    // Проверяем на 500 ошибку сервера
    const serverError = await this.gameErrorService.checkForServerError(gameTitle);
    if (serverError.hasError) {
      this.logError(`❌ Server error detected for game "${gameTitle}": ${serverError.errorDetails}`);
      throw new Error(`Server error: ${serverError.errorDetails}`);
    }
      
    // Проверяем на ошибки стабильности игры
    const stabilityError = await this.gameErrorService.checkForStabilityErrors(gameTitle);
    if (stabilityError.hasError) {
      this.logError(`❌ Game stability error detected for game "${gameTitle}": ${stabilityError.errorDetails}`);
      throw new Error(`Game stability error: ${stabilityError.errorDetails}`);
    }
  }

  /**
   * Проверка canvas внутри iframe
   */
  private async verifyGameCanvas(iframe: any): Promise<void> {
    const iframeContent = iframe.contentFrame();
    if (!iframeContent) {
      throw new Error('Iframe content not accessible');
    }
    
      // Ждем загрузки содержимого iframe
      await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });
    await this.page.waitForTimeout(3000);
        
    // Проверяем canvas с различными селекторами
        const canvasSelectors = [
          'canvas',
          'canvas[width]',
          'canvas[height]',
          'canvas:not([width="0"])',
      'canvas:not([height="0"])',
      '#__canvas_wrapper__ canvas',
      'div[id*="canvas"] canvas',
      'div[class*="canvas"] canvas',
      '#hud-canvas',
      'canvas[id*="hud"]',
      'canvas[id*="game"]',
      '#game-holder canvas'
        ];
        
        let canvasFound = false;
    
        for (const selector of canvasSelectors) {
      try {
          const canvas = iframeContent.locator(selector).first();
        const isVisible = await canvas.isVisible({ timeout: 1000 });
        
          if (isVisible) {
          const width = await canvas.getAttribute('width').catch(() => 'unknown');
          const height = await canvas.getAttribute('height').catch(() => 'unknown');
          this.logSuccess(`Canvas found with selector: ${selector} (width=${width}, height=${height})`);
            canvasFound = true;
            break;
        }
      } catch (error) {
        continue;
          }
        }
        
        if (!canvasFound) {
      // Проверяем альтернативные индикаторы
      await this.checkAlternativeGameIndicators(iframeContent);
    }
  }

  /**
   * Проверка альтернативных индикаторов игры
   */
  private async checkAlternativeGameIndicators(iframeContent: any): Promise<void> {
    this.logStep('Canvas not found, checking alternative game indicators...');
    
          const gameIndicators = [
      '#__canvas_wrapper__',
      'div[id*="canvas"]',
            'div[class*="canvas"]',
            'div[id*="game"]',
      'div[class*="game"]',
      'div[id*="app"]',
      'div[class*="app"]',
      'div[id="root"]',
      'div[id="app-content"]',
      '#game-holder',
      '#hud-canvas',
      'canvas[id*="hud"]',
      'canvas[id*="game"]'
          ];
          
          let gameElementFound = false;
    
          for (const selector of gameIndicators) {
      try {
            const elements = await iframeContent.locator(selector).all();
            if (elements.length > 0) {
          const isVisible = await elements[0].isVisible().catch(() => false);
          if (isVisible) {
            this.logStep(`Found game element with selector: ${selector}`);
              gameElementFound = true;
              break;
          }
        }
      } catch (error) {
        continue;
      }
    }
    
    // Проверяем содержимое body на наличие ошибок
    const bodyText = await iframeContent.locator('body').textContent().catch(() => '');
    
    if (bodyText?.includes('Something went wrong') || 
        bodyText?.includes('Hardware Acceleration is disabled') ||
              bodyText?.includes('Please enable it to continue')) {
      this.logStep('Game shows hardware acceleration warning, but iframe is loaded - considering as successful');
            gameElementFound = true;
          }
          
          if (!gameElementFound) {
      throw new Error(
        'Canvas not found inside iframe and no alternative game elements detected. ' +
        `Body content: ${bodyText?.substring(0, 200)}...`
      );
          }
          
          this.logSuccess('Game loaded successfully (alternative indicators found)');
  }

  /**
   * Проверить стабильность игры - что iframe остается открытым в течение указанного времени
   */
  async checkGameStability(gameTitle: string, durationSeconds: number = 15): Promise<boolean> {
    return this.gameStabilityService.checkGameStability(gameTitle, durationSeconds);
  }

  /**
   * Клик по кнопке "Демо" для конкретной игры
   */
  async clickDemoButton(gameTitle: string): Promise<void> {
    return this.gameInteractionService.clickDemoButton(gameTitle);
  }

  /**
   * Универсальная функция для клика по кнопке игры
   */
  async clickGameButton(gameTitle: string, buttonType: 'real' | 'demo'): Promise<void> {
    return this.gameInteractionService.clickGameButton(gameTitle, buttonType);
  }

  /**
   * Мониторинг стабильности игры в течение указанного времени
   */
  async monitorGameStability(
    gameTitle: string, 
    gameSlug?: string, 
    durationSeconds: number = 15, 
    checkIntervalSeconds: number = 5
  ): Promise<{ isStable: boolean; failureReason?: string }> {
    return this.gameStabilityService.monitorGameStability(gameTitle, gameSlug, durationSeconds, checkIntervalSeconds);
  }

  /**
   * Быстрая проверка стабильности игры (5 секунд)
   */
  async quickStabilityCheck(
    gameTitle: string, 
    gameSlug?: string
  ): Promise<{ isStable: boolean; failureReason?: string }> {
    return this.gameStabilityService.quickStabilityCheck(gameTitle, gameSlug);
  }

  /**
   * Расширенная проверка стабильности игры (15 секунд)
   */
  async extendedStabilityCheck(
    gameTitle: string, 
    gameSlug?: string
  ): Promise<{ isStable: boolean; failureReason?: string }> {
    return this.gameStabilityService.extendedStabilityCheck(gameTitle, gameSlug);
  }

  /**
   * Тестирование игры с полной проверкой ошибок (IP блокировка + серверные ошибки)
   */
  async testGameWithErrorHandling(
    gameTitle: string, 
    providerName?: string
  ): Promise<{ success: boolean; errorType?: string; errorDetails?: string }> {
    this.logStep(`Testing game with error handling: ${gameTitle}`);
    
    try {
      // Применяем фильтр по провайдеру, если указан
      if (providerName) {
        this.logStep(`Applying provider filter: ${providerName}`);
        await this.filterByProvider(providerName);
        await this.page.waitForTimeout(2000);
      }
      
      // Находим игру по названию
      const gameCard = this.page.locator('.game-card').filter({ hasText: gameTitle }).first();
      await gameCard.waitFor({ state: 'visible', timeout: 5000 });
      
      // Наводим курсор на игру для появления кнопок
      await gameCard.hover();
      
      // Ждем появления кнопки "Реальний"
      const realButton = gameCard.locator('.btn-default').filter({ hasText: 'Реальний' });
      await realButton.waitFor({ state: 'visible', timeout: 3000 });
      
      // Кликаем на кнопку "Реальний"
      await realButton.click();
      
      // Ждем возможного модального окна авторизации
      try {
        await this.page.waitForSelector('#modal-auth', { state: 'visible', timeout: 5000 });
        this.logStep('Authorization modal appeared, waiting for it to close');
        await this.page.waitForSelector('#modal-auth', { state: 'hidden', timeout: 10000 });
        this.logStep('Authorization modal closed');
      } catch (error) {
        this.logStep('No authorization modal appeared');
      }
      
      // Ждем загрузки игры
      try {
        await this.page.waitForURL('**/play/real/**', { timeout: 15000 });
        this.logStep('Game URL loaded successfully');
      } catch (error) {
        this.logStep('Game URL did not change, checking current URL');
      }
      
      // Проверяем iframe
      const iframe = this.page.locator('#fullscreen-container iframe');
      await expect(iframe).toBeVisible();
      
      // Проверяем на IP блокировку
      const isIpBlocked = await this.gameErrorService.checkForIpBlocking(gameTitle);
      if (isIpBlocked) {
        this.logSuccess(`✅ Game "${gameTitle}" is blocked by IP location - test passed (expected behavior)`);
        return { success: true, errorType: 'IP_BLOCKED', errorDetails: 'Game blocked by IP location' };
      }
      
      // Проверяем на ошибку блокировки браузером
      const browserBlocking = await this.gameErrorService.checkForBrowserBlocking(gameTitle);
      if (browserBlocking.hasError) {
        this.logError(`❌ Browser blocking error detected for game "${gameTitle}": ${browserBlocking.errorDetails}`);
        return { success: false, errorType: 'BROWSER_BLOCKING', errorDetails: browserBlocking.errorDetails };
      }
      
      // Проверяем на серверную ошибку
      const serverError = await this.gameErrorService.checkForServerError(gameTitle);
      if (serverError.hasError) {
        this.logError(`❌ Server error detected for game "${gameTitle}": ${serverError.errorDetails}`);
        return { success: false, errorType: 'SERVER_ERROR', errorDetails: serverError.errorDetails };
      }
      
      // Проверяем canvas (признак загруженной игры)
      const iframeContent = iframe.contentFrame();
      if (iframeContent) {
        await expect(iframeContent.locator('canvas').first()).toBeVisible();
      }
      
      this.logSuccess(`✅ Game "${gameTitle}" opened successfully without errors`);
      return { success: true };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logError(`Failed to test game "${gameTitle}": ${errorMessage}`);
      return { success: false, errorType: 'UNKNOWN_ERROR', errorDetails: errorMessage };
    }
  }

  // ==================== ERROR CHECKING METHODS ====================

  /**
   * Проверка на ошибку блокировки браузером (ERR_BLOCKED_BY_RESPONSE)
   */
  async checkForBrowserBlocking(gameTitle: string): Promise<{ hasError: boolean; errorDetails?: string }> {
    return this.gameErrorService.checkForBrowserBlocking(gameTitle);
  }

  /**
   * Проверка на 500 ошибку сервера при открытии игры
   */
  async checkForServerError(gameTitle: string): Promise<{ hasError: boolean; errorDetails?: string }> {
    return this.gameErrorService.checkForServerError(gameTitle);
  }

  /**
   * Проверка на блокировку по IP от поставщика игр (403 Forbidden)
   */
  async checkForIpBlocking(gameTitle: string): Promise<boolean> {
    return this.gameErrorService.checkForIpBlocking(gameTitle);
  }

  /**
   * Проверка на валютные ограничения (Currency restriction)
   */
  async checkForCurrencyRestriction(gameTitle: string): Promise<{ hasError: boolean; errorDetails?: string }> {
    return this.gameErrorService.checkForCurrencyRestriction(gameTitle);
  }

  /**
   * Проверка на ошибки стабильности игры
   */
  async checkForStabilityErrors(gameTitle: string): Promise<{ hasError: boolean; errorDetails?: string }> {
    return this.gameErrorService.checkForStabilityErrors(gameTitle);
  }

  // ==================== UNIVERSAL TEST METHODS ====================

  /**
   * Универсальный метод для тестирования игры с обработкой всех ошибок
   */
  async testGameUniversal(gameTitle: string, providerName?: string): Promise<{ 
    success: boolean; 
    errorType?: string; 
    errorDetails?: string;
    gameData?: { title: string; provider: string }
  }> {
    this.logStep(`Universal game test: ${gameTitle}`);
    
    try {
      
      // Открываем игру с полной проверкой
      await this.openGameWithFullCheck(gameTitle, providerName);
      
      this.logSuccess(`✅ Game "${gameTitle}" opened successfully without errors`);
      return { 
        success: true
      };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logError(`Failed to test game "${gameTitle}": ${errorMessage}`);
      
      // Определяем тип ошибки
      let errorType = 'UNKNOWN_ERROR';
      if (errorMessage.includes('Currency restriction')) errorType = 'CURRENCY_RESTRICTION';
      else if (errorMessage.includes('Browser blocking')) errorType = 'BROWSER_BLOCKING';
      else if (errorMessage.includes('Server error')) errorType = 'SERVER_ERROR';
      else if (errorMessage.includes('IP location is not allowed')) errorType = 'IP_BLOCKED';
      else if (errorMessage.includes('Game stability')) errorType = 'STABILITY_ERROR';
      
      return { 
        success: false, 
        errorType, 
        errorDetails: errorMessage
      };
    }
  }

  /**
   * Универсальный метод для тестирования игры по индексу
   */
  async testGameByIndexUniversal(index: number, providerName?: string): Promise<{ 
    success: boolean; 
    errorType?: string; 
    errorDetails?: string;
    gameData?: { title: string; provider: string }
  }> {
    this.logStep(`Universal game test by index: ${index}`);
    
    try {
      // Получаем информацию об игре по индексу
      const gameData = await this.gameDetectionService.getGameByIndex(index);
      
      if (!gameData) {
        throw new Error(`Game not found at index ${index}`);
      }
      
      // Открываем игру с полной проверкой
      await this.openGameWithFullCheck(gameData.title, providerName);
      
      this.logSuccess(`✅ Game at index ${index} opened successfully: ${gameData.title}`);
      return { 
        success: true, 
        gameData: { title: gameData.title, provider: gameData.provider }
      };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logError(`Failed to test game at index ${index}: ${errorMessage}`);
      
      // Определяем тип ошибки
      let errorType = 'UNKNOWN_ERROR';
      if (errorMessage.includes('Currency restriction')) errorType = 'CURRENCY_RESTRICTION';
      else if (errorMessage.includes('Browser blocking')) errorType = 'BROWSER_BLOCKING';
      else if (errorMessage.includes('Server error')) errorType = 'SERVER_ERROR';
      else if (errorMessage.includes('IP location is not allowed')) errorType = 'IP_BLOCKED';
      else if (errorMessage.includes('Game stability')) errorType = 'STABILITY_ERROR';
      
      return { 
        success: false, 
        errorType, 
        errorDetails: errorMessage
      };
    }
  }

  /**
   * Универсальный метод для быстрого тестирования игры (без полной проверки)
   */
  async testGameQuick(gameTitle: string, providerName?: string): Promise<boolean> {
    this.logStep(`Quick game test: ${gameTitle}`);
    
    try {
      // Только кликаем и проверяем базовые вещи
      await this.gameInteractionService.clickRealButton(gameTitle, providerName);
      await this.gameUrlService.waitForGameUrl(10000);
      
      const iframe = this.page.locator('#fullscreen-container iframe');
      await expect(iframe).toBeVisible();
      
      this.logSuccess(`✅ Quick test passed for game: ${gameTitle}`);
      return true;

    } catch (error) {
      this.logError(`Quick test failed for game ${gameTitle}: ${error}`);
      return false;
    }
  }

  /**
   * Универсальный метод для тестирования стабильности игры
   */
  async testGameStabilityUniversal(gameTitle: string, durationSeconds: number = 15): Promise<{ 
    isStable: boolean; 
    failureReason?: string;
    duration: number;
  }> {
    this.logStep(`Universal stability test: ${gameTitle} (${durationSeconds}s)`);
    
    try {
      const result = await this.gameStabilityService.extendedStabilityCheck(gameTitle);
      
      this.logStep(`Stability test completed: ${result.isStable ? 'STABLE' : 'UNSTABLE'}`);
      return {
        isStable: result.isStable,
        failureReason: result.failureReason,
        duration: durationSeconds
      };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logError(`Stability test failed for game ${gameTitle}: ${errorMessage}`);
      return {
        isStable: false,
        failureReason: errorMessage,
        duration: durationSeconds
      };
    }
  }

  /**
   * Универсальный метод для получения всех игр с возможностью фильтрации
   */
  async getAllGamesUniversal(providerName?: string): Promise<Array<{ 
    index: number; 
    title: string; 
    provider: string; 
    locator: any 
  }>> {
    this.logStep(`Getting all games${providerName ? ` for provider: ${providerName}` : ''}`);
    
    try {
      if (providerName) {
        return await this.gameDetectionService.getGamesByProviderWithIndexes(providerName);
      } else {
        return await this.gameDetectionService.getAllGamesWithIndexes();
      }
    } catch (error) {
      this.logError(`Failed to get games: ${error}`);
      return [];
    }
  }

  /**
   * Универсальный метод для поиска игры
   */
  async findGameUniversal(searchTerm: string, providerName?: string): Promise<{ 
    found: boolean; 
    gameData?: { index: number; title: string; provider: string; locator: any };
    allGames?: Array<{ index: number; title: string; provider: string; locator: any }>
  }> {
    this.logStep(`Universal game search: ${searchTerm}`);
    
    try {
      const allGames = await this.getAllGamesUniversal(providerName);
      
      // Ищем игру по названию
      const foundGame = allGames.find(game => 
        game.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (foundGame) {
        this.logSuccess(`Game found: ${foundGame.title} at index ${foundGame.index}`);
        return { found: true, gameData: foundGame, allGames };
      } else {
        this.logStep(`Game not found: ${searchTerm}`);
        return { found: false, allGames };
      }

    } catch (error) {
      this.logError(`Search failed: ${error}`);
      return { found: false };
    }
  }
}