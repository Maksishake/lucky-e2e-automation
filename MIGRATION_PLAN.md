# 🚀 ПЛАН МИГРАЦИИ И ЧЕКЛИСТЫ

## 📅 **КАЛЕНДАРНЫЙ ПЛАН (4 НЕДЕЛИ)**

### **НЕДЕЛЯ 1: ПОДГОТОВКА И АБСТРАКЦИИ**
**Дни 1-2: Создание интерфейсов и типов**
- [ ] Создать `src/core/interfaces/game.interface.ts`
- [ ] Создать `src/types/game.types.ts`
- [ ] Создать `src/enums/game.enums.ts`
- [ ] Написать unit-тесты для интерфейсов

**Дни 3-5: Создание базовых классов**
- [ ] Создать `src/core/abstract/game-selector.abstract.ts`
- [ ] Создать `src/core/abstract/game-service.abstract.ts`
- [ ] Создать `src/core/abstract/game-component.abstract.ts`
- [ ] Написать unit-тесты для базовых классов

### **НЕДЕЛЯ 2: РЕФАКТОРИНГ СЕРВИСОВ**
**Дни 6-8: Рефакторинг GameDetectionService**
- [ ] Создать `src/core/selectors/game-card.selector.ts`
- [ ] Рефакторить `src/services/game/game-detection.service.ts`
- [ ] Удалить дублированные селекторы
- [ ] Написать unit-тесты

**Дни 9-10: Рефакторинг GameInteractionService**
- [ ] Рефакторить `src/services/game/game-interaction.service.ts`
- [ ] Удалить дублированные методы
- [ ] Написать unit-тесты

### **НЕДЕЛЯ 3: РЕФАКТОРИНГ КОМПОНЕНТОВ**
**Дни 11-13: Рефакторинг GameCardComponent**
- [ ] Рефакторить `src/components/games/game-card.component.ts`
- [ ] Удалить дублированные селекторы
- [ ] Написать unit-тесты

**Дни 14-15: Рефакторинг GameGridComponent**
- [ ] Рефакторить `src/components/games/game-grid.component.ts`
- [ ] Удалить дублированные методы
- [ ] Написать unit-тесты

### **НЕДЕЛЯ 4: ФИНАЛИЗАЦИЯ И ТЕСТИРОВАНИЕ**
**Дни 16-18: Создание оркестратора и фабрик**
- [ ] Рефакторить `src/services/game/game.service.ts`
- [ ] Создать `src/core/factories/game-service.factory.ts`
- [ ] Создать `src/core/container/game-container.ts`
- [ ] Написать unit-тесты

**Дни 19-20: Миграция тестов**
- [ ] Обновить `tests/smoke/game-stability.spec.ts`
- [ ] Обновить `tests/unit/game.spec.ts`
- [ ] Запустить все тесты
- [ ] Исправить ошибки

## 📋 **ДЕТАЛЬНЫЕ ЧЕКЛИСТЫ**

### **ЧЕКЛИСТ 1: СОЗДАНИЕ ИНТЕРФЕЙСОВ**

#### ✅ **Создание базовых интерфейсов**
```typescript
// src/core/interfaces/game.interface.ts
export interface IGameSelector {
  getGameCard(): Locator;
  getGameTitle(): Locator;
  getGameProvider(): Locator;
  getFavoriteButton(): Locator;
  getRealButton(): Locator;
  getDemoButton(): Locator;
}

export interface IGameDetection {
  findGame(title: string): Promise<boolean>;
  getGameByIndex(index: number): Promise<GameInfo | null>;
  getAllGames(): Promise<GameInfo[]>;
  getGamesCount(): Promise<number>;
}

export interface IGameInteraction {
  clickGame(title: string): Promise<boolean>;
  clickGameByIndex(index: number): Promise<boolean>;
  clickGameButton(title: string, buttonType: GameButtonType): Promise<boolean>;
}

export interface IGameValidation {
  validateGameStability(gameTitle: string, duration: number): Promise<boolean>;
  checkForErrors(gameTitle: string): Promise<GameError | null>;
}
```

#### ✅ **Создание типов и енумов**
```typescript
// src/types/game.types.ts
export enum GameButtonType {
  REAL = 'real',
  DEMO = 'demo',
  FAVORITE = 'favorite'
}

export enum GameErrorType {
  NOT_FOUND = 'not_found',
  INTERACTION_FAILED = 'interaction_failed',
  UNSTABLE = 'unstable',
  BROWSER_BLOCKING = 'browser_blocking',
  IP_BLOCKING = 'ip_blocking',
  SERVER_ERROR = 'server_error',
  CURRENCY_RESTRICTION = 'currency_restriction'
}

export interface GameInfo {
  index: number;
  title: string;
  provider: string;
  locator: Locator;
}

export interface GameError {
  type: GameErrorType;
  message: string;
  details?: string;
}

export interface GameResult {
  success: boolean;
  error?: GameError;
  gameInfo?: GameInfo;
}
```

### **ЧЕКЛИСТ 2: СОЗДАНИЕ БАЗОВЫХ КЛАССОВ**

#### ✅ **Абстрактный базовый селектор**
```typescript
// src/core/abstract/game-selector.abstract.ts
export abstract class GameSelectorAbstract implements IGameSelector {
  protected page: Page;
  protected componentName: string;

  constructor(page: Page, componentName: string) {
    this.page = page;
    this.componentName = componentName;
  }

  abstract getGameCard(): Locator;
  abstract getGameTitle(): Locator;
  abstract getGameProvider(): Locator;
  abstract getFavoriteButton(): Locator;
  abstract getRealButton(): Locator;
  abstract getDemoButton(): Locator;
}
```

#### ✅ **Конкретная реализация селектора**
```typescript
// src/core/selectors/game-card.selector.ts
export class GameCardSelector extends GameSelectorAbstract {
  getGameCard(): Locator {
    return this.page.locator('.game-card');
  }

  getGameTitle(): Locator {
    return this.page.locator('.game-card .title');
  }

  getGameProvider(): Locator {
    return this.page.locator('.game-card .provider');
  }

  getFavoriteButton(): Locator {
    return this.page.locator('.game-card .favorite-btn');
  }

  getRealButton(): Locator {
    return this.page.locator('.game-card .btn-default');
  }

  getDemoButton(): Locator {
    return this.page.locator('.game-card .btn-secondary');
  }
}
```

#### ✅ **Абстрактный базовый сервис**
```typescript
// src/core/abstract/game-service.abstract.ts
export abstract class GameServiceAbstract {
  protected page: Page;
  protected selector: IGameSelector;
  protected logger: ILogger;

  constructor(page: Page, selector: IGameSelector, logger: ILogger) {
    this.page = page;
    this.selector = selector;
    this.logger = logger;
  }

  protected async waitForElement(locator: Locator, timeout: number = 5000): Promise<boolean> {
    try {
      await locator.waitFor({ timeout });
      return true;
    } catch {
      return false;
    }
  }

  protected async safeClick(locator: Locator): Promise<boolean> {
    try {
      await locator.click();
      return true;
    } catch (error) {
      this.logger.error(`Failed to click element: ${error}`);
      return false;
    }
  }
}
```

### **ЧЕКЛИСТ 3: РЕФАКТОРИНГ СЕРВИСОВ**

#### ✅ **GameDetectionService - рефакторинг**
```typescript
// src/services/game/game-detection.service.ts
export class GameDetectionService extends GameServiceAbstract implements IGameDetection {
  constructor(page: Page, selector: IGameSelector, logger: ILogger) {
    super(page, selector, logger);
  }

  async findGame(title: string): Promise<boolean> {
    this.logger.info(`Searching for game: ${title}`);
    
    const gameCard = this.selector.getGameCard().filter({ hasText: title });
    return await this.waitForElement(gameCard);
  }

  async getGameByIndex(index: number): Promise<GameInfo | null> {
    this.logger.info(`Getting game by index: ${index}`);
    
    const gameCard = this.selector.getGameCard().nth(index);
    if (await this.waitForElement(gameCard)) {
      const title = await this.selector.getGameTitle().nth(index).textContent();
      const provider = await this.selector.getGameProvider().nth(index).textContent();
      
      return {
        index,
        title: title || '',
        provider: provider || '',
        locator: gameCard
      };
    }
    
    return null;
  }

  async getAllGames(): Promise<GameInfo[]> {
    this.logger.info('Getting all games');
    
    const games: GameInfo[] = [];
    const gameCards = this.selector.getGameCard();
    const count = await gameCards.count();
    
    for (let i = 0; i < count; i++) {
      const game = await this.getGameByIndex(i);
      if (game) games.push(game);
    }
    
    return games;
  }

  async getGamesCount(): Promise<number> {
    const gameCards = this.selector.getGameCard();
    return await gameCards.count();
  }
}
```

#### ✅ **GameInteractionService - рефакторинг**
```typescript
// src/services/game/game-interaction.service.ts
export class GameInteractionService extends GameServiceAbstract implements IGameInteraction {
  constructor(page: Page, selector: IGameSelector, logger: ILogger) {
    super(page, selector, logger);
  }

  async clickGame(title: string): Promise<boolean> {
    this.logger.info(`Clicking game: ${title}`);
    
    const gameCard = this.selector.getGameCard().filter({ hasText: title });
    return await this.safeClick(gameCard);
  }

  async clickGameByIndex(index: number): Promise<boolean> {
    this.logger.info(`Clicking game by index: ${index}`);
    
    const gameCard = this.selector.getGameCard().nth(index);
    return await this.safeClick(gameCard);
  }

  async clickGameButton(title: string, buttonType: GameButtonType): Promise<boolean> {
    this.logger.info(`Clicking ${buttonType} button for game: ${title}`);
    
    const gameCard = this.selector.getGameCard().filter({ hasText: title });
    let button: Locator;
    
    switch (buttonType) {
      case GameButtonType.REAL:
        button = this.selector.getRealButton();
        break;
      case GameButtonType.DEMO:
        button = this.selector.getDemoButton();
        break;
      case GameButtonType.FAVORITE:
        button = this.selector.getFavoriteButton();
        break;
      default:
        this.logger.error(`Unknown button type: ${buttonType}`);
        return false;
    }
    
    return await this.safeClick(button);
  }
}
```

### **ЧЕКЛИСТ 4: РЕФАКТОРИНГ КОМПОНЕНТОВ**

#### ✅ **GameCardComponent - рефакторинг**
```typescript
// src/components/games/game-card.component.ts
export class GameCardComponent extends BaseComponent {
  private selector: IGameSelector;
  private interaction: IGameInteraction;

  constructor(page: Page, selector: IGameSelector, interaction: IGameInteraction) {
    super(page, 'GameCard', '.game-card');
    this.selector = selector;
    this.interaction = interaction;
  }

  async getGameInfo(): Promise<GameInfo | null> {
    const title = await this.selector.getGameTitle().textContent();
    const provider = await this.selector.getGameProvider().textContent();
    
    if (!title || !provider) {
      return null;
    }
    
    return {
      index: 0,
      title,
      provider,
      locator: this.selector.getGameCard()
    };
  }

  async clickRealButton(): Promise<boolean> {
    return await this.interaction.clickGameButton('', GameButtonType.REAL);
  }

  async clickDemoButton(): Promise<boolean> {
    return await this.interaction.clickGameButton('', GameButtonType.DEMO);
  }

  async addToFavorites(): Promise<boolean> {
    return await this.interaction.clickGameButton('', GameButtonType.FAVORITE);
  }
}
```

#### ✅ **GameGridComponent - рефакторинг**
```typescript
// src/components/games/game-grid.component.ts
export class GameGridComponent extends BaseComponent {
  private detection: IGameDetection;
  private interaction: IGameInteraction;

  constructor(page: Page, detection: IGameDetection, interaction: IGameInteraction) {
    super(page, 'GameGrid', '.game-cards-vertical');
    this.detection = detection;
    this.interaction = interaction;
  }

  async getAllGames(): Promise<GameInfo[]> {
    return await this.detection.getAllGames();
  }

  async getGamesCount(): Promise<number> {
    return await this.detection.getGamesCount();
  }

  async findGameByTitle(title: string): Promise<GameInfo | null> {
    const games = await this.detection.getAllGames();
    return games.find(game => game.title.includes(title)) || null;
  }

  async clickRandomGame(): Promise<boolean> {
    const games = await this.detection.getAllGames();
    if (games.length === 0) return false;
    
    const randomIndex = Math.floor(Math.random() * games.length);
    return await this.interaction.clickGameByIndex(randomIndex);
  }
}
```

### **ЧЕКЛИСТ 5: СОЗДАНИЕ ОРКЕСТРАТОРА**

#### ✅ **GameService - новый оркестратор**
```typescript
// src/services/game/game.service.ts
export class GameService {
  private detection: IGameDetection;
  private interaction: IGameInteraction;
  private validation: IGameValidation;
  private logger: ILogger;

  constructor(
    detection: IGameDetection,
    interaction: IGameInteraction,
    validation: IGameValidation,
    logger: ILogger
  ) {
    this.detection = detection;
    this.interaction = interaction;
    this.validation = validation;
    this.logger = logger;
  }

  async findGame(title: string): Promise<boolean> {
    return await this.detection.findGame(title);
  }

  async clickGame(title: string): Promise<boolean> {
    return await this.interaction.clickGame(title);
  }

  async validateGameStability(gameTitle: string, duration: number): Promise<boolean> {
    return await this.validation.validateGameStability(gameTitle, duration);
  }

  async openGameWithValidation(gameTitle: string, duration: number = 15): Promise<GameResult> {
    this.logger.info(`Opening game with validation: ${gameTitle}`);
    
    const found = await this.detection.findGame(gameTitle);
    if (!found) {
      return { success: false, error: { type: GameErrorType.NOT_FOUND, message: 'Game not found' } };
    }
    
    const clicked = await this.interaction.clickGame(gameTitle);
    if (!clicked) {
      return { success: false, error: { type: GameErrorType.INTERACTION_FAILED, message: 'Failed to click game' } };
    }
    
    const error = await this.validation.checkForErrors(gameTitle);
    if (error) {
      return { success: false, error };
    }
    
    const stable = await this.validation.validateGameStability(gameTitle, duration);
    if (!stable) {
      return { success: false, error: { type: GameErrorType.UNSTABLE, message: 'Game not stable' } };
    }
    
    return { success: true };
  }
}
```

### **ЧЕКЛИСТ 6: СОЗДАНИЕ ФАБРИК**

#### ✅ **GameServiceFactory**
```typescript
// src/core/factories/game-service.factory.ts
export class GameServiceFactory {
  static createGameService(page: Page): GameService {
    const selector = new GameCardSelector(page);
    const logger = new ConsoleLogger();
    
    const detection = new GameDetectionService(page, selector, logger);
    const interaction = new GameInteractionService(page, selector, logger);
    const validation = new GameValidationService(page, selector, logger);
    
    return new GameService(detection, interaction, validation, logger);
  }
  
  static createGameCardComponent(page: Page): GameCardComponent {
    const selector = new GameCardSelector(page);
    const interaction = new GameInteractionService(page, selector, new ConsoleLogger());
    
    return new GameCardComponent(page, selector, interaction);
  }
  
  static createGameGridComponent(page: Page): GameGridComponent {
    const selector = new GameCardSelector(page);
    const logger = new ConsoleLogger();
    
    const detection = new GameDetectionService(page, selector, logger);
    const interaction = new GameInteractionService(page, selector, logger);
    
    return new GameGridComponent(page, detection, interaction);
  }
}
```

### **ЧЕКЛИСТ 7: МИГРАЦИЯ ТЕСТОВ**

#### ✅ **Обновление тестов**
```typescript
// tests/smoke/game-stability.spec.ts
import { GameServiceFactory } from '@/core/factories/game-service.factory';

test.describe('Game Stability Tests', () => {
  let gameService: GameService;
  
  test.beforeEach(async ({ page }) => {
    gameService = GameServiceFactory.createGameService(page);
  });
  
  test('should open Book of Dead and check stability', async () => {
    const result = await gameService.openGameWithValidation('Book of Dead', 15);
    
    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
  });
  
  test('should handle game errors gracefully', async () => {
    const result = await gameService.openGameWithValidation('NonExistentGame', 15);
    
    expect(result.success).toBe(false);
    expect(result.error?.type).toBe(GameErrorType.NOT_FOUND);
  });
});
```

## 🧪 **ТЕСТИРОВАНИЕ И ВАЛИДАЦИЯ**

### **Unit тесты**
- [ ] Тесты для всех интерфейсов
- [ ] Тесты для всех базовых классов
- [ ] Тесты для всех сервисов
- [ ] Тесты для всех компонентов
- [ ] Тесты для фабрик

### **Integration тесты**
- [ ] Тесты взаимодействия между сервисами
- [ ] Тесты работы фабрик
- [ ] Тесты миграции данных

### **E2E тесты**
- [ ] Тесты стабильности игр
- [ ] Тесты обработки ошибок
- [ ] Тесты производительности

## 📊 **МЕТРИКИ УСПЕХА**

### **Количественные метрики**
- [ ] Строк кода: -40% (с 2000+ до 1200+)
- [ ] Дублирование: -85% (с 30% до 5%)
- [ ] Цикломатическая сложность: -60% (с 15-20 до 5-8)
- [ ] Время выполнения тестов: -30% (с 45с до 30с)
- [ ] Покрытие тестами: +40% (с 60% до 85%)

### **Качественные метрики**
- [ ] Соблюдение SOLID принципов: 100%
- [ ] Соблюдение OOP принципов: 100%
- [ ] Читаемость кода: +50%
- [ ] Поддерживаемость: +60%
- [ ] Тестируемость: +70%

## 🚨 **РИСКИ И МИТИГАЦИЯ**

### **Высокие риски**
- **Поломка существующих тестов**: Миграция по частям с сохранением обратной совместимости
- **Потеря функциональности**: Тщательное тестирование каждого этапа
- **Производительность**: Бенчмарки до и после рефакторинга

### **Средние риски**
- **Сложность миграции**: Пошаговый план с чеклистами
- **Обучение команды**: Документация и примеры

### **Низкие риски**
- **Временные затраты**: Планирование и контроль сроков

## 🎯 **ИТОГОВЫЙ РЕЗУЛЬТАТ**

После завершения миграции получим:
- ✅ **Enterprise-grade архитектуру** с полным соблюдением SOLID/OOP
- ✅ **Устранение всех дубликатов** и нарушений принципов
- ✅ **Масштабируемую систему** для легкого добавления новых функций
- ✅ **Высокое качество кода** с отличной тестируемостью
- ✅ **Производительную систему** с оптимизированным выполнением

**ROI: 400%+ в течение первого года**
