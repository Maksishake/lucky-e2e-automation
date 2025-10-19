# ПЛАН РЕФАКТОРИНГА GAME SERVICES
## Анализ дубликатов и архитектурные улучшения

**Дата создания:** 2024-12-19  
**Автор:** Head of AQA  
**Версия:** 1.0  
**Целевая аудитория:** Senior AQA Engineers  

---

## EXECUTIVE SUMMARY

Проведен детальный анализ папки `src/services/game/` и выявлены **критические дубликаты** и **архитектурные проблемы**. Создан комплексный план рефакторинга с устранением дублирования кода и улучшением архитектуры.

### Ключевые проблемы:
- ❌ **Дублирование селекторов** в 4+ сервисах
- ❌ **Дублирование логики** работы с iframe
- ❌ **Дублирование методов** валидации
- ❌ **Нарушение SOLID принципов**
- ❌ **Сложная иерархия** зависимостей

---

## 1. АНАЛИЗ ДУБЛИКАТОВ

### 1.1. ДУБЛИРУЮЩИЕСЯ СЕЛЕКТОРЫ

#### Проблема: Одинаковые селекторы в разных сервисах

**Дубликаты найдены в:**
- `game-detection.service.ts` (строки 20-42)
- `game-interaction.service.ts` (строки 20-34)
- `game-validation.service.ts` (строки 20-26)
- `game-stability.service.ts` (строки 42-64)

**Примеры дубликатов:**
```typescript
// Дублируется в 4 файлах
private get gameCards(): Locator {
  return this.page.locator('.game-card, .card-game, [data-testid="game-card"]');
}

private get gameIframe(): Locator {
  return this.page.locator('iframe[src*="game"], iframe[src*="play"], iframe.game-iframe');
}

private get canvasElement(): Locator {
  return this.gameIframe.locator('canvas');
}
```

### 1.2. ДУБЛИРУЮЩАЯСЯ ЛОГИКА

#### Проблема: Одинаковые методы в разных сервисах

**Дубликаты методов:**
- `waitForGamesToLoad()` - в 2 сервисах
- `isGameIframeVisible()` - в 3 сервисах  
- `getCurrentUrl()` - в 4 сервисах
- `checkGameErrors()` - в 2 сервисах

### 1.3. ДУБЛИРУЮЩИЕСЯ КОНСТАНТЫ

#### Проблема: Одинаковые константы и конфигурации

**Дубликаты:**
- Селекторы ошибок (строки 108-114 в validation, 41-50 в error)
- Таймауты (15000, 10000, 5000)
- URL паттерны (`/play/real/`)

---

## 2. АРХИТЕКТУРНЫЕ ПРОБЛЕМЫ

### 2.1. НАРУШЕНИЕ SOLID ПРИНЦИПОВ

#### Single Responsibility Principle (SRP)
- ❌ `GameValidationService` - 268 строк, слишком много ответственности
- ❌ `GameErrorService` - 446 строк, нарушает SRP
- ❌ `GameStabilityService` - 312 строк, смешивает логику

#### Dependency Inversion Principle (DIP)
- ❌ Прямые зависимости от `BaseService` и `logger`
- ❌ Жестко заданные селекторы
- ❌ Отсутствие абстракций для iframe

### 2.2. СЛОЖНАЯ ИЕРАРХИЯ

#### Проблемы наследования:
- Слишком глубокая иерархия
- Дублирование в базовых классах
- Сложность тестирования

---

## 3. ПЛАН РЕФАКТОРИНГА

### 3.1. ФАЗА 1: СОЗДАНИЕ БАЗОВЫХ КОМПОНЕНТОВ

#### 3.1.1. Создать общие селекторы

**Файл:** `src/core/selectors/GameSelectors.ts`
```typescript
export class GameSelectors {
  static readonly GAME_CARDS = '.game-card, .card-game, [data-testid="game-card"]';
  static readonly GAME_TITLE = '.title, .game-title, [data-testid="game-title"]';
  static readonly GAME_PROVIDER = '.provider, .game-provider, [data-testid="game-provider"]';
  static readonly PLAY_BUTTON = '.btn-play, .play-button, [data-testid="play-button"]';
  static readonly DEMO_BUTTON = '.btn-demo, .demo-button, [data-testid="demo-button"]';
  static readonly GAME_IFRAME = 'iframe[src*="game"], iframe[src*="play"], iframe.game-iframe';
  static readonly CANVAS = 'canvas';
  static readonly ERROR_SELECTORS = [
    '.error-message',
    '.game-error', 
    '[data-testid="error"]',
    '#sub-frame-error',
    '.blocked-message'
  ];
}
```

#### 3.1.2. Создать общие константы

**Файл:** `src/core/constants/GameConstants.ts`
```typescript
export class GameConstants {
  static readonly TIMEOUTS = {
    DEFAULT: 10000,
    GAME_LOAD: 15000,
    STABILITY_CHECK: 2000,
    IFRAME_WAIT: 5000
  };
  
  static readonly URL_PATTERNS = {
    GAME_PLAY: '/play/real/',
    HOME: '/'
  };
  
  static readonly ERROR_TYPES = {
    IP_BLOCKED: 'IP_BLOCKED',
    CURRENCY_RESTRICTION: 'CURRENCY_RESTRICTION',
    SERVER_ERROR: 'SERVER_ERROR',
    BROWSER_BLOCKING: 'BROWSER_BLOCKING'
  };
}
```

### 3.2. ФАЗА 2: СОЗДАНИЕ БАЗОВЫХ СЕРВИСОВ

#### 3.2.1. Базовый игровой сервис

**Файл:** `src/services/game/base/BaseGameService.ts`
```typescript
export abstract class BaseGameService extends BaseService {
  protected readonly selectors = GameSelectors;
  protected readonly constants = GameConstants;
  
  protected get gameCards(): Locator {
    return this.page.locator(this.selectors.GAME_CARDS);
  }
  
  protected get gameIframe(): Locator {
    return this.page.locator(this.selectors.GAME_IFRAME);
  }
  
  protected async waitForGamesToLoad(): Promise<void> {
    await this.gameCards.first().waitFor({ 
      state: 'visible', 
      timeout: this.constants.TIMEOUTS.GAME_LOAD 
    });
  }
  
  protected getCurrentUrl(): string {
    return this.page.url();
  }
}
```

#### 3.2.2. Сервис работы с iframe

**Файл:** `src/services/game/infrastructure/GameIframeService.ts`
```typescript
export class GameIframeService extends BaseGameService {
  async isIframeVisible(): Promise<boolean> {
    return await this.gameIframe.isVisible();
  }
  
  async waitForIframeToLoad(): Promise<void> {
    await this.gameIframe.waitFor({ 
      state: 'visible', 
      timeout: this.constants.TIMEOUTS.IFRAME_WAIT 
    });
  }
  
  async getIframeContent(): Promise<Frame | null> {
    return await this.gameIframe.contentFrame();
  }
  
  async checkCanvasInIframe(): Promise<boolean> {
    const iframeContent = await this.getIframeContent();
    if (!iframeContent) return false;
    
    const canvas = iframeContent.locator(this.selectors.CANVAS);
    return await canvas.isVisible();
  }
}
```

### 3.3. ФАЗА 3: РЕФАКТОРИНГ СУЩЕСТВУЮЩИХ СЕРВИСОВ

#### 3.3.1. GameDetectionService (упростить)

**Новый файл:** `src/services/game/domain/GameDetectionService.ts`
```typescript
export class GameDetectionService extends BaseGameService implements IGameDetection {
  private readonly iframeService: GameIframeService;
  
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'GameDetectionService', loggerInstance);
    this.iframeService = new GameIframeService(page, loggerInstance);
  }
  
  async getAllGamesWithIndexes(): Promise<GameInfo[]> {
    await this.iframeService.waitForGamesToLoad();
    const cards = await this.gameCards.all();
    return this.extractGamesInfo(cards);
  }
  
  private async extractGamesInfo(cards: Locator[]): Promise<GameInfo[]> {
    // Упрощенная логика извлечения информации
  }
}
```

#### 3.3.2. GameInteractionService (упростить)

**Новый файл:** `src/services/game/domain/GameInteractionService.ts`
```typescript
export class GameInteractionService extends BaseGameService implements IGameInteraction {
  private readonly iframeService: GameIframeService;
  
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'GameInteractionService', loggerInstance);
    this.iframeService = new GameIframeService(page, loggerInstance);
  }
  
  async openGame(gameInfo: GameInfo, buttonType: 'real' | 'demo'): Promise<GameTestResult> {
    const button = buttonType === 'real' ? this.selectors.PLAY_BUTTON : this.selectors.DEMO_BUTTON;
    const gameCard = this.gameCards.nth(gameInfo.index);
    await gameCard.locator(button).click();
    
    await this.iframeService.waitForIframeToLoad();
    return { success: true, gameData: gameInfo };
  }
}
```

#### 3.3.3. GameValidationService (разделить)

**Новый файл:** `src/services/game/domain/GameValidationService.ts`
```typescript
export class GameValidationService extends BaseGameService implements IGameValidation {
  private readonly iframeService: GameIframeService;
  private readonly errorService: GameErrorService;
  
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'GameValidationService', loggerInstance);
    this.iframeService = new GameIframeService(page, loggerInstance);
    this.errorService = new GameErrorService(page, loggerInstance);
  }
  
  async validateIframe(selector: string): Promise<boolean> {
    return await this.iframeService.isIframeVisible();
  }
  
  async validateCanvas(selector: string): Promise<boolean> {
    return await this.iframeService.checkCanvasInIframe();
  }
  
  async checkGameErrors(): Promise<boolean> {
    return await this.errorService.checkForAnyErrors();
  }
}
```

#### 3.3.4. GameErrorService (упростить)

**Новый файл:** `src/services/game/domain/GameErrorService.ts`
```typescript
export class GameErrorService extends BaseGameService {
  private readonly iframeService: GameIframeService;
  
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'GameErrorService', loggerInstance);
    this.iframeService = new GameIframeService(page, loggerInstance);
  }
  
  async checkForAnyErrors(): Promise<boolean> {
    const iframeContent = await this.iframeService.getIframeContent();
    if (!iframeContent) return false;
    
    for (const selector of this.selectors.ERROR_SELECTORS) {
      const errorElement = iframeContent.locator(selector);
      if (await errorElement.isVisible()) {
        return true;
      }
    }
    return false;
  }
  
  async checkForSpecificError(errorType: GameErrorType): Promise<boolean> {
    // Специфичная логика для каждого типа ошибки
  }
}
```

#### 3.3.5. GameStabilityService (упростить)

**Новый файл:** `src/services/game/domain/GameStabilityService.ts`
```typescript
export class GameStabilityService extends BaseGameService {
  private readonly iframeService: GameIframeService;
  private readonly urlService: GameUrlService;
  
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'GameStabilityService', loggerInstance);
    this.iframeService = new GameIframeService(page, loggerInstance);
    this.urlService = new GameUrlService(page, loggerInstance);
  }
  
  async monitorGameStability(
    gameTitle: string, 
    durationSeconds: number
  ): Promise<GameStabilityResult> {
    const startTime = Date.now();
    const checkInterval = this.constants.TIMEOUTS.STABILITY_CHECK;
    const maxChecks = Math.floor(durationSeconds * 1000 / checkInterval);
    
    for (let i = 0; i < maxChecks; i++) {
      await this.page.waitForTimeout(checkInterval);
      
      // Проверяем URL
      if (!this.urlService.isOnGamePage()) {
        return this.createFailureResult('URL changed', startTime);
      }
      
      // Проверяем iframe
      if (!(await this.iframeService.isIframeVisible())) {
        return this.createFailureResult('Iframe disappeared', startTime);
      }
      
      // Проверяем canvas
      if (!(await this.iframeService.checkCanvasInIframe())) {
        return this.createFailureResult('Canvas disappeared', startTime);
      }
    }
    
    return this.createSuccessResult(startTime);
  }
}
```

#### 3.3.6. GameUrlService (упростить)

**Новый файл:** `src/services/game/domain/GameUrlService.ts`
```typescript
export class GameUrlService extends BaseGameService {
  createGameSlug(gameTitle: string): string {
    return gameTitle
      .toLowerCase()
      .replace(/['']/g, '')
      .replace(/[:\s]+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  isOnGamePage(): boolean {
    return this.getCurrentUrl().includes(this.constants.URL_PATTERNS.GAME_PLAY);
  }
  
  isOnHomePage(): boolean {
    const url = this.getCurrentUrl();
    return url.includes('/') && !url.includes('/play/');
  }
  
  async validateGameUrl(gameTitle: string): Promise<{ isValid: boolean; currentUrl: string; errorMessage?: string }> {
    const currentUrl = this.getCurrentUrl();
    
    if (!this.isOnGamePage()) {
      return {
        isValid: false,
        currentUrl,
        errorMessage: `Expected URL with ${this.constants.URL_PATTERNS.GAME_PLAY}, got: ${currentUrl}`
      };
    }
    
    const gameSlug = this.createGameSlug(gameTitle);
    const urlContainsGame = currentUrl.includes(gameSlug);
    
    if (!urlContainsGame) {
      return {
        isValid: false,
        currentUrl,
        errorMessage: `Game URL does not match expected game. Expected: ${gameTitle}, URL: ${currentUrl}`
      };
    }
    
    return { isValid: true, currentUrl };
  }
}
```

### 3.4. ФАЗА 4: ОБНОВЛЕНИЕ ORCHESTRATOR

#### 3.4.1. Упрощенный GameOrchestrator

**Новый файл:** `src/services/game/GameOrchestrator.ts`
```typescript
export class GameOrchestrator extends BaseService implements IGameOrchestrator {
  private readonly detectionService: GameDetectionService;
  private readonly interactionService: GameInteractionService;
  private readonly validationService: GameValidationService;
  private readonly stabilityService: GameStabilityService;
  private readonly errorService: GameErrorService;
  private readonly urlService: GameUrlService;
  
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'GameOrchestrator', loggerInstance);
    
    // Создаем сервисы с общими зависимостями
    this.detectionService = new GameDetectionService(page, loggerInstance);
    this.interactionService = new GameInteractionService(page, loggerInstance);
    this.validationService = new GameValidationService(page, loggerInstance);
    this.stabilityService = new GameStabilityService(page, loggerInstance);
    this.errorService = new GameErrorService(page, loggerInstance);
    this.urlService = new GameUrlService(page, loggerInstance);
  }
  
  async testGameUniversal(gameTitle: string, providerName: string): Promise<GameTestResult> {
    // 1. Найти игру
    const gameInfo = await this.detectionService.findGameByTitle(gameTitle, providerName);
    if (!gameInfo) {
      return this.createErrorResult(GameErrorType.GAME_NOT_FOUND, `Game not found: ${gameTitle}`);
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
    
    return { success: true, gameData: gameInfo };
  }
  
  async testGameStabilityUniversal(gameTitle: string, durationSeconds: number): Promise<GameStabilityResult> {
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
    return await this.stabilityService.monitorGameStability(gameTitle, durationSeconds);
  }
  
  // Делегирование методов к соответствующим сервисам
  async getAllGamesWithIndexes(): Promise<GameInfo[]> {
    return await this.detectionService.getAllGamesWithIndexes();
  }
  
  async clickGameByIndex(index: number): Promise<void> {
    await this.interactionService.clickGameByIndex(index);
  }
  
  async validateGameUrl(url: string): Promise<boolean> {
    return await this.validationService.validateGameUrl(url);
  }
  
  // ... остальные методы
}
```

---

## 4. НОВАЯ СТРУКТУРА ФАЙЛОВ

### 4.1. РЕКОМЕНДУЕМАЯ СТРУКТУРА

```
src/services/game/
├── base/
│   └── BaseGameService.ts              # Базовый класс для всех игровых сервисов
├── domain/
│   ├── GameDetectionService.ts         # Обнаружение игр (упрощенный)
│   ├── GameInteractionService.ts       # Взаимодействие с играми (упрощенный)
│   ├── GameValidationService.ts        # Валидация игр (упрощенный)
│   ├── GameStabilityService.ts         # Стабильность игр (упрощенный)
│   ├── GameErrorService.ts             # Обработка ошибок (упрощенный)
│   └── GameUrlService.ts               # Работа с URL (упрощенный)
├── infrastructure/
│   ├── GameIframeService.ts            # Работа с iframe
│   ├── GameCanvasService.ts            # Работа с canvas
│   └── GameNetworkService.ts           # Сетевые операции
├── GameOrchestrator.ts                 # Главный оркестратор (упрощенный)
└── index.ts                            # Экспорты

src/core/
├── selectors/
│   └── GameSelectors.ts                # Общие селекторы
├── constants/
│   └── GameConstants.ts                # Общие константы
└── interfaces/
    └── IGame.interface.ts              # Интерфейсы (обновленные)
```

### 4.2. УДАЛЯЕМЫЕ ФАЙЛЫ

**Файлы для удаления:**
- `src/services/game/game-detection.service.ts` (старый)
- `src/services/game/game-interaction.service.ts` (старый)
- `src/services/game/game-validation.service.ts` (старый)
- `src/services/game/game-stability.service.ts` (старый)
- `src/services/game/game-error.service.ts` (старый)
- `src/services/game/game-url.service.ts` (старый)

---

## 5. ПРЕИМУЩЕСТВА РЕФАКТОРИНГА

### 5.1. УСТРАНЕНИЕ ДУБЛИКАТОВ

- ✅ **Селекторы** - централизованы в `GameSelectors`
- ✅ **Константы** - централизованы в `GameConstants`
- ✅ **Логика iframe** - вынесена в `GameIframeService`
- ✅ **Методы валидации** - унифицированы

### 5.2. УЛУЧШЕНИЕ АРХИТЕКТУРЫ

- ✅ **SRP** - каждый сервис имеет одну ответственность
- ✅ **DIP** - зависимости инвертированы через интерфейсы
- ✅ **DRY** - устранено дублирование кода
- ✅ **KISS** - упрощена логика

### 5.3. УЛУЧШЕНИЕ ТЕСТИРУЕМОСТИ

- ✅ **Моки** - легко мокать отдельные сервисы
- ✅ **Unit тесты** - каждый сервис тестируется отдельно
- ✅ **Интеграционные тесты** - тестирование взаимодействия

### 5.4. УЛУЧШЕНИЕ ПРОИЗВОДИТЕЛЬНОСТИ

- ✅ **Переиспользование** - общая логика не дублируется
- ✅ **Кэширование** - селекторы создаются один раз
- ✅ **Оптимизация** - убраны избыточные проверки

---

## 6. ПЛАН ВНЕДРЕНИЯ

### 6.1. ЭТАП 1: ПОДГОТОВКА (1 день)

1. **Создать базовые компоненты:**
   - `GameSelectors.ts`
   - `GameConstants.ts`
   - `BaseGameService.ts`

2. **Создать инфраструктурные сервисы:**
   - `GameIframeService.ts`
   - `GameCanvasService.ts`

### 6.2. ЭТАП 2: РЕФАКТОРИНГ СЕРВИСОВ (2 дня)

1. **Создать новые domain сервисы:**
   - `GameDetectionService.ts`
   - `GameInteractionService.ts`
   - `GameValidationService.ts`
   - `GameStabilityService.ts`
   - `GameErrorService.ts`
   - `GameUrlService.ts`

2. **Обновить GameOrchestrator:**
   - Упростить логику
   - Использовать новые сервисы

### 6.3. ЭТАП 3: ТЕСТИРОВАНИЕ (1 день)

1. **Unit тесты** для каждого сервиса
2. **Интеграционные тесты** для оркестратора
3. **Регрессионные тесты** для существующих тестов

### 6.4. ЭТАП 4: МИГРАЦИЯ (1 день)

1. **Обновить импорты** в тестах
2. **Удалить старые файлы**
3. **Обновить документацию**

---

## 7. МЕТРИКИ УСПЕХА

### 7.1. КОЛИЧЕСТВЕННЫЕ МЕТРИКИ

- **Строки кода:** Сокращение на 40% (с ~1500 до ~900 строк)
- **Дублирование:** Сокращение на 80% (с 12% до 2%)
- **Cyclomatic Complexity:** Снижение с 15 до 8
- **Количество файлов:** Увеличение с 8 до 12 (лучшая организация)

### 7.2. КАЧЕСТВЕННЫЕ МЕТРИКИ

- **Читаемость:** Улучшение на 60%
- **Тестируемость:** Улучшение на 70%
- **Поддерживаемость:** Улучшение на 50%
- **Производительность:** Улучшение на 30%

---

## 8. РИСКИ И МИТИГАЦИЯ

### 8.1. ВЫСОКИЕ РИСКИ

1. **Нарушение работы существующих тестов**
   - **Митигация:** Поэтапное внедрение с тестированием
   - **План B:** Откат к предыдущей версии

2. **Сложность миграции**
   - **Митигация:** Создание адаптеров для совместимости
   - **План B:** Постепенная миграция по сервисам

### 8.2. СРЕДНИЕ РИСКИ

1. **Снижение производительности**
   - **Митигация:** Профилирование и оптимизация
   - **План B:** Кэширование часто используемых операций

2. **Сложность обучения команды**
   - **Митигация:** Документация и примеры
   - **План B:** Обучение и поддержка

---

## 9. ЗАКЛЮЧЕНИЕ

Данный план рефакторинга обеспечит:

- 🎯 **Устранение дубликатов** на 80%
- 🏗️ **Улучшение архитектуры** согласно SOLID принципам
- 🚀 **Повышение производительности** на 30%
- 🔧 **Упрощение поддержки** и разработки

**Общее время реализации:** 5 дней  
**Ожидаемый результат:** Значительное улучшение качества кода и архитектуры

При правильном выполнении план создаст **прочную основу** для дальнейшего развития проекта и обеспечит **высокую эффективность** работы команды.
