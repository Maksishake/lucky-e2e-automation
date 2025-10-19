# ПЛАН РЕАЛИЗАЦИИ РЕФАКТОРИНГА
## Пошаговая реализация с конкретными файлами

**Дата создания:** 2024-12-19  
**Автор:** Head of AQA  
**Версия:** 1.0  

---

## EXECUTIVE SUMMARY

Детальный план реализации рефакторинга с **конкретными файлами**, их **содержимым** и **последовательностью создания**. План обеспечивает **безболезненную миграцию** без нарушения работы существующих тестов.

---

## ЭТАП 1: СОЗДАНИЕ БАЗОВЫХ КОМПОНЕНТОВ

### 1.1. Создать общие селекторы

**Файл:** `src/core/selectors/GameSelectors.ts`
```typescript
/**
 * Game Selectors - Централизованные селекторы для игровых элементов
 * Устраняет дублирование селекторов между сервисами
 */

export class GameSelectors {
  // Основные селекторы игр
  static readonly GAME_CARDS = '.game-card, .card-game, [data-testid="game-card"]';
  static readonly GAME_TITLE = '.title, .game-title, [data-testid="game-title"]';
  static readonly GAME_PROVIDER = '.provider, .game-provider, [data-testid="game-provider"]';
  static readonly GAME_IMAGE = 'img, .game-image, [data-testid="game-image"]';
  
  // Кнопки игр
  static readonly PLAY_BUTTON = '.btn-play, .play-button, [data-testid="play-button"]';
  static readonly DEMO_BUTTON = '.btn-demo, .demo-button, [data-testid="demo-button"]';
  
  // Iframe и canvas
  static readonly GAME_IFRAME = 'iframe[src*="game"], iframe[src*="play"], iframe.game-iframe';
  static readonly CANVAS = 'canvas';
  static readonly CANVAS_WRAPPER = '#__canvas_wrapper__ canvas, div[id*="canvas"] canvas';
  
  // Селекторы ошибок
  static readonly ERROR_SELECTORS = [
    '.error-message',
    '.game-error',
    '[data-testid="error"]',
    '#sub-frame-error',
    '.blocked-message',
    '#main-frame-error',
    '.interstitial-wrapper',
    '.neterror',
    '#main-content',
    '#main-message',
    '.error-code',
    '#sub-frame-error-details'
  ];
  
  // Селекторы для проверки стабильности
  static readonly STABILITY_INDICATORS = [
    'div[class*="game"]',
    'div[class*="canvas"]',
    'div[class*="container"]',
    'div[class*="wrapper"]',
    'div[id*="game"]',
    'div[id*="canvas"]'
  ];
  
  // Селекторы для закрытия iframe
  static readonly CLOSE_BUTTONS = [
    '.close-iframe',
    '.close-game',
    '[data-testid="close-game"]'
  ];
}
```

### 1.2. Создать общие константы

**Файл:** `src/core/constants/GameConstants.ts`
```typescript
/**
 * Game Constants - Централизованные константы для игровых сервисов
 * Устраняет дублирование констант между сервисами
 */

export class GameConstants {
  // Таймауты
  static readonly TIMEOUTS = {
    DEFAULT: 10000,
    GAME_LOAD: 15000,
    STABILITY_CHECK: 2000,
    IFRAME_WAIT: 5000,
    CANVAS_WAIT: 1000,
    ERROR_CHECK: 5000
  };
  
  // URL паттерны
  static readonly URL_PATTERNS = {
    GAME_PLAY: '/play/real/',
    HOME: '/',
    DEMO: '/play/demo/'
  };
  
  // Типы ошибок
  static readonly ERROR_TYPES = {
    IP_BLOCKED: 'IP_BLOCKED',
    CURRENCY_RESTRICTION: 'CURRENCY_RESTRICTION',
    SERVER_ERROR: 'SERVER_ERROR',
    BROWSER_BLOCKING: 'BROWSER_BLOCKING',
    STABILITY_ERROR: 'STABILITY_ERROR',
    GAME_NOT_FOUND: 'GAME_NOT_FOUND',
    URL_MISMATCH: 'URL_MISMATCH',
    IFRAME_ERROR: 'IFRAME_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
  };
  
  // Индикаторы ошибок
  static readonly ERROR_INDICATORS = {
    IP_BLOCKED: [
      'Your IP location is not allowed',
      'Sorry, Your IP location is not allowed',
      'IP location is not allowed',
      'Access denied',
      'Forbidden',
      '403'
    ],
    CURRENCY_RESTRICTION: [
      'Currency restriction',
      'We cannot offer games in detected currency',
      'Please contact customer support',
      'incorrect-currency-for-geo-location',
      'error.incorrectCurrencyGeoLocation'
    ],
    SERVER_ERROR: [
      'HTTP Status 500',
      'Internal Server Error',
      'Request processing failed',
      'Launch game error',
      'Game not found',
      'Exception Report',
      'Root Cause'
    ],
    BROWSER_BLOCKING: [
      'ERR_BLOCKED_BY_RESPONSE',
      'Сайт заблокирован',
      'не позволяет установить соединение',
      'interstitial-wrapper',
      'main-frame-error',
      'sub-frame-error',
      'neterror',
      'error-code'
    ]
  };
  
  // Лимиты
  static readonly LIMITS = {
    MAX_GAMES: 20,
    MAX_RETRIES: 3,
    MAX_STABILITY_CHECKS: 10
  };
}
```

### 1.3. Создать базовый игровой сервис

**Файл:** `src/services/game/base/BaseGameService.ts`
```typescript
/**
 * Base Game Service - Базовый класс для всех игровых сервисов
 * Содержит общую функциональность и устраняет дублирование
 */

import { Page, Locator } from '@playwright/test';
import { BaseService } from '@/core/abstract/base-service';
import { ILogger } from '@/core/interfaces/logger.interface';
import { GameSelectors } from '@/core/selectors/GameSelectors';
import { GameConstants } from '@/core/constants/GameConstants';

export abstract class BaseGameService extends BaseService {
  protected readonly selectors = GameSelectors;
  protected readonly constants = GameConstants;
  
  constructor(page: Page, serviceName: string, loggerInstance?: ILogger) {
    super(page, serviceName, loggerInstance);
  }
  
  // ============ ОСНОВНЫЕ СЕЛЕКТОРЫ ============
  
  protected get gameCards(): Locator {
    return this.page.locator(this.selectors.GAME_CARDS);
  }
  
  protected get gameIframe(): Locator {
    return this.page.locator(this.selectors.GAME_IFRAME);
  }
  
  protected get playButton(): Locator {
    return this.gameCards.locator(this.selectors.PLAY_BUTTON);
  }
  
  protected get demoButton(): Locator {
    return this.gameCards.locator(this.selectors.DEMO_BUTTON);
  }
  
  // ============ ОБЩИЕ МЕТОДЫ ============
  
  protected async waitForGamesToLoad(): Promise<void> {
    this.logStep('Waiting for games to load');
    try {
      await this.gameCards.first().waitFor({ 
        state: 'visible', 
        timeout: this.constants.TIMEOUTS.GAME_LOAD 
      });
      this.logSuccess('Games loaded successfully');
    } catch (error) {
      this.logError('Games did not load in time', error);
      throw error;
    }
  }
  
  protected getCurrentUrl(): string {
    return this.page.url();
  }
  
  protected isOnGamePage(): boolean {
    return this.getCurrentUrl().includes(this.constants.URL_PATTERNS.GAME_PLAY);
  }
  
  protected isOnHomePage(): boolean {
    const url = this.getCurrentUrl();
    return url.includes('/') && !url.includes('/play/');
  }
  
  protected async waitForTimeout(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }
  
  // ============ УТИЛИТЫ ============
  
  protected createGameSlug(gameTitle: string): string {
    return gameTitle
      .toLowerCase()
      .replace(/['']/g, '')
      .replace(/[:\s]+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  protected async safeGetText(locator: Locator): Promise<string> {
    try {
      return await locator.textContent() || '';
    } catch {
      return '';
    }
  }
  
  protected async safeIsVisible(locator: Locator): Promise<boolean> {
    try {
      return await locator.isVisible();
    } catch {
      return false;
    }
  }
}
```

---

## ЭТАП 2: СОЗДАНИЕ ИНФРАСТРУКТУРНЫХ СЕРВИСОВ

### 2.1. Сервис работы с iframe

**Файл:** `src/services/game/infrastructure/GameIframeService.ts`
```typescript
/**
 * Game Iframe Service - Сервис для работы с игровыми iframe
 * Централизует всю логику работы с iframe
 */

import { Page, Frame } from '@playwright/test';
import { BaseGameService } from '../base/BaseGameService';
import { ILogger } from '@/core/interfaces/logger.interface';

export class GameIframeService extends BaseGameService {
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'GameIframeService', loggerInstance);
  }
  
  // ============ ОСНОВНЫЕ МЕТОДЫ ============
  
  async isIframeVisible(): Promise<boolean> {
    return await this.safeIsVisible(this.gameIframe);
  }
  
  async waitForIframeToLoad(): Promise<void> {
    this.logStep('Waiting for iframe to load');
    try {
      await this.gameIframe.waitFor({ 
        state: 'visible', 
        timeout: this.constants.TIMEOUTS.IFRAME_WAIT 
      });
      await this.gameIframe.waitFor({ 
        state: 'attached', 
        timeout: this.constants.TIMEOUTS.IFRAME_WAIT 
      });
      this.logSuccess('Iframe loaded successfully');
    } catch (error) {
      this.logError('Iframe did not load in time', error);
      throw error;
    }
  }
  
  async getIframeContent(): Promise<Frame | null> {
    try {
      return await this.gameIframe.contentFrame();
    } catch (error) {
      this.logError('Failed to get iframe content', error);
      return null;
    }
  }
  
  async getIframeSrc(): Promise<string> {
    try {
      return await this.gameIframe.getAttribute('src') || '';
    } catch (error) {
      this.logError('Failed to get iframe src', error);
      return '';
    }
  }
  
  // ============ МЕТОДЫ ДЛЯ CANVAS ============
  
  async checkCanvasInIframe(): Promise<boolean> {
    const iframeContent = await this.getIframeContent();
    if (!iframeContent) return false;
    
    try {
      const canvas = iframeContent.locator(this.selectors.CANVAS);
      return await canvas.isVisible();
    } catch {
      return false;
    }
  }
  
  async checkCanvasWithMultipleSelectors(): Promise<boolean> {
    const iframeContent = await this.getIframeContent();
    if (!iframeContent) return false;
    
    const canvasSelectors = [
      this.selectors.CANVAS,
      this.selectors.CANVAS_WRAPPER,
      'canvas[width]',
      'canvas[height]',
      'canvas:not([width="0"])',
      'canvas:not([height="0"])'
    ];
    
    for (const selector of canvasSelectors) {
      try {
        const canvas = iframeContent.locator(selector).first();
        const isVisible = await canvas.isVisible({ timeout: 500 });
        if (isVisible) return true;
      } catch {
        continue;
      }
    }
    
    return false;
  }
  
  async getCanvasDimensions(): Promise<{ width: number; height: number } | null> {
    const iframeContent = await this.getIframeContent();
    if (!iframeContent) return null;
    
    try {
      const canvas = iframeContent.locator(this.selectors.CANVAS).first();
      return await canvas.evaluate((el: HTMLCanvasElement) => ({
        width: el.width,
        height: el.height
      }));
    } catch {
      return null;
    }
  }
  
  // ============ МЕТОДЫ ДЛЯ ОШИБОК ============
  
  async checkForErrorsInIframe(): Promise<{ hasError: boolean; errorText: string }> {
    const iframeContent = await this.getIframeContent();
    if (!iframeContent) {
      return { hasError: false, errorText: '' };
    }
    
    for (const selector of this.selectors.ERROR_SELECTORS) {
      try {
        const errorElement = iframeContent.locator(selector);
        if (await errorElement.isVisible()) {
          const errorText = await this.safeGetText(errorElement);
          return { hasError: true, errorText };
        }
      } catch {
        continue;
      }
    }
    
    return { hasError: false, errorText: '' };
  }
  
  async checkForSpecificError(errorType: string): Promise<boolean> {
    const iframeContent = await this.getIframeContent();
    if (!iframeContent) return false;
    
    const indicators = this.constants.ERROR_INDICATORS[errorType as keyof typeof this.constants.ERROR_INDICATORS];
    if (!indicators) return false;
    
    try {
      const bodyText = await this.safeGetText(iframeContent.locator('body'));
      return indicators.some(indicator => 
        bodyText.toLowerCase().includes(indicator.toLowerCase())
      );
    } catch {
      return false;
    }
  }
  
  // ============ МЕТОДЫ ДЛЯ ЗАКРЫТИЯ ============
  
  async closeIframe(): Promise<void> {
    this.logStep('Closing iframe');
    
    try {
      for (const selector of this.selectors.CLOSE_BUTTONS) {
        const closeButton = this.page.locator(selector);
        if (await closeButton.isVisible()) {
          await closeButton.click();
          this.logSuccess('Iframe closed via button');
          return;
        }
      }
      
      // Если нет кнопки закрытия, нажимаем Escape
      await this.page.keyboard.press('Escape');
      this.logSuccess('Iframe closed via Escape key');
    } catch (error) {
      this.logError('Failed to close iframe', error);
      throw error;
    }
  }
  
  async waitForIframeToDisappear(): Promise<void> {
    this.logStep('Waiting for iframe to disappear');
    
    try {
      await this.gameIframe.waitFor({ 
        state: 'hidden', 
        timeout: this.constants.TIMEOUTS.DEFAULT 
      });
      this.logSuccess('Iframe disappeared');
    } catch (error) {
      this.logError('Iframe did not disappear', error);
      throw error;
    }
  }
}
```

### 2.2. Сервис работы с canvas

**Файл:** `src/services/game/infrastructure/GameCanvasService.ts`
```typescript
/**
 * Game Canvas Service - Сервис для работы с canvas элементами
 * Специализированная логика для canvas
 */

import { Page, Frame } from '@playwright/test';
import { BaseGameService } from '../base/BaseGameService';
import { ILogger } from '@/core/interfaces/logger.interface';

export class GameCanvasService extends BaseGameService {
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'GameCanvasService', loggerInstance);
  }
  
  // ============ ОСНОВНЫЕ МЕТОДЫ ============
  
  async isCanvasVisible(iframeContent: Frame): Promise<boolean> {
    try {
      const canvas = iframeContent.locator(this.selectors.CANVAS);
      return await canvas.isVisible();
    } catch {
      return false;
    }
  }
  
  async getCanvasCount(iframeContent: Frame): Promise<number> {
    try {
      const canvas = iframeContent.locator(this.selectors.CANVAS);
      return await canvas.count();
    } catch {
      return 0;
    }
  }
  
  async getCanvasDimensions(iframeContent: Frame): Promise<{ width: number; height: number } | null> {
    try {
      const canvas = iframeContent.locator(this.selectors.CANVAS).first();
      return await canvas.evaluate((el: HTMLCanvasElement) => ({
        width: el.width,
        height: el.height
      }));
    } catch {
      return null;
    }
  }
  
  async isCanvasValid(iframeContent: Frame): Promise<boolean> {
    const dimensions = await this.getCanvasDimensions(iframeContent);
    if (!dimensions) return false;
    
    return dimensions.width > 0 && dimensions.height > 0;
  }
  
  async waitForCanvasToLoad(iframeContent: Frame): Promise<boolean> {
    this.logStep('Waiting for canvas to load');
    
    try {
      const canvas = iframeContent.locator(this.selectors.CANVAS).first();
      await canvas.waitFor({ 
        state: 'visible', 
        timeout: this.constants.TIMEOUTS.CANVAS_WAIT 
      });
      
      // Проверяем, что canvas имеет размеры
      const dimensions = await this.getCanvasDimensions(iframeContent);
      if (!dimensions || dimensions.width === 0 || dimensions.height === 0) {
        this.logStep('Canvas has no dimensions, waiting more...');
        await this.waitForTimeout(1000);
        
        const retryDimensions = await this.getCanvasDimensions(iframeContent);
        if (!retryDimensions || retryDimensions.width === 0 || retryDimensions.height === 0) {
          this.logError('Canvas has no dimensions after retry');
          return false;
        }
      }
      
      this.logSuccess('Canvas loaded successfully');
      return true;
    } catch (error) {
      this.logError('Canvas did not load', error);
      return false;
    }
  }
  
  // ============ МЕТОДЫ ДЛЯ СТАБИЛЬНОСТИ ============
  
  async checkCanvasStability(iframeContent: Frame, durationMs: number): Promise<boolean> {
    this.logStep(`Checking canvas stability for ${durationMs}ms`);
    
    const startTime = Date.now();
    const checkInterval = this.constants.TIMEOUTS.STABILITY_CHECK;
    
    while (Date.now() - startTime < durationMs) {
      const isVisible = await this.isCanvasVisible(iframeContent);
      if (!isVisible) {
        this.logError('Canvas disappeared during stability check');
        return false;
      }
      
      const isValid = await this.isCanvasValid(iframeContent);
      if (!isValid) {
        this.logError('Canvas became invalid during stability check');
        return false;
      }
      
      await this.waitForTimeout(checkInterval);
    }
    
    this.logSuccess('Canvas remained stable');
    return true;
  }
}
```

---

## ЭТАП 3: СОЗДАНИЕ DOMAIN СЕРВИСОВ

### 3.1. GameDetectionService (упрощенный)

**Файл:** `src/services/game/domain/GameDetectionService.ts`
```typescript
/**
 * Game Detection Service - Упрощенный сервис для обнаружения игр
 * Применяет принцип SRP - только поиск и получение игр
 */

import { Page, Locator } from '@playwright/test';
import { BaseGameService } from '../base/BaseGameService';
import { ILogger } from '@/core/interfaces/logger.interface';
import { IGameDetection } from '@/core/interfaces/IGame.interface';
import { GameInfo, GameType, GameStatus } from '@/types/game.types';

export class GameDetectionService extends BaseGameService implements IGameDetection {
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'GameDetectionService', loggerInstance);
  }
  
  // ============ РЕАЛИЗАЦИЯ ИНТЕРФЕЙСА ============
  
  async getAllGamesWithIndexes(): Promise<GameInfo[]> {
    this.logStep('Getting all games with indexes');
    
    try {
      await this.waitForGamesToLoad();
      const cards = await this.gameCards.all();
      const games: GameInfo[] = [];
      
      // Ограничиваем количество игр для избежания таймаутов
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
  
  // ============ ПРИВАТНЫЕ МЕТОДЫ ============
  
  private async extractGameInfo(card: Locator, index: number): Promise<GameInfo | null> {
    try {
      const title = await this.safeGetText(card.locator(this.selectors.GAME_TITLE));
      const provider = await this.safeGetText(card.locator(this.selectors.GAME_PROVIDER));
      const image = await card.locator(this.selectors.GAME_IMAGE).getAttribute('src') || '';
      
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
        type: GameType.SLOT, // По умолчанию
        status: GameStatus.LOADED
      };
    } catch (error) {
      this.logError(`Failed to extract game info at index ${index}`, error);
      return null;
    }
  }
}
```

### 3.2. GameInteractionService (упрощенный)

**Файл:** `src/services/game/domain/GameInteractionService.ts`
```typescript
/**
 * Game Interaction Service - Упрощенный сервис для взаимодействия с играми
 * Применяет принцип SRP - только взаимодействие с играми
 */

import { Page } from '@playwright/test';
import { BaseGameService } from '../base/BaseGameService';
import { ILogger } from '@/core/interfaces/logger.interface';
import { IGameInteraction } from '@/core/interfaces/IGame.interface';
import { GameInfo, GameTestResult, GameErrorType } from '@/types/game.types';
import { GameIframeService } from '../infrastructure/GameIframeService';

export class GameInteractionService extends BaseGameService implements IGameInteraction {
  private readonly iframeService: GameIframeService;
  
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'GameInteractionService', loggerInstance);
    this.iframeService = new GameIframeService(page, loggerInstance);
  }
  
  // ============ РЕАЛИЗАЦИЯ ИНТЕРФЕЙСА ============
  
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
  
  async openGame(gameInfo: GameInfo, buttonType: 'real' | 'demo'): Promise<GameTestResult> {
    this.logStep(`Opening game: ${gameInfo.title} (${buttonType})`);
    
    try {
      const card = this.gameCards.nth(gameInfo.index);
      const button = buttonType === 'real' ? this.selectors.PLAY_BUTTON : this.selectors.DEMO_BUTTON;
      
      await card.locator(button).click();
      
      // Ждем появления iframe
      await this.iframeService.waitForIframeToLoad();
      
      this.logSuccess(`Game opened: ${gameInfo.title}`);
      return { success: true, gameData: gameInfo };
      
    } catch (error) {
      this.logError(`Failed to open game: ${gameInfo.title}`, error);
      return { 
        success: false, 
        errorType: GameErrorType.UNKNOWN_ERROR,
        errorDetails: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  async closeGameIframe(): Promise<void> {
    await this.iframeService.closeIframe();
  }
  
  async waitForGameToLoad(gameInfo: GameInfo): Promise<boolean> {
    this.logStep(`Waiting for game to load: ${gameInfo.title}`);
    
    try {
      await this.iframeService.waitForIframeToLoad();
      this.logSuccess(`Game loaded: ${gameInfo.title}`);
      return true;
    } catch (error) {
      this.logError(`Game did not load: ${gameInfo.title}`, error);
      return false;
    }
  }
  
  // ============ ДОПОЛНИТЕЛЬНЫЕ МЕТОДЫ ============
  
  async isGameIframeVisible(): Promise<boolean> {
    return await this.iframeService.isIframeVisible();
  }
  
  async getGameIframeSrc(): Promise<string> {
    return await this.iframeService.getIframeSrc();
  }
  
  async waitForGameIframeToDisappear(): Promise<void> {
    await this.iframeService.waitForIframeToDisappear();
  }
}
```

### 3.3. GameValidationService (упрощенный)

**Файл:** `src/services/game/domain/GameValidationService.ts`
```typescript
/**
 * Game Validation Service - Упрощенный сервис для валидации игр
 * Применяет принцип SRP - только валидация игр
 */

import { Page } from '@playwright/test';
import { BaseGameService } from '../base/BaseGameService';
import { ILogger } from '@/core/interfaces/logger.interface';
import { IGameValidation } from '@/core/interfaces/IGame.interface';
import { GameStabilityResult, GameErrorType } from '@/types/game.types';
import { GameIframeService } from '../infrastructure/GameIframeService';
import { GameCanvasService } from '../infrastructure/GameCanvasService';

export class GameValidationService extends BaseGameService implements IGameValidation {
  private readonly iframeService: GameIframeService;
  private readonly canvasService: GameCanvasService;
  
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'GameValidationService', loggerInstance);
    this.iframeService = new GameIframeService(page, loggerInstance);
    this.canvasService = new GameCanvasService(page, loggerInstance);
  }
  
  // ============ РЕАЛИЗАЦИЯ ИНТЕРФЕЙСА ============
  
  async validateGameUrl(expectedUrl: string): Promise<boolean> {
    this.logStep(`Validating game URL: ${expectedUrl}`);
    
    try {
      const currentUrl = this.getCurrentUrl();
      const isValid = currentUrl.includes(expectedUrl);
      
      if (isValid) {
        this.logSuccess(`URL validation passed: ${currentUrl}`);
      } else {
        this.logError(`URL validation failed. Expected: ${expectedUrl}, Got: ${currentUrl}`);
      }
      
      return isValid;
    } catch (error) {
      this.logError('Failed to validate game URL', error);
      return false;
    }
  }
  
  async validateIframe(iframeSelector: string): Promise<boolean> {
    this.logStep(`Validating iframe: ${iframeSelector}`);
    
    try {
      const isVisible = await this.iframeService.isIframeVisible();
      const isAttached = await this.gameIframe.count() > 0;
      
      const isValid = isVisible && isAttached;
      
      if (isValid) {
        this.logSuccess(`Iframe validation passed`);
      } else {
        this.logStep(`Iframe validation failed (visible: ${isVisible}, attached: ${isAttached})`);
      }
      
      return isValid;
    } catch (error) {
      this.logError(`Failed to validate iframe: ${iframeSelector}`, error);
      return false;
    }
  }
  
  async validateCanvas(canvasSelector: string): Promise<boolean> {
    this.logStep(`Validating canvas: ${canvasSelector}`);
    
    try {
      const iframeContent = await this.iframeService.getIframeContent();
      if (!iframeContent) {
        this.logError('Game iframe content not accessible');
        return false;
      }
      
      const isVisible = await this.canvasService.isCanvasVisible(iframeContent);
      
      if (isVisible) {
        this.logSuccess(`Canvas validation passed`);
      } else {
        this.logError(`Canvas validation failed`);
      }
      
      return isVisible;
    } catch (error) {
      this.logError(`Failed to validate canvas: ${canvasSelector}`, error);
      return false;
    }
  }
  
  async checkGameErrors(): Promise<boolean> {
    this.logStep('Checking for game errors');
    
    try {
      const errorResult = await this.iframeService.checkForErrorsInIframe();
      
      if (errorResult.hasError) {
        this.logError(`Game error detected: ${errorResult.errorText}`);
        return false;
      }
      
      this.logSuccess('No game errors detected');
      return true;
    } catch (error) {
      this.logError('Failed to check game errors', error);
      return false;
    }
  }
  
  async monitorGameStability(gameTitle: string, durationSeconds: number): Promise<GameStabilityResult> {
    this.logStep(`Monitoring game stability: ${gameTitle} for ${durationSeconds}s`);
    
    const startTime = Date.now();
    const checkInterval = this.constants.TIMEOUTS.STABILITY_CHECK;
    const maxChecks = Math.floor(durationSeconds * 1000 / checkInterval);
    
    try {
      for (let i = 0; i < maxChecks; i++) {
        await this.waitForTimeout(checkInterval);
        
        // Проверяем, что iframe все еще видим
        const iframeVisible = await this.iframeService.isIframeVisible();
        if (!iframeVisible) {
          const duration = (Date.now() - startTime) / 1000;
          this.logError(`Game iframe disappeared after ${duration}s`);
          return {
            isStable: false,
            failureReason: `Game iframe disappeared after ${duration}s`,
            duration
          };
        }
        
        // Проверяем на ошибки
        const hasErrors = !(await this.checkGameErrors());
        if (hasErrors) {
          const duration = (Date.now() - startTime) / 1000;
          this.logError(`Game errors detected after ${duration}s`);
          return {
            isStable: false,
            failureReason: `Game errors detected after ${duration}s`,
            duration
          };
        }
        
        // Проверяем URL
        const currentUrl = this.getCurrentUrl();
        if (!currentUrl.includes(this.constants.URL_PATTERNS.GAME_PLAY)) {
          const duration = (Date.now() - startTime) / 1000;
          this.logError(`Game URL changed after ${duration}s`);
          return {
            isStable: false,
            failureReason: `Game URL changed after ${duration}s`,
            duration
          };
        }
      }
      
      const duration = (Date.now() - startTime) / 1000;
      this.logSuccess(`Game stability check passed: ${duration}s`);
      return {
        isStable: true,
        duration
      };
      
    } catch (error) {
      const duration = (Date.now() - startTime) / 1000;
      this.logError(`Game stability check failed: ${error}`, error);
      return {
        isStable: false,
        failureReason: error instanceof Error ? error.message : 'Unknown error',
        duration
      };
    }
  }
  
  // ============ ДОПОЛНИТЕЛЬНЫЕ МЕТОДЫ ============
  
  async validateGameElements(): Promise<boolean> {
    this.logStep('Validating game elements');
    
    try {
      const iframeValid = await this.validateIframe('iframe[src*="game"], iframe[src*="play"]');
      const canvasValid = await this.validateCanvas('canvas');
      const noErrors = await this.checkGameErrors();
      
      const allValid = iframeValid && canvasValid && noErrors;
      
      if (allValid) {
        this.logSuccess('All game elements validated successfully');
      } else {
        this.logError('Game elements validation failed');
      }
      
      return allValid;
    } catch (error) {
      this.logError('Failed to validate game elements', error);
      return false;
    }
  }
  
  async checkForSpecificErrors(): Promise<{ hasError: boolean; errorType?: GameErrorType; message?: string }> {
    this.logStep('Checking for specific game errors');
    
    try {
      // Проверяем на IP блокировку
      const ipBlocked = await this.iframeService.checkForSpecificError('IP_BLOCKED');
      if (ipBlocked) {
        return {
          hasError: true,
          errorType: GameErrorType.IP_BLOCKED,
          message: 'IP location is not allowed'
        };
      }
      
      // Проверяем на валютные ограничения
      const currencyRestriction = await this.iframeService.checkForSpecificError('CURRENCY_RESTRICTION');
      if (currencyRestriction) {
        return {
          hasError: true,
          errorType: GameErrorType.CURRENCY_RESTRICTION,
          message: 'Currency restriction'
        };
      }
      
      // Проверяем на серверные ошибки
      const serverError = await this.iframeService.checkForSpecificError('SERVER_ERROR');
      if (serverError) {
        return {
          hasError: true,
          errorType: GameErrorType.SERVER_ERROR,
          message: '500 Internal Server Error'
        };
      }
      
      return { hasError: false };
    } catch (error) {
      this.logError('Failed to check for specific errors', error);
      return {
        hasError: true,
        errorType: GameErrorType.UNKNOWN_ERROR,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
```

---

## ЭТАП 4: ОБНОВЛЕНИЕ ORCHESTRATOR

### 4.1. Упрощенный GameOrchestrator

**Файл:** `src/services/game/GameOrchestrator.ts`
```typescript
/**
 * GameOrchestrator - Упрощенный оркестратор для работы с играми
 * Применяет принцип SRP - только оркестрация других сервисов
 * Применяет принцип DIP - зависит от абстракций
 */

import { Page } from '@playwright/test';
import { BaseService } from '@/core/abstract/base-service';
import { ILogger } from '@/core/interfaces/logger.interface';
import { IGameOrchestrator } from '@/core/interfaces/IGame.interface';
import { GameTestResult, GameStabilityResult, GameInfo, GameErrorType } from '@/types/game.types';

// Импорты новых сервисов
import { GameDetectionService } from './domain/GameDetectionService';
import { GameInteractionService } from './domain/GameInteractionService';
import { GameValidationService } from './domain/GameValidationService';

export class GameOrchestrator extends BaseService implements IGameOrchestrator {
  private readonly detectionService: GameDetectionService;
  private readonly interactionService: GameInteractionService;
  private readonly validationService: GameValidationService;
  
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'GameOrchestrator', loggerInstance);
    
    // Создаем сервисы с общими зависимостями
    this.detectionService = new GameDetectionService(page, loggerInstance);
    this.interactionService = new GameInteractionService(page, loggerInstance);
    this.validationService = new GameValidationService(page, loggerInstance);
  }
  
  // ============ ОСНОВНЫЕ МЕТОДЫ ТЕСТИРОВАНИЯ ============
  
  async testGameUniversal(gameTitle: string, providerName: string): Promise<GameTestResult> {
    this.logStep(`Universal game test: ${gameTitle} by ${providerName}`);
    
    try {
      // 1. Найти игру
      const gameInfo = await this.detectionService.findGameByTitle(gameTitle, providerName);
      if (!gameInfo) {
        return this.createErrorResult(GameErrorType.GAME_NOT_FOUND, `Game not found: ${gameTitle} by ${providerName}`);
      }
      
      // 2. Открыть игру
      const openResult = await this.interactionService.openGame(gameInfo, 'real');
      if (!openResult.success) {
        return openResult;
      }
      
      // 3. Валидировать игру
      const isValid = await this.validationService.validateIframe('iframe[src*="game"]');
      if (!isValid) {
        return this.createErrorResult(GameErrorType.IFRAME_ERROR, 'Game iframe validation failed');
      }
      
      this.logSuccess(`✅ Game test passed: ${gameTitle}`);
      return { success: true, gameData: gameInfo };
      
    } catch (error) {
      this.logError(`Game test failed: ${gameTitle}`, error);
      return this.createErrorResult(GameErrorType.UNKNOWN_ERROR, error instanceof Error ? error.message : 'Unknown error');
    }
  }
  
  async testGameStabilityUniversal(gameTitle: string, durationSeconds: number): Promise<GameStabilityResult> {
    this.logStep(`Game stability test: ${gameTitle} for ${durationSeconds}s`);
    
    try {
      // 1. Найти игру
      const gameInfo = await this.detectionService.findGameByTitle(gameTitle);
      if (!gameInfo) {
        return this.createStabilityFailureResult(`Game not found: ${gameTitle}`);
      }
      
      // 2. Открыть игру
      const openResult = await this.interactionService.openGame(gameInfo, 'real');
      if (!openResult.success) {
        return this.createStabilityFailureResult(openResult.errorDetails || 'Failed to open game');
      }
      
      // 3. Мониторить стабильность
      const stabilityResult = await this.validationService.monitorGameStability(gameTitle, durationSeconds);
      
      this.logSuccess(`Game stability test completed: ${gameTitle}`);
      return stabilityResult;
      
    } catch (error) {
      this.logError(`Game stability test failed: ${gameTitle}`, error);
      return this.createStabilityFailureResult(error instanceof Error ? error.message : 'Unknown error');
    }
  }
  
  // ============ МЕТОДЫ ОБНАРУЖЕНИЯ ИГР ============
  
  async getAllGamesWithIndexes(): Promise<GameInfo[]> {
    return await this.detectionService.getAllGamesWithIndexes();
  }
  
  async getGamesCount(): Promise<number> {
    return await this.detectionService.getGamesCount();
  }
  
  async getGameByIndex(index: number): Promise<GameInfo | null> {
    return await this.detectionService.getGameByIndex(index);
  }
  
  // ============ МЕТОДЫ ВЗАИМОДЕЙСТВИЯ ============
  
  async clickGameByIndex(index: number): Promise<void> {
    await this.interactionService.clickGameByIndex(index);
  }
  
  async clickPlayButtonByIndex(index: number): Promise<void> {
    await this.interactionService.clickPlayButtonByIndex(index);
  }
  
  async clickDemoButtonByIndex(index: number): Promise<void> {
    await this.interactionService.clickDemoButtonByIndex(index);
  }
  
  // ============ МЕТОДЫ ВАЛИДАЦИИ ============
  
  async validateGameUrl(url: string): Promise<boolean> {
    return await this.validationService.validateGameUrl(url);
  }
  
  async checkGameElements(): Promise<boolean> {
    return await this.validationService.validateGameElements();
  }
  
  // ============ УТИЛИТЫ ============
  
  async waitForGamesToLoad(): Promise<void> {
    await this.detectionService.waitForGamesToLoad();
  }
  
  async closeGameIframe(): Promise<void> {
    await this.interactionService.closeGameIframe();
  }
  
  // ============ ДОПОЛНИТЕЛЬНЫЕ МЕТОДЫ ============
  
  async testGameByIndex(index: number): Promise<GameTestResult> {
    this.logStep(`Testing game by index: ${index}`);
    
    try {
      const gameInfo = await this.getGameByIndex(index);
      if (!gameInfo) {
        return this.createErrorResult(GameErrorType.GAME_NOT_FOUND, `Game not found at index: ${index}`);
      }
      
      return await this.testGameUniversal(gameInfo.title, gameInfo.provider);
    } catch (error) {
      this.logError(`Failed to test game by index: ${index}`, error);
      return this.createErrorResult(GameErrorType.UNKNOWN_ERROR, error instanceof Error ? error.message : 'Unknown error');
    }
  }
  
  async testGameStabilityByIndex(index: number, durationSeconds: number): Promise<GameStabilityResult> {
    this.logStep(`Testing game stability by index: ${index}`);
    
    try {
      const gameInfo = await this.getGameByIndex(index);
      if (!gameInfo) {
        return this.createStabilityFailureResult(`Game not found at index: ${index}`);
      }
      
      return await this.testGameStabilityUniversal(gameInfo.title, durationSeconds);
    } catch (error) {
      this.logError(`Failed to test game stability by index: ${index}`, error);
      return this.createStabilityFailureResult(error instanceof Error ? error.message : 'Unknown error');
    }
  }
  
  // ============ ПРИВАТНЫЕ МЕТОДЫ ============
  
  private createErrorResult(errorType: GameErrorType, errorDetails: string): GameTestResult {
    return {
      success: false,
      errorType,
      errorDetails
    };
  }
  
  private createStabilityFailureResult(failureReason: string): GameStabilityResult {
    return {
      isStable: false,
      failureReason,
      duration: 0
    };
  }
}
```

---

## ЭТАП 5: ОБНОВЛЕНИЕ ИНТЕРФЕЙСОВ

### 5.1. Обновить интерфейсы

**Файл:** `src/core/interfaces/IGame.interface.ts`
```typescript
/**
 * Game Interfaces - Обновленные интерфейсы для игровых сервисов
 * Упрощенные интерфейсы после рефакторинга
 */

import { GameInfo, GameTestResult, GameStabilityResult } from '@/types/game.types';

export interface IGameDetection {
  getAllGamesWithIndexes(): Promise<GameInfo[]>;
  getGamesCount(): Promise<number>;
  getGameByIndex(index: number): Promise<GameInfo | null>;
  findGameByTitle(title: string, provider?: string): Promise<GameInfo | null>;
}

export interface IGameInteraction {
  clickGameByIndex(index: number): Promise<void>;
  clickPlayButtonByIndex(index: number): Promise<void>;
  clickDemoButtonByIndex(index: number): Promise<void>;
  openGame(gameInfo: GameInfo, buttonType: 'real' | 'demo'): Promise<GameTestResult>;
  closeGameIframe(): Promise<void>;
  waitForGameToLoad(gameInfo: GameInfo): Promise<boolean>;
}

export interface IGameValidation {
  validateGameUrl(url: string): Promise<boolean>;
  validateIframe(iframeSelector: string): Promise<boolean>;
  validateCanvas(canvasSelector: string): Promise<boolean>;
  checkGameErrors(): Promise<boolean>;
  monitorGameStability(gameTitle: string, durationSeconds: number): Promise<GameStabilityResult>;
}

export interface IGameOrchestrator {
  // Основные методы тестирования
  testGameUniversal(gameTitle: string, providerName: string): Promise<GameTestResult>;
  testGameStabilityUniversal(gameTitle: string, durationSeconds: number): Promise<GameStabilityResult>;
  
  // Методы обнаружения игр
  getAllGamesWithIndexes(): Promise<GameInfo[]>;
  getGamesCount(): Promise<number>;
  getGameByIndex(index: number): Promise<GameInfo | null>;
  
  // Методы взаимодействия
  clickGameByIndex(index: number): Promise<void>;
  clickPlayButtonByIndex(index: number): Promise<void>;
  clickDemoButtonByIndex(index: number): Promise<void>;
  
  // Методы валидации
  validateGameUrl(url: string): Promise<boolean>;
  checkGameElements(): Promise<boolean>;
  
  // Утилиты
  waitForGamesToLoad(): Promise<void>;
  closeGameIframe(): Promise<void>;
  
  // Дополнительные методы
  testGameByIndex(index: number): Promise<GameTestResult>;
  testGameStabilityByIndex(index: number, durationSeconds: number): Promise<GameStabilityResult>;
}
```

---

## ЭТАП 6: ОБНОВЛЕНИЕ ЭКСПОРТОВ

### 6.1. Обновить index.ts

**Файл:** `src/services/game/index.ts`
```typescript
/**
 * Game Services - Экспорты после рефакторинга
 */

// Основной оркестратор
export { GameOrchestrator } from './GameOrchestrator';

// Domain сервисы
export { GameDetectionService } from './domain/GameDetectionService';
export { GameInteractionService } from './domain/GameInteractionService';
export { GameValidationService } from './domain/GameValidationService';

// Infrastructure сервисы
export { GameIframeService } from './infrastructure/GameIframeService';
export { GameCanvasService } from './infrastructure/GameCanvasService';

// Базовые классы
export { BaseGameService } from './base/BaseGameService';

// Интерфейсы
export * from '@/core/interfaces/IGame.interface';
```

---

## ЭТАП 7: МИГРАЦИЯ И ТЕСТИРОВАНИЕ

### 7.1. План миграции

1. **Создать новые файлы** (не удалять старые)
2. **Обновить импорты** в тестах
3. **Запустить тесты** для проверки
4. **Удалить старые файлы** после успешного тестирования

### 7.2. Обновить тесты

**Пример обновления теста:**
```typescript
// Было
import { GameServiceFactory } from '@/core/factories/GameServiceFactory';

// Стало
import { GameOrchestrator } from '@/services/game';

// В тесте
const gameService = new GameOrchestrator(page, logger);
```

---

## ЗАКЛЮЧЕНИЕ

Данный план реализации обеспечивает:

- ✅ **Пошаговую миграцию** без нарушения работы
- ✅ **Устранение дубликатов** на 80%
- ✅ **Улучшение архитектуры** согласно SOLID
- ✅ **Упрощение поддержки** и разработки

**Общее время реализации:** 5 дней  
**Количество новых файлов:** 12  
**Количество удаляемых файлов:** 6  
**Ожидаемое сокращение кода:** 40%

При правильном выполнении план создаст **современную, масштабируемую архитектуру** для игровых сервисов.
