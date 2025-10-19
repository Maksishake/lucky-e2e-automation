# ПЛАН РЕАЛИЗАЦИИ РЕФАКТОРИНГА
## Детальный план внедрения изменений в src/services/game

**Дата создания:** 2024-12-19  
**Автор:** Head of AQA  
**Версия:** 1.0  

---

## EXECUTIVE SUMMARY

Данный документ содержит **пошаговый план реализации** рефакторинга папки `src/services/game` с конкретными задачами, временными рамками и критериями успеха.

### Ключевые цели:
- 🎯 **Устранить 100% дублирования** кода
- 🏗️ **Применить SOLID принципы** во всех сервисах
- 📈 **Сократить код на 47%** (с 1,500 до 800 строк)
- 🔧 **Создать единый интерфейс** для работы с играми
- 🚀 **Повысить производительность** разработки на 60%

---

## ФАЗА 1: СОЗДАНИЕ БАЗОВЫХ КОМПОНЕНТОВ (НЕДЕЛЯ 1)

### 1.1. ДЕНЬ 1-2: СОЗДАНИЕ GAME SELECTORS

#### Задача 1.1.1: Создать GameSelectors
**Приоритет:** КРИТИЧЕСКИЙ  
**Время:** 4 часа  
**Ответственный:** Senior AQA Engineer  

**Действия:**
1. Создать файл `src/services/game/selectors/GameSelectors.ts`
2. Вынести все дублированные селекторы в константы
3. Добавить JSDoc комментарии
4. Создать unit тесты

**Код:**
```typescript
/**
 * Game Selectors - Централизованные селекторы для игровых элементов
 * Устраняет дублирование селекторов между сервисами
 */
export class GameSelectors {
  // Основные селекторы игр
  static readonly GAME_CARD = '.game-card, .card-game, [data-testid="game-card"]';
  static readonly GAME_TITLE = '.title, .game-title, [data-testid="game-title"]';
  static readonly GAME_PROVIDER = '.provider, .game-provider, [data-testid="game-provider"]';
  static readonly GAME_IMAGE = 'img, .game-image, [data-testid="game-image"]';
  
  // Кнопки игр
  static readonly PLAY_BUTTON = '.btn-play, .play-button, [data-testid="play-button"]';
  static readonly DEMO_BUTTON = '.btn-demo, .demo-button, [data-testid="demo-button"]';
  
  // Iframe и canvas
  static readonly GAME_IFRAME = 'iframe[src*="game"], iframe[src*="play"], iframe.game-iframe';
  static readonly GAME_CANVAS = 'canvas';
  
  // Ошибки
  static readonly ERROR_MESSAGE = '.error-message, .game-error, [data-testid="error"]';
  static readonly IP_BLOCKED = 'text="Your IP location is not allowed"';
  static readonly CURRENCY_RESTRICTION = 'text="Currency restriction"';
  static readonly SERVER_ERROR = 'text="500 Internal Server Error"';
  
  // Закрытие iframe
  static readonly CLOSE_IFRAME = '.close-iframe, .close-game, [data-testid="close-game"]';
}
```

**Критерии успеха:**
- ✅ Все селекторы вынесены в константы
- ✅ Добавлены JSDoc комментарии
- ✅ Созданы unit тесты с покрытием 100%
- ✅ Проверка линтером без ошибок

#### Задача 1.1.2: Создать GameSelectorsFactory
**Приоритет:** ВЫСОКИЙ  
**Время:** 2 часа  
**Ответственный:** Senior AQA Engineer  

**Действия:**
1. Создать фабрику для динамических селекторов
2. Добавить методы для создания селекторов по индексу
3. Добавить валидацию селекторов

**Код:**
```typescript
export class GameSelectorsFactory {
  static getGameCardByIndex(index: number): string {
    return `${GameSelectors.GAME_CARD}:nth-child(${index + 1})`;
  }
  
  static getPlayButtonByIndex(index: number): string {
    return `${GameSelectors.PLAY_BUTTON}:nth-child(${index + 1})`;
  }
  
  static getErrorSelector(errorType: string): string {
    const errorMap = {
      'ip-blocked': GameSelectors.IP_BLOCKED,
      'currency-restriction': GameSelectors.CURRENCY_RESTRICTION,
      'server-error': GameSelectors.SERVER_ERROR
    };
    return errorMap[errorType] || GameSelectors.ERROR_MESSAGE;
  }
}
```

### 1.2. ДЕНЬ 3-4: СОЗДАНИЕ GAME IFRAME MANAGER

#### Задача 1.2.1: Создать GameIframeManager
**Приоритет:** КРИТИЧЕСКИЙ  
**Время:** 6 часов  
**Ответственный:** Senior AQA Engineer  

**Действия:**
1. Создать файл `src/services/game/managers/GameIframeManager.ts`
2. Вынести всю логику работы с iframe
3. Добавить retry логику
4. Создать unit тесты

**Код:**
```typescript
import { Page, Locator } from '@playwright/test';
import { ILogger } from '@/core/interfaces/logger.interface';
import { GameSelectors } from '../selectors/GameSelectors';
import { RetryManager } from '@/core/retry/RetryManager';

export class GameIframeManager {
  private readonly iframe: Locator;

  constructor(
    private readonly page: Page,
    private readonly logger: ILogger
  ) {
    this.iframe = this.page.locator(GameSelectors.GAME_IFRAME);
  }

  async waitForGameToLoad(timeout: number = 15000): Promise<boolean> {
    this.logger.info('GameIframeManager', 'Waiting for game to load');
    
    try {
      await this.iframe.waitFor({ state: 'visible', timeout });
      await this.iframe.waitFor({ state: 'attached', timeout: 10000 });
      
      this.logger.info('GameIframeManager', 'Game loaded successfully');
      return true;
    } catch (error) {
      this.logger.error('GameIframeManager', 'Game did not load', error);
      return false;
    }
  }

  async isGameIframeVisible(): Promise<boolean> {
    try {
      return await this.iframe.isVisible();
    } catch {
      return false;
    }
  }

  async getGameIframeSrc(): Promise<string> {
    try {
      return await this.iframe.getAttribute('src') || '';
    } catch (error) {
      this.logger.error('GameIframeManager', 'Failed to get iframe src', error);
      return '';
    }
  }

  async closeGameIframe(): Promise<void> {
    this.logger.info('GameIframeManager', 'Closing game iframe');
    
    try {
      const closeButton = this.page.locator(GameSelectors.CLOSE_IFRAME);
      
      if (await closeButton.isVisible()) {
        await closeButton.click();
        this.logger.info('GameIframeManager', 'Game iframe closed with button');
      } else {
        await this.page.keyboard.press('Escape');
        this.logger.info('GameIframeManager', 'Game iframe closed with Escape key');
      }
    } catch (error) {
      this.logger.error('GameIframeManager', 'Failed to close game iframe', error);
      throw error;
    }
  }

  async waitForGameIframeToDisappear(timeout: number = 10000): Promise<void> {
    this.logger.info('GameIframeManager', 'Waiting for game iframe to disappear');
    
    try {
      await this.iframe.waitFor({ state: 'hidden', timeout });
      this.logger.info('GameIframeManager', 'Game iframe disappeared');
    } catch (error) {
      this.logger.error('GameIframeManager', 'Game iframe did not disappear', error);
      throw error;
    }
  }
}
```

### 1.3. ДЕНЬ 5: СОЗДАНИЕ GAME VALIDATOR

#### Задача 1.3.1: Создать GameValidator
**Приоритет:** ВЫСОКИЙ  
**Время:** 4 часа  
**Ответственный:** Senior AQA Engineer  

**Действия:**
1. Создать файл `src/services/game/validators/GameValidator.ts`
2. Вынести всю логику валидации
3. Добавить умные проверки
4. Создать unit тесты

**Код:**
```typescript
import { Page, Locator } from '@playwright/test';
import { ILogger } from '@/core/interfaces/logger.interface';
import { GameSelectors } from '../selectors/GameSelectors';
import { GameErrorType } from '@/types/game.types';

export class GameValidator {
  private readonly iframe: Locator;
  private readonly canvas: Locator;

  constructor(
    private readonly page: Page,
    private readonly logger: ILogger
  ) {
    this.iframe = this.page.locator(GameSelectors.GAME_IFRAME);
    this.canvas = this.iframe.locator(GameSelectors.GAME_CANVAS);
  }

  async validateIframe(selector?: string): Promise<boolean> {
    this.logger.info('GameValidator', 'Validating iframe');
    
    try {
      const iframeSelector = selector || GameSelectors.GAME_IFRAME;
      const iframe = this.page.locator(iframeSelector);
      
      const isVisible = await iframe.isVisible();
      const isAttached = await iframe.count() > 0;
      
      const isValid = isVisible && isAttached;
      
      if (isValid) {
        this.logger.info('GameValidator', 'Iframe validation passed');
      } else {
        this.logger.error('GameValidator', `Iframe validation failed (visible: ${isVisible}, attached: ${isAttached})`);
      }
      
      return isValid;
    } catch (error) {
      this.logger.error('GameValidator', 'Failed to validate iframe', error);
      return false;
    }
  }

  async validateGameUrl(expectedUrl: string): Promise<boolean> {
    this.logger.info('GameValidator', `Validating game URL: ${expectedUrl}`);
    
    try {
      const currentUrl = this.page.url();
      const isValid = currentUrl.includes(expectedUrl);
      
      if (isValid) {
        this.logger.info('GameValidator', `URL validation passed: ${currentUrl}`);
      } else {
        this.logger.error('GameValidator', `URL validation failed. Expected: ${expectedUrl}, Got: ${currentUrl}`);
      }
      
      return isValid;
    } catch (error) {
      this.logger.error('GameValidator', 'Failed to validate game URL', error);
      return false;
    }
  }

  async validateCanvas(selector?: string): Promise<boolean> {
    this.logger.info('GameValidator', 'Validating canvas');
    
    try {
      const iframeVisible = await this.iframe.isVisible();
      if (!iframeVisible) {
        this.logger.error('GameValidator', 'Game iframe is not visible');
        return false;
      }

      const canvasSelector = selector || GameSelectors.GAME_CANVAS;
      const canvas = this.iframe.locator(canvasSelector);
      const isVisible = await canvas.isVisible();
      
      if (isVisible) {
        this.logger.info('GameValidator', 'Canvas validation passed');
      } else {
        this.logger.error('GameValidator', 'Canvas validation failed');
      }
      
      return isVisible;
    } catch (error) {
      this.logger.error('GameValidator', 'Failed to validate canvas', error);
      return false;
    }
  }

  async checkGameErrors(): Promise<{ hasError: boolean; errorType?: GameErrorType; message?: string }> {
    this.logger.info('GameValidator', 'Checking for game errors');
    
    try {
      const errorSelectors = [
        { selector: GameSelectors.IP_BLOCKED, type: GameErrorType.IP_BLOCKED, message: 'IP location is not allowed' },
        { selector: GameSelectors.CURRENCY_RESTRICTION, type: GameErrorType.CURRENCY_RESTRICTION, message: 'Currency restriction' },
        { selector: GameSelectors.SERVER_ERROR, type: GameErrorType.SERVER_ERROR, message: '500 Internal Server Error' }
      ];

      for (const { selector, type, message } of errorSelectors) {
        const errorElement = this.iframe.locator(selector);
        if (await errorElement.isVisible()) {
          this.logger.error('GameValidator', `Game error detected: ${message}`);
          return { hasError: true, errorType: type, message };
        }
      }

      this.logger.info('GameValidator', 'No game errors detected');
      return { hasError: false };
    } catch (error) {
      this.logger.error('GameValidator', 'Failed to check game errors', error);
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

## ФАЗА 2: РЕФАКТОРИНГ СЕРВИСОВ (НЕДЕЛЯ 2)

### 2.1. ДЕНЬ 1-2: РЕФАКТОРИНГ GAME DETECTION SERVICE

#### Задача 2.1.1: Рефакторить GameDetectionService
**Приоритет:** КРИТИЧЕСКИЙ  
**Время:** 6 часов  
**Ответственный:** Senior AQA Engineer  

**Действия:**
1. Удалить дублированные селекторы
2. Использовать GameSelectors
3. Использовать GameIframeManager
4. Упростить логику
5. Обновить тесты

**Код:**
```typescript
import { Page } from '@playwright/test';
import { BaseService } from '@/core/abstract/base-service';
import { ILogger } from '@/core/interfaces/logger.interface';
import { IGameDetection } from '@/core/interfaces/IGame.interface';
import { GameInfo, GameType, GameStatus } from '@/types/game.types';
import { GameSelectors } from './selectors/GameSelectors';
import { GameIframeManager } from './managers/GameIframeManager';
import { logger } from '@/core/logger';

export class GameDetectionService extends BaseService implements IGameDetection {
  private readonly iframeManager: GameIframeManager;

  constructor(page: Page, loggerInstance: ILogger = logger) {
    super(page, 'GameDetectionService', loggerInstance);
    this.iframeManager = new GameIframeManager(page, loggerInstance);
  }

  // Убрать дублированные селекторы - использовать GameSelectors
  private get gameCards() {
    return this.page.locator(GameSelectors.GAME_CARD);
  }

  private get gameCardTitle() {
    return this.gameCards.locator(GameSelectors.GAME_TITLE);
  }

  private get gameCardProvider() {
    return this.gameCards.locator(GameSelectors.GAME_PROVIDER);
  }

  private get gameCardImage() {
    return this.gameCards.locator(GameSelectors.GAME_IMAGE);
  }

  private get playButton() {
    return this.gameCards.locator(GameSelectors.PLAY_BUTTON);
  }

  private get demoButton() {
    return this.gameCards.locator(GameSelectors.DEMO_BUTTON);
  }

  async getAllGamesWithIndexes(): Promise<GameInfo[]> {
    this.logStep('Getting all games with indexes');
    
    try {
      await this.waitForGamesToLoad();
      const cards = await this.gameCards.all();
      const games: GameInfo[] = [];

      const maxGames = Math.min(cards.length, 20);
      
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

  async waitForGamesToLoad(): Promise<void> {
    this.logStep('Waiting for games to load');
    
    try {
      await this.gameCards.first().waitFor({ state: 'visible', timeout: 15000 });
      this.logSuccess('Games loaded');
    } catch (error) {
      this.logError('Games did not load in time', error);
      throw error;
    }
  }

  // Остальные методы без изменений, но с использованием GameSelectors
}
```

### 2.2. ДЕНЬ 3-4: РЕФАКТОРИНГ GAME INTERACTION SERVICE

#### Задача 2.2.1: Рефакторить GameInteractionService
**Приоритет:** КРИТИЧЕСКИЙ  
**Время:** 6 часов  
**Ответственный:** Senior AQA Engineer  

**Действия:**
1. Удалить дублированные селекторы
2. Использовать GameSelectors
3. Использовать GameIframeManager
4. Упростить логику
5. Обновить тесты

**Код:**
```typescript
import { Page } from '@playwright/test';
import { BaseService } from '@/core/abstract/base-service';
import { ILogger } from '@/core/interfaces/logger.interface';
import { IGameInteraction } from '@/core/interfaces/IGame.interface';
import { GameInfo, GameTestResult, GameErrorType } from '@/types/game.types';
import { GameSelectors } from './selectors/GameSelectors';
import { GameIframeManager } from './managers/GameIframeManager';
import { logger } from '@/core/logger';

export class GameInteractionService extends BaseService implements IGameInteraction {
  private readonly iframeManager: GameIframeManager;

  constructor(page: Page, loggerInstance: ILogger = logger) {
    super(page, 'GameInteractionService', loggerInstance);
    this.iframeManager = new GameIframeManager(page, loggerInstance);
  }

  // Убрать дублированные селекторы - использовать GameSelectors
  private get gameCards() {
    return this.page.locator(GameSelectors.GAME_CARD);
  }

  private get playButton() {
    return this.gameCards.locator(GameSelectors.PLAY_BUTTON);
  }

  private get demoButton() {
    return this.gameCards.locator(GameSelectors.DEMO_BUTTON);
  }

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

  async openGame(gameInfo: GameInfo, buttonType: 'real' | 'demo'): Promise<GameTestResult> {
    this.logStep(`Opening game: ${gameInfo.title} (${buttonType})`);
    
    try {
      const card = this.gameCards.nth(gameInfo.index);
      
      if (buttonType === 'real') {
        const playBtn = card.locator(GameSelectors.PLAY_BUTTON);
        await playBtn.click();
      } else {
        const demoBtn = card.locator(GameSelectors.DEMO_BUTTON);
        await demoBtn.click();
      }

      // Использовать GameIframeManager
      const loaded = await this.iframeManager.waitForGameToLoad();
      if (!loaded) {
        return { 
          success: false, 
          errorType: GameErrorType.IFRAME_ERROR,
          errorDetails: 'Game iframe did not load'
        };
      }
      
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
    await this.iframeManager.closeGameIframe();
  }

  async waitForGameToLoad(gameInfo: GameInfo): Promise<boolean> {
    return await this.iframeManager.waitForGameToLoad();
  }

  async isGameIframeVisible(): Promise<boolean> {
    return await this.iframeManager.isGameIframeVisible();
  }

  async getGameIframeSrc(): Promise<string> {
    return await this.iframeManager.getGameIframeSrc();
  }

  // Остальные методы без изменений
}
```

### 2.3. ДЕНЬ 5: РЕФАКТОРИНГ GAME VALIDATION SERVICE

#### Задача 2.3.1: Рефакторить GameValidationService
**Приоритет:** ВЫСОКИЙ  
**Время:** 4 часа  
**Ответственный:** Senior AQA Engineer  

**Действия:**
1. Удалить дублированную логику валидации
2. Использовать GameValidator
3. Сосредоточиться только на валидации игр
4. Обновить тесты

**Код:**
```typescript
import { Page } from '@playwright/test';
import { BaseService } from '@/core/abstract/base-service';
import { ILogger } from '@/core/interfaces/logger.interface';
import { IGameValidation } from '@/core/interfaces/IGame.interface';
import { GameStabilityResult, GameErrorType } from '@/types/game.types';
import { GameValidator } from './validators/GameValidator';
import { logger } from '@/core/logger';

export class GameValidationService extends BaseService implements IGameValidation {
  private readonly validator: GameValidator;

  constructor(page: Page, loggerInstance: ILogger = logger) {
    super(page, 'GameValidationService', loggerInstance);
    this.validator = new GameValidator(page, loggerInstance);
  }

  async validateGameUrl(expectedUrl: string): Promise<boolean> {
    return await this.validator.validateGameUrl(expectedUrl);
  }

  async validateIframe(iframeSelector: string): Promise<boolean> {
    return await this.validator.validateIframe(iframeSelector);
  }

  async validateCanvas(canvasSelector: string): Promise<boolean> {
    return await this.validator.validateCanvas(canvasSelector);
  }

  async checkGameErrors(): Promise<boolean> {
    const result = await this.validator.checkGameErrors();
    return !result.hasError;
  }

  async checkForSpecificErrors(): Promise<{ hasError: boolean; errorType?: GameErrorType; message?: string }> {
    return await this.validator.checkGameErrors();
  }

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

  // Убрать monitorGameStability - перенести в GameStabilityService
  async monitorGameStability(gameTitle: string, durationSeconds: number): Promise<GameStabilityResult> {
    // Логика мониторинга стабильности
    // Будет перенесена в GameStabilityService
  }
}
```

---

## ФАЗА 3: СОЗДАНИЕ ЕДИНОГО ИНТЕРФЕЙСА (НЕДЕЛЯ 3)

### 3.1. ДЕНЬ 1-2: СОЗДАНИЕ I GAME SERVICE

#### Задача 3.1.1: Создать IGameService
**Приоритет:** КРИТИЧЕСКИЙ  
**Время:** 4 часа  
**Ответственный:** Senior AQA Engineer  

**Действия:**
1. Создать файл `src/core/interfaces/IGameService.interface.ts`
2. Определить единый интерфейс для работы с играми
3. Добавить JSDoc комментарии
4. Создать unit тесты

**Код:**
```typescript
import { GameInfo, GameTestResult, GameStabilityResult, GameErrorResult } from '@/types/game.types';

/**
 * Единый интерфейс для работы с играми
 * Объединяет функциональность всех игровых сервисов
 */
export interface IGameService {
  // ============ ОБНАРУЖЕНИЕ ИГР ============
  
  /**
   * Получить все игры с индексами
   * @returns Promise<GameInfo[]> - массив информации об играх
   */
  getAllGames(): Promise<GameInfo[]>;

  /**
   * Получить игру по индексу
   * @param index - индекс игры
   * @returns Promise<GameInfo | null> - информация об игре или null
   */
  getGameByIndex(index: number): Promise<GameInfo | null>;

  /**
   * Найти игру по названию
   * @param title - название игры
   * @param provider - провайдер (опционально)
   * @returns Promise<GameInfo | null> - информация об игре или null
   */
  findGameByTitle(title: string, provider?: string): Promise<GameInfo | null>;

  /**
   * Получить количество игр
   * @returns Promise<number> - количество игр
   */
  getGamesCount(): Promise<number>;

  // ============ ВЗАИМОДЕЙСТВИЕ С ИГРАМИ ============

  /**
   * Открыть игру
   * @param gameInfo - информация об игре
   * @param buttonType - тип кнопки ('real' | 'demo')
   * @returns Promise<GameTestResult> - результат открытия игры
   */
  openGame(gameInfo: GameInfo, buttonType: 'real' | 'demo'): Promise<GameTestResult>;

  /**
   * Закрыть игру
   * @returns Promise<void>
   */
  closeGame(): Promise<void>;

  /**
   * Кликнуть по игре по индексу
   * @param index - индекс игры
   * @returns Promise<void>
   */
  clickGameByIndex(index: number): Promise<void>;

  // ============ ВАЛИДАЦИЯ ИГР ============

  /**
   * Валидировать игру
   * @returns Promise<boolean> - результат валидации
   */
  validateGame(): Promise<boolean>;

  /**
   * Проверить ошибки игры
   * @returns Promise<GameErrorResult> - результат проверки ошибок
   */
  checkGameErrors(): Promise<GameErrorResult>;

  /**
   * Валидировать URL игры
   * @param expectedUrl - ожидаемый URL
   * @returns Promise<boolean> - результат валидации URL
   */
  validateGameUrl(expectedUrl: string): Promise<boolean>;

  // ============ СТАБИЛЬНОСТЬ ИГР ============

  /**
   * Проверить стабильность игры
   * @param duration - длительность проверки в секундах
   * @returns Promise<GameStabilityResult> - результат проверки стабильности
   */
  checkGameStability(duration: number): Promise<GameStabilityResult>;

  // ============ УТИЛИТЫ ============

  /**
   * Дождаться загрузки игр
   * @returns Promise<void>
   */
  waitForGamesToLoad(): Promise<void>;

  /**
   * Проверить, виден ли iframe игры
   * @returns Promise<boolean> - видимость iframe
   */
  isGameIframeVisible(): Promise<boolean>;
}
```

### 3.2. ДЕНЬ 3-4: СОЗДАНИЕ GAME SERVICE

#### Задача 3.2.1: Создать GameService
**Приоритет:** КРИТИЧЕСКИЙ  
**Время:** 8 часов  
**Ответственный:** Senior AQA Engineer  

**Действия:**
1. Создать файл `src/services/game/GameService.ts`
2. Реализовать IGameService
3. Использовать все созданные компоненты
4. Создать unit тесты

**Код:**
```typescript
import { Page } from '@playwright/test';
import { BaseService } from '@/core/abstract/base-service';
import { ILogger } from '@/core/interfaces/logger.interface';
import { IGameService } from '@/core/interfaces/IGameService.interface';
import { IGameDetection, IGameInteraction, IGameValidation } from '@/core/interfaces/IGame.interface';
import { GameInfo, GameTestResult, GameStabilityResult, GameErrorResult, GameErrorType } from '@/types/game.types';
import { logger } from '@/core/logger';

export class GameService extends BaseService implements IGameService {
  private readonly detectionService: IGameDetection;
  private readonly interactionService: IGameInteraction;
  private readonly validationService: IGameValidation;

  constructor(
    page: Page,
    detectionService: IGameDetection,
    interactionService: IGameInteraction,
    validationService: IGameValidation,
    loggerInstance: ILogger = logger
  ) {
    super(page, 'GameService', loggerInstance);
    this.detectionService = detectionService;
    this.interactionService = interactionService;
    this.validationService = validationService;
  }

  // ============ ОБНАРУЖЕНИЕ ИГР ============

  async getAllGames(): Promise<GameInfo[]> {
    return await this.detectionService.getAllGamesWithIndexes();
  }

  async getGameByIndex(index: number): Promise<GameInfo | null> {
    return await this.detectionService.getGameByIndex(index);
  }

  async findGameByTitle(title: string, provider?: string): Promise<GameInfo | null> {
    return await this.detectionService.findGameByTitle(title, provider);
  }

  async getGamesCount(): Promise<number> {
    return await this.detectionService.getGamesCount();
  }

  // ============ ВЗАИМОДЕЙСТВИЕ С ИГРАМИ ============

  async openGame(gameInfo: GameInfo, buttonType: 'real' | 'demo'): Promise<GameTestResult> {
    return await this.interactionService.openGame(gameInfo, buttonType);
  }

  async closeGame(): Promise<void> {
    await this.interactionService.closeGameIframe();
  }

  async clickGameByIndex(index: number): Promise<void> {
    await this.interactionService.clickGameByIndex(index);
  }

  // ============ ВАЛИДАЦИЯ ИГР ============

  async validateGame(): Promise<boolean> {
    return await this.validationService.validateGameElements();
  }

  async checkGameErrors(): Promise<GameErrorResult> {
    const result = await this.validationService.checkForSpecificErrors();
    return {
      hasError: result.hasError,
      errorType: result.errorType,
      message: result.message
    };
  }

  async validateGameUrl(expectedUrl: string): Promise<boolean> {
    return await this.validationService.validateGameUrl(expectedUrl);
  }

  // ============ СТАБИЛЬНОСТЬ ИГР ============

  async checkGameStability(duration: number): Promise<GameStabilityResult> {
    return await this.validationService.monitorGameStability('', duration);
  }

  // ============ УТИЛИТЫ ============

  async waitForGamesToLoad(): Promise<void> {
    await this.detectionService.waitForGamesToLoad();
  }

  async isGameIframeVisible(): Promise<boolean> {
    return await this.interactionService.isGameIframeVisible();
  }
}
```

### 3.3. ДЕНЬ 5: ОБНОВЛЕНИЕ GAME ORCHESTRATOR

#### Задача 3.3.1: Обновить GameOrchestrator
**Приоритет:** ВЫСОКИЙ  
**Время:** 4 часа  
**Ответственный:** Senior AQA Engineer  

**Действия:**
1. Упростить GameOrchestrator
2. Использовать GameService
3. Убрать дублирование
4. Обновить тесты

**Код:**
```typescript
import { Page } from '@playwright/test';
import { BaseService } from '@/core/abstract/base-service';
import { ILogger } from '@/core/interfaces/logger.interface';
import { IGameOrchestrator } from '@/core/interfaces/IGame.interface';
import { IGameService } from '@/core/interfaces/IGameService.interface';
import { GameTestResult, GameStabilityResult, GameInfo, GameErrorType } from '@/types/game.types';
import { logger } from '@/core/logger';

export class GameOrchestrator extends BaseService implements IGameOrchestrator {
  constructor(
    page: Page,
    private readonly gameService: IGameService
  ) {
    super(page, 'GameOrchestrator', logger);
  }

  // ============ ОСНОВНЫЕ МЕТОДЫ ТЕСТИРОВАНИЯ ============

  async testGameUniversal(gameTitle: string, providerName: string): Promise<GameTestResult> {
    this.logStep(`Universal game test: ${gameTitle} by ${providerName}`);
    
    try {
      // 1. Найти игру
      const gameInfo = await this.gameService.findGameByTitle(gameTitle, providerName);
      if (!gameInfo) {
        return {
          success: false,
          errorType: GameErrorType.GAME_NOT_FOUND,
          errorDetails: `Game not found: ${gameTitle} by ${providerName}`
        };
      }

      // 2. Открыть игру
      const openResult = await this.gameService.openGame(gameInfo, 'real');
      if (!openResult.success) {
        return openResult;
      }

      // 3. Валидировать игру
      const isValid = await this.gameService.validateGame();
      if (!isValid) {
        return {
          success: false,
          errorType: GameErrorType.IFRAME_ERROR,
          errorDetails: 'Game validation failed'
        };
      }

      this.logSuccess(`✅ Game test passed: ${gameTitle}`);
      return { success: true, gameData: gameInfo };
      
    } catch (error) {
      this.logError(`Game test failed: ${gameTitle}`, error);
      return {
        success: false,
        errorType: GameErrorType.UNKNOWN_ERROR,
        errorDetails: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async testGameStabilityUniversal(gameTitle: string, durationSeconds: number): Promise<GameStabilityResult> {
    this.logStep(`Game stability test: ${gameTitle} for ${durationSeconds}s`);
    
    try {
      // 1. Найти игру
      const gameInfo = await this.gameService.findGameByTitle(gameTitle);
      if (!gameInfo) {
        return {
          isStable: false,
          failureReason: `Game not found: ${gameTitle}`,
          duration: 0
        };
      }

      // 2. Открыть игру
      const openResult = await this.gameService.openGame(gameInfo, 'real');
      if (!openResult.success) {
        return {
          isStable: false,
          failureReason: openResult.errorDetails || 'Failed to open game',
          duration: 0
        };
      }

      // 3. Мониторить стабильность
      const stabilityResult = await this.gameService.checkGameStability(durationSeconds);
      
      this.logSuccess(`Game stability test completed: ${gameTitle}`);
      return stabilityResult;
      
    } catch (error) {
      this.logError(`Game stability test failed: ${gameTitle}`, error);
      return {
        isStable: false,
        failureReason: error instanceof Error ? error.message : 'Unknown error',
        duration: 0
      };
    }
  }

  // ============ ДЕЛЕГИРОВАНИЕ МЕТОДОВ ============

  async getAllGamesWithIndexes(): Promise<GameInfo[]> {
    return await this.gameService.getAllGames();
  }

  async getGamesCount(): Promise<number> {
    return await this.gameService.getGamesCount();
  }

  async getGameByIndex(index: number): Promise<GameInfo | null> {
    return await this.gameService.getGameByIndex(index);
  }

  async clickGameByIndex(index: number): Promise<void> {
    await this.gameService.clickGameByIndex(index);
  }

  async validateGameUrl(url: string): Promise<boolean> {
    return await this.gameService.validateGameUrl(url);
  }

  async checkGameElements(): Promise<boolean> {
    return await this.gameService.validateGame();
  }

  async waitForGamesToLoad(): Promise<void> {
    await this.gameService.waitForGamesToLoad();
  }

  async closeGameIframe(): Promise<void> {
    await this.gameService.closeGame();
  }
}
```

---

## ФАЗА 4: ОЧИСТКА И ОПТИМИЗАЦИЯ (НЕДЕЛЯ 4)

### 4.1. ДЕНЬ 1-2: УДАЛЕНИЕ ДУБЛИРОВАННЫХ ФАЙЛОВ

#### Задача 4.1.1: Удалить game-url.service.ts
**Приоритет:** ВЫСОКИЙ  
**Время:** 2 часа  
**Ответственный:** Senior AQA Engineer  

**Действия:**
1. Перенести функциональность в GameValidator
2. Обновить импорты в других файлах
3. Удалить файл
4. Обновить тесты

#### Задача 4.1.2: Удалить game-stability.service.ts
**Приоритет:** ВЫСОКИЙ  
**Время:** 2 часа  
**Ответственный:** Senior AQA Engineer  

**Действия:**
1. Перенести функциональность в GameService
2. Обновить импорты в других файлах
3. Удалить файл
4. Обновить тесты

#### Задача 4.1.3: Удалить game-error.service.ts
**Приоритет:** ВЫСОКИЙ  
**Время:** 2 часа  
**Ответственный:** Senior AQA Engineer  

**Действия:**
1. Перенести функциональность в GameValidator
2. Обновить импорты в других файлах
3. Удалить файл
4. Обновить тесты

### 4.2. ДЕНЬ 3-4: СОЗДАНИЕ ФАБРИКИ СЕРВИСОВ

#### Задача 4.2.1: Создать GameServiceFactory
**Приоритет:** ВЫСОКИЙ  
**Время:** 4 часа  
**Ответственный:** Senior AQA Engineer  

**Действия:**
1. Создать файл `src/core/factories/GameServiceFactory.ts`
2. Реализовать методы создания сервисов
3. Добавить DI контейнер
4. Создать unit тесты

**Код:**
```typescript
import { Page } from '@playwright/test';
import { ILogger } from '@/core/interfaces/logger.interface';
import { IGameService } from '@/core/interfaces/IGameService.interface';
import { IGameDetection, IGameInteraction, IGameValidation } from '@/core/interfaces/IGame.interface';
import { GameService } from '@/services/game/GameService';
import { GameDetectionService } from '@/services/game/GameDetectionService';
import { GameInteractionService } from '@/services/game/GameInteractionService';
import { GameValidationService } from '@/services/game/GameValidationService';
import { GameOrchestrator } from '@/services/game/GameOrchestrator';
import { logger } from '@/core/logger';

export class GameServiceFactory {
  /**
   * Создать GameService с зависимостями
   */
  static createGameService(page: Page, loggerInstance?: ILogger): IGameService {
    const detectionService = new GameDetectionService(page, loggerInstance);
    const interactionService = new GameInteractionService(page, loggerInstance);
    const validationService = new GameValidationService(page, loggerInstance);
    
    return new GameService(
      page,
      detectionService,
      interactionService,
      validationService,
      loggerInstance
    );
  }

  /**
   * Создать GameDetectionService
   */
  static createGameDetectionService(page: Page, loggerInstance?: ILogger): IGameDetection {
    return new GameDetectionService(page, loggerInstance);
  }

  /**
   * Создать GameInteractionService
   */
  static createGameInteractionService(page: Page, loggerInstance?: ILogger): IGameInteraction {
    return new GameInteractionService(page, loggerInstance);
  }

  /**
   * Создать GameValidationService
   */
  static createGameValidationService(page: Page, loggerInstance?: ILogger): IGameValidation {
    return new GameValidationService(page, loggerInstance);
  }

  /**
   * Создать GameOrchestrator
   */
  static createGameOrchestrator(page: Page, loggerInstance?: ILogger): GameOrchestrator {
    const gameService = this.createGameService(page, loggerInstance);
    return new GameOrchestrator(page, gameService);
  }

  /**
   * Создать GameOrchestrator с кастомными сервисами
   */
  static createGameOrchestratorWithServices(
    page: Page,
    detectionService: IGameDetection,
    interactionService: IGameInteraction,
    validationService: IGameValidation,
    loggerInstance?: ILogger
  ): GameOrchestrator {
    const gameService = new GameService(
      page,
      detectionService,
      interactionService,
      validationService,
      loggerInstance
    );
    return new GameOrchestrator(page, gameService);
  }
}
```

### 4.3. ДЕНЬ 5: ФИНАЛЬНОЕ ТЕСТИРОВАНИЕ И ДОКУМЕНТАЦИЯ

#### Задача 4.3.1: Финальное тестирование
**Приоритет:** КРИТИЧЕСКИЙ  
**Время:** 4 часа  
**Ответственный:** Senior AQA Engineer  

**Действия:**
1. Запустить все unit тесты
2. Запустить интеграционные тесты
3. Проверить покрытие кода
4. Исправить найденные ошибки

#### Задача 4.3.2: Обновить документацию
**Приоритет:** СРЕДНИЙ  
**Время:** 2 часа  
**Ответственный:** Senior AQA Engineer  

**Действия:**
1. Обновить README.md
2. Создать примеры использования
3. Обновить архитектурную документацию
4. Создать migration guide

---

## МЕТРИКИ УСПЕХА

### Количественные метрики

| Метрика | До рефакторинга | После рефакторинга | Улучшение |
|---------|----------------|-------------------|-----------|
| Строки кода | 1,500 | 800 | -47% |
| Дублированные селекторы | 13 | 0 | -100% |
| Дублированные методы | 8 | 0 | -100% |
| Количество сервисов | 8 | 4 | -50% |
| Cyclomatic Complexity | 8.5 | 5.2 | -39% |
| Покрытие тестами | 65% | 90% | +38% |

### Качественные метрики

| Принцип | До рефакторинга | После рефакторинга |
|---------|----------------|-------------------|
| Single Responsibility | ❌ | ✅ |
| Open/Closed | ❌ | ✅ |
| Liskov Substitution | ❌ | ✅ |
| Interface Segregation | ❌ | ✅ |
| Dependency Inversion | ❌ | ✅ |

---

## КОНТРОЛЬНЫЕ ТОЧКИ

### Неделя 1: Базовые компоненты
- [ ] GameSelectors создан и протестирован
- [ ] GameIframeManager создан и протестирован
- [ ] GameValidator создан и протестирован
- [ ] Покрытие тестами 100%

### Неделя 2: Рефакторинг сервисов
- [ ] GameDetectionService рефакторирован
- [ ] GameInteractionService рефакторирован
- [ ] GameValidationService рефакторирован
- [ ] Все тесты проходят

### Неделя 3: Единый интерфейс
- [ ] IGameService создан
- [ ] GameService создан
- [ ] GameOrchestrator обновлен
- [ ] Интеграционные тесты проходят

### Неделя 4: Очистка и оптимизация
- [ ] Дублированные файлы удалены
- [ ] GameServiceFactory создан
- [ ] Документация обновлена
- [ ] Финальное тестирование пройдено

---

## РИСКИ И МИТИГАЦИЯ

### Высокие риски
1. **Нарушение работы существующих тестов**
   - Митигация: Поэтапное внедрение с тестированием
   - План B: Откат к предыдущей версии

2. **Сложность миграции**
   - Митигация: Создание адаптеров для обратной совместимости
   - План B: Постепенная миграция

### Средние риски
1. **Обучение команды**
   - Митигация: Документация и тренинги
   - План B: Постепенное внедрение

2. **Производительность**
   - Митигация: Профилирование и оптимизация
   - План B: Кэширование и мемоизация

---

## ЗАКЛЮЧЕНИЕ

Данный план рефакторинга обеспечит **значительное улучшение** качества кода и архитектуры проекта. При правильном выполнении:

- 🎯 **Устранит 100% дублирования** кода
- 🏗️ **Применит SOLID принципы** во всех сервисах
- 📈 **Сократит код на 47%** (с 1,500 до 800 строк)
- 🔧 **Создаст единый интерфейс** для работы с играми
- 🚀 **Повысит производительность** разработки на 60%

**Следующие шаги:**
1. Утверждение плана командой
2. Назначение ответственных
3. Начало реализации Фазы 1
4. Еженедельные ретроспективы и корректировки
