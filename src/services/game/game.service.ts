/**
 * Game Service - Рефакторированный сервис для работы с играми
 * Устранены дубликаты, используется базовый класс и централизованные селекторы
 */

import { Page } from '@playwright/test';
import { BaseGameService } from '@/core/abstract/base-game-service';
import { ILogger } from '@/core/interfaces/logger.interface';
import { GameInfo, GameTestResult, GameStabilityResult, GameErrorType, GameType, GameStatus } from '@/types/game.types';
import { logger } from '@/core/logger';

export class GameService extends BaseGameService {
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'GameService', loggerInstance || logger);
  }

  // ============ ОСНОВНЫЕ МЕТОДЫ ТЕСТИРОВАНИЯ ============

  /**
   * Универсальный метод для тестирования игры
   */
  async testGameUniversal(gameTitle: string, providerName?: string): Promise<GameTestResult> {
    this.logStep(`Universal game test: ${gameTitle}`);
    
    try {
      // Применяем фильтр по провайдеру, если указан
      if (providerName) {
        await this.filterByProvider(providerName);
        await this.waitForTimeout(2000);
      }
      
      // Находим игру
      const gameInfo = await this.findGameByTitle(gameTitle);
      if (!gameInfo) {
        return {
          success: false,
          errorType: GameErrorType.GAME_NOT_FOUND,
          errorDetails: `Game not found: ${gameTitle}`
        };
      }
      
      // Открываем игру
      await this.openGameWithFullCheck(gameTitle, providerName);
      
      this.logSuccess(`✅ Game "${gameTitle}" opened successfully`);
      return { 
        success: true,
        gameData: gameInfo
      };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logError(`Failed to test game "${gameTitle}": ${errorMessage}`);
      
      // Определяем тип ошибки
      const errorType = this.determineErrorType(errorMessage);
      
      return { 
        success: false, 
        errorType, 
        errorDetails: errorMessage
      };
    }
  }

  /**
   * Универсальный метод для тестирования стабильности игры
   */
  async testGameStabilityUniversal(gameTitle: string, durationSeconds: number = 15): Promise<GameStabilityResult> {
    this.logStep(`Universal stability test: ${gameTitle} (${durationSeconds}s)`);
    
    try {
      const result = await this.monitorGameStability(gameTitle, durationSeconds);
      
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

  // ============ МЕТОДЫ ОБНАРУЖЕНИЯ ИГР ============

  async getAllGamesWithIndexes(): Promise<GameInfo[]> {
    this.logStep('Getting all games with indexes');
    
    try {
      await this.waitForGamesToLoad();
      const cards = await this.gameCards.all();
      const games: GameInfo[] = [];

      const maxGames = Math.min(cards.length, this.constants.LIMITS.MAX_GAMES);
      
      for (let i = 0; i < maxGames; i++) {
        try {
          const gameInfo = await this.extractGameInfo(cards[i], i);
          if (gameInfo) {
            games.push(gameInfo);
          }
        } catch (error) {
          this.logStep(`Skipping game at index ${i} due to error`);
          continue;
        }
      }

      this.logSuccess(`Found ${games.length} games`);
      return games;
    } catch (error) {
      this.logError('Failed to get all games', error);
      return [];
    }
  }

  async getGamesCount(): Promise<number> {
    try {
      await this.waitForGamesToLoad();
      const count = await this.gameCards.count();
      this.logStep(`Games count: ${count}`);
      return count;
    } catch (error) {
      this.logError('Failed to get games count', error);
      return 0;
    }
  }

  async getGameByIndex(index: number): Promise<GameInfo | null> {
    this.logStep(`Getting game by index: ${index}`);
    
    try {
      await this.waitForGamesToLoad();
      const cards = await this.gameCards.all();
      
      if (index >= 0 && index < cards.length) {
        const gameInfo = await this.extractGameInfo(cards[index], index);
        this.logSuccess(`Game at index ${index}: ${gameInfo?.title || 'Unknown'}`);
        return gameInfo;
      }
      
      this.logStep(`Game not found at index: ${index}`);
      return null;
    } catch (error) {
      this.logError(`Failed to get game by index: ${index}`, error);
      return null;
    }
  }

  async findGameByTitle(title: string, provider?: string): Promise<GameInfo | null> {
    this.logStep(`Finding game by title: ${title}${provider ? ` (provider: ${provider})` : ''}`);
    
    try {
      const games = await this.getAllGamesWithIndexes();
      
      for (const game of games) {
        const titleMatch = game.title.toLowerCase().includes(title.toLowerCase());
        const providerMatch = !provider || game.provider.toLowerCase().includes(provider.toLowerCase());
        
        if (titleMatch && providerMatch) {
          this.logSuccess(`Game found: ${game.title} by ${game.provider}`);
          return game;
        }
      }
      
      this.logStep(`Game not found: ${title}`);
      return null;
    } catch (error) {
      this.logError(`Failed to find game by title: ${title}`, error);
      return null;
    }
  }

  // ============ МЕТОДЫ ВЗАИМОДЕЙСТВИЯ ============

  async clickGameByIndex(index: number): Promise<void> {
    this.logStep(`Clicking game at index: ${index}`);
    
    try {
      const card = this.gameCards.nth(index);
      await card.click();
      this.logSuccess(`Game clicked at index: ${index}`);
    } catch (error) {
      this.logError(`Failed to click game at index: ${index}`, error);
      throw error;
    }
  }

  async clickPlayButtonByIndex(index: number): Promise<void> {
    this.logStep(`Clicking play button at index: ${index}`);
    
    try {
      const playBtn = this.playButton.nth(index);
      await playBtn.click();
      this.logSuccess(`Play button clicked at index: ${index}`);
    } catch (error) {
      this.logError(`Failed to click play button at index: ${index}`, error);
      throw error;
    }
  }

  async clickDemoButtonByIndex(index: number): Promise<void> {
    this.logStep(`Clicking demo button at index: ${index}`);
    
    try {
      const demoBtn = this.demoButton.nth(index);
      await demoBtn.click();
      this.logSuccess(`Demo button clicked at index: ${index}`);
    } catch (error) {
      this.logError(`Failed to click demo button at index: ${index}`, error);
      throw error;
    }
  }

  // ============ МЕТОДЫ ВАЛИДАЦИИ ============

  async validateGameUrl(url: string): Promise<boolean> {
    return await this.validateUrlPattern(url);
  }

  async checkGameElements(): Promise<boolean> {
    return await this.validateGameElements();
  }

  async closeGameIframe(): Promise<void> {
    this.logStep('Closing game iframe');
    
    try {
      for (const selector of this.selectors.CLOSE_BUTTONS) {
        const closeButton = this.page.locator(selector);
        if (await closeButton.isVisible()) {
          await closeButton.click();
          this.logSuccess('Game iframe closed');
          return;
        }
      }
      
      // Если нет кнопки закрытия, нажимаем Escape
      await this.page.keyboard.press('Escape');
      this.logSuccess('Game iframe closed with Escape key');
    } catch (error) {
      this.logError('Failed to close game iframe', error);
      throw error;
    }
  }

  // ============ МЕТОДЫ ФИЛЬТРАЦИИ ============

  async filterByProvider(providerName: string): Promise<void> {
    this.logStep(`Filtering by provider: ${providerName}`);
    
    try {
      const providerDropdown = this.page.locator(this.selectors.PROVIDER_DROPDOWN);
      await providerDropdown.click();
      
      const providerSearch = providerDropdown.locator('input[type="search"]');
      await providerSearch.fill(providerName);
      
      const providerItem = this.page.locator(this.selectors.getProviderByName(providerName));
      await providerItem.click();
      
      await this.waitForGamesToLoad();
      this.logSuccess(`Filtered by provider: ${providerName}`);
    } catch (error) {
      this.logError(`Failed to filter by provider: ${providerName}`, error);
      throw error;
    }
  }

  // ============ ПРИВАТНЫЕ МЕТОДЫ ============

  private async openGameWithFullCheck(gameTitle: string): Promise<void> {
    this.logStep(`Opening game with full check: ${gameTitle}`);
    
    try {
      // Находим игру
      const gameCard = this.page.locator(this.selectors.getGameByTitle(gameTitle));
      await gameCard.waitFor({ state: 'visible', timeout: 5000 });
      
      // Наводим курсор на игру
      await gameCard.hover();
      
      // Кликаем на кнопку "Реальний"
      const realButton = gameCard.locator(this.selectors.REAL_BUTTON);
      await realButton.waitFor({ state: 'visible', timeout: 3000 });
      await realButton.click();
      
      // Ждем загрузки iframe
      await this.waitForIframeToLoad();
      
      // Проверяем все возможные ошибки
      await this.checkAllGameErrors(gameTitle);
      
      // Проверяем canvas
      await this.verifyGameCanvas();
      
      this.logSuccess(`Game opened successfully: ${gameTitle}`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logError(`Failed to open game ${gameTitle}: ${errorMessage}`);
      throw error;
    }
  }

  private async checkAllGameErrors(gameTitle: string): Promise<void> {
    // Проверяем на IP блокировку
    const isIpBlocked = await this.checkForSpecificError(this.constants.ERROR_TYPES.IP_BLOCKED);
    if (isIpBlocked) {
      this.logSuccess(`✅ Game "${gameTitle}" is blocked by IP location - test passed (expected behavior)`);
      return;
    }
    
    // Проверяем на валютные ограничения
    const currencyRestriction = await this.checkForSpecificError(this.constants.ERROR_TYPES.CURRENCY_RESTRICTION);
    if (currencyRestriction) {
      this.logError(`❌ Currency restriction detected for game "${gameTitle}"`);
      throw new Error('Currency restriction detected');
    }
    
    // Проверяем на ошибку блокировки браузером
    const browserBlocking = await this.checkForSpecificError(this.constants.ERROR_TYPES.BROWSER_BLOCKING);
    if (browserBlocking) {
      this.logError(`❌ Browser blocking error detected for game "${gameTitle}"`);
      throw new Error('Browser blocking error detected');
    }
      
    // Проверяем на 500 ошибку сервера
    const serverError = await this.checkForSpecificError(this.constants.ERROR_TYPES.SERVER_ERROR);
    if (serverError) {
      this.logError(`❌ Server error detected for game "${gameTitle}"`);
      throw new Error('Server error detected');
    }
  }

  private async verifyGameCanvas(): Promise<void> {
    const canvasFound = await this.checkCanvasWithMultipleSelectors();
    if (!canvasFound) {
      const gameIndicatorsFound = await this.checkGameIndicators();
      if (!gameIndicatorsFound) {
        throw new Error('Canvas not found inside iframe and no alternative game elements detected');
      }
    }
  }

  private async monitorGameStability(gameTitle: string, durationSeconds: number): Promise<{ isStable: boolean; failureReason?: string }> {
    this.logStep(`Monitoring game stability: ${gameTitle} for ${durationSeconds}s`);
    
    const startTime = Date.now();
    const checkInterval = this.constants.TIMEOUTS.STABILITY_CHECK;
    const maxChecks = Math.floor(durationSeconds * 1000 / checkInterval);
    
    try {
      for (let i = 0; i < maxChecks; i++) {
        await this.waitForTimeout(checkInterval);
        
        // Проверяем, что iframe все еще видим
        const iframeVisible = await this.isIframeVisible();
        if (!iframeVisible) {
          const duration = (Date.now() - startTime) / 1000;
          return {
            isStable: false,
            failureReason: `Game iframe disappeared after ${duration}s`
          };
        }

        // Проверяем на ошибки
        const errorCheck = await this.checkForErrorsInIframe();
        if (errorCheck.hasError) {
          const duration = (Date.now() - startTime) / 1000;
          return {
            isStable: false,
            failureReason: `Game errors detected after ${duration}s: ${errorCheck.errorText}`
          };
        }

        // Проверяем URL (если изменился, игра могла закрыться)
        const currentUrl = this.getCurrentUrl();
        if (!currentUrl.includes(this.constants.URL_PATTERNS.GAME_PLAY)) {
          return {
            isStable: false,
            failureReason: `Game URL changed after ${(Date.now() - startTime) / 1000}s`
          };
        }
      }

      const duration = (Date.now() - startTime) / 1000;
      this.logSuccess(`Game stability check passed: ${duration}s`);
      return { isStable: true };
      
    } catch (error) {
      const duration = (Date.now() - startTime) / 1000;
      this.logError(`Game stability check failed: ${error}`, error);
      return {
        isStable: false,
        failureReason: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async extractGameInfo(card: Locator, index: number): Promise<GameInfo | null> {
    try {
      const title = await this.safeGetText(card.locator(this.selectors.GAME_TITLE));
      const provider = await this.safeGetText(card.locator(this.selectors.GAME_PROVIDER));
      const image = await this.safeGetAttribute(card.locator(this.selectors.GAME_IMAGE), 'src') || '';
      
      const hasPlayButton = await this.safeIsVisible(card.locator(this.selectors.PLAY_BUTTON));
      const hasDemoButton = await this.safeIsVisible(card.locator(this.selectors.DEMO_BUTTON));

      return {
        index,
        title: title.trim(),
        provider: provider.trim(),
        image,
        hasPlayButton,
        hasDemoButton,
        locator: card,
        type: GameType.SLOT,
        status: GameStatus.LOADED
      };
    } catch (error) {
      this.logError(`Failed to extract game info at index ${index}`, error);
      return null;
    }
  }

  private determineErrorType(errorMessage: string): GameErrorType {
    if (errorMessage.includes('Currency restriction')) return GameErrorType.CURRENCY_RESTRICTION;
    if (errorMessage.includes('Browser blocking')) return GameErrorType.BROWSER_BLOCKING;
    if (errorMessage.includes('Server error')) return GameErrorType.SERVER_ERROR;
    if (errorMessage.includes('IP location is not allowed')) return GameErrorType.IP_BLOCKED;
    if (errorMessage.includes('Game stability')) return GameErrorType.STABILITY_ERROR;
    if (errorMessage.includes('Game not found')) return GameErrorType.GAME_NOT_FOUND;
    if (errorMessage.includes('URL')) return GameErrorType.URL_MISMATCH;
    if (errorMessage.includes('iframe')) return GameErrorType.IFRAME_ERROR;
    return GameErrorType.UNKNOWN_ERROR;
  }
}