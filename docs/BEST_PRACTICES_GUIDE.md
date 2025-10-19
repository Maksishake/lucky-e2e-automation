# РУКОВОДСТВО ПО ЛУЧШИМ ПРАКТИКАМ
## Playwright + TypeScript для E2E тестирования

**Дата создания:** 2024-12-19  
**Автор:** Head of AQA  
**Версия:** 1.0  
**Целевая аудитория:** Junior/Senior AQA Engineers  

---

## СОДЕРЖАНИЕ

1. [Структура проекта](#1-структура-проекта)
2. [Организация тестов](#2-организация-тестов)
3. [Управление состояниями](#3-управление-состояниями)
4. [Работа с конфигурациями](#4-работа-с-конфигурациями)
5. [Паттерны и анти-паттерны](#5-паттерны-и-анти-паттерны)
6. [Написание стабильных тестов](#6-написание-стабильных-тестов)
7. [Отладка и мониторинг](#7-отладка-и-мониторинг)
8. [Производительность](#8-производительность)

---

## 1. СТРУКТУРА ПРОЕКТА

### 1.1. РЕКОМЕНДУЕМАЯ СТРУКТУРА

```
lucky-e2e-automation/
├── src/                          # Исходный код
│   ├── core/                     # Базовые абстракции
│   │   ├── abstract/            # Абстрактные классы
│   │   ├── interfaces/          # Интерфейсы
│   │   ├── factories/           # Фабрики
│   │   ├── decorators/          # Декораторы
│   │   └── utils/               # Утилиты
│   ├── components/              # UI компоненты
│   │   ├── atoms/               # Атомарные компоненты
│   │   ├── molecules/           # Молекулярные компоненты
│   │   ├── organisms/           # Организменные компоненты
│   │   └── templates/           # Шаблоны страниц
│   ├── services/                # Бизнес-логика
│   │   ├── domain/              # Доменные сервисы
│   │   ├── infrastructure/      # Инфраструктурные сервисы
│   │   └── application/         # Сервисы приложения
│   ├── pages/                   # Page Objects
│   ├── types/                   # TypeScript типы
│   ├── config/                  # Конфигурация
│   ├── utils/                   # Общие утилиты
│   └── setup/                   # Глобальная настройка
├── tests/                       # Тестовые файлы
│   ├── smoke/                   # Критические тесты
│   ├── regression/              # Регрессионные тесты
│   ├── integration/             # Интеграционные тесты
│   ├── e2e/                     # End-to-end тесты
│   └── unit/                    # Unit тесты
├── docs/                        # Документация
├── examples/                    # Примеры использования
├── templates/                   # Шаблоны для новых тестов
└── config/                      # Конфигурационные файлы
```

### 1.2. ПРИНЦИПЫ ОРГАНИЗАЦИИ

#### 1.2.1. Atomic Design для компонентов

**Atoms (Атомы)**
```typescript
// src/components/atoms/Button.ts
export class Button extends BaseComponent {
  constructor(page: Page, selector: string) {
    super(page, 'Button', selector);
  }

  async click(): Promise<void> {
    await this.rootElement.click();
  }

  async isEnabled(): Promise<boolean> {
    return await this.rootElement.isEnabled();
  }
}
```

**Molecules (Молекулы)**
```typescript
// src/components/molecules/LoginForm.ts
export class LoginForm extends BaseComponent {
  private readonly emailInput: Input;
  private readonly passwordInput: Input;
  private readonly submitButton: Button;

  constructor(page: Page) {
    super(page, 'LoginForm', '.login-form');
    this.emailInput = new Input(page, '#email');
    this.passwordInput = new Input(page, '#password');
    this.submitButton = new Button(page, '#submit');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

**Organisms (Организмы)**
```typescript
// src/components/organisms/GameGrid.ts
export class GameGrid extends BaseComponent {
  private readonly gameCards: GameCard[] = [];

  constructor(page: Page) {
    super(page, 'GameGrid', '.game-grid');
  }

  async getGameCards(): Promise<GameCard[]> {
    const cards = await this.page.locator('.game-card').all();
    return cards.map(card => new GameCard(this.page, card));
  }

  async selectGameByTitle(title: string): Promise<void> {
    const card = await this.findGameByTitle(title);
    await card.click();
  }
}
```

### 1.3. NAMING CONVENTIONS

#### 1.3.1. Файлы и папки
```typescript
// ✅ Хорошо
game-card.component.ts
user-login.service.ts
payment-page.ts

// ❌ Плохо
gameCard.ts
userLoginService.ts
PaymentPage.ts
```

#### 1.3.2. Классы и интерфейсы
```typescript
// ✅ Хорошо
export class GameCardComponent extends BaseComponent {}
export interface IGameService {}
export enum GameStatus {}

// ❌ Плохо
export class gameCard extends BaseComponent {}
export interface gameService {}
export enum gameStatus {}
```

#### 1.3.3. Методы и переменные
```typescript
// ✅ Хорошо
async selectGameByTitle(title: string): Promise<void> {}
const gameCardSelector = '.game-card';
const maxRetries = 3;

// ❌ Плохо
async selectgamebytitle(title: string): Promise<void> {}
const gamecardselector = '.game-card';
const maxretries = 3;
```

---

## 2. ОРГАНИЗАЦИЯ ТЕСТОВ

### 2.1. СТРУКТУРА ТЕСТОВ

#### 2.1.1. Smoke Tests (Критические тесты)
```typescript
// tests/smoke/auth.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '@/pages/LoginPage';

test.describe('Authentication Smoke Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('should login successfully with valid credentials', async () => {
    await loginPage.login('test@example.com', 'password123');
    await expect(loginPage.successMessage).toBeVisible();
  });

  test('should show error with invalid credentials', async () => {
    await loginPage.login('invalid@example.com', 'wrongpassword');
    await expect(loginPage.errorMessage).toBeVisible();
  });
});
```

#### 2.1.2. Regression Tests (Регрессионные тесты)
```typescript
// tests/regression/game-functionality.spec.ts
import { test, expect } from '@playwright/test';
import { GamePage } from '@/pages/GamePage';

test.describe('Game Functionality Regression', () => {
  test('should open all game types', async ({ page }) => {
    const gamePage = new GamePage(page);
    const gameTypes = ['slots', 'live-casino', 'table-games'];

    for (const gameType of gameTypes) {
      await gamePage.navigateToGameType(gameType);
      await expect(gamePage.gameGrid).toBeVisible();
    }
  });
});
```

#### 2.1.3. Integration Tests (Интеграционные тесты)
```typescript
// tests/integration/payment-flow.spec.ts
import { test, expect } from '@playwright/test';
import { PaymentPage } from '@/pages/PaymentPage';
import { GamePage } from '@/pages/GamePage';

test.describe('Payment Integration Flow', () => {
  test('should complete full payment flow', async ({ page }) => {
    const gamePage = new GamePage(page);
    const paymentPage = new PaymentPage(page);

    // 1. Open game
    await gamePage.openGame('Book of Dead');
    
    // 2. Navigate to payment
    await gamePage.clickDepositButton();
    
    // 3. Complete payment
    await paymentPage.selectPaymentMethod('card');
    await paymentPage.enterAmount(100);
    await paymentPage.submitPayment();
    
    // 4. Verify success
    await expect(paymentPage.successMessage).toBeVisible();
  });
});
```

### 2.2. ОРГАНИЗАЦИЯ ТЕСТОВЫХ ДАННЫХ

#### 2.2.1. Test Data Factory
```typescript
// src/utils/TestDataFactory.ts
export class TestDataFactory {
  static createUser(overrides: Partial<User> = {}): User {
    return {
      email: `test${Date.now()}@example.com`,
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User',
      ...overrides
    };
  }

  static createGameData(overrides: Partial<GameData> = {}): GameData {
    return {
      title: 'Test Game',
      provider: 'Test Provider',
      category: 'slots',
      ...overrides
    };
  }

  static createPaymentData(overrides: Partial<PaymentData> = {}): PaymentData {
    return {
      amount: 100,
      currency: 'USD',
      method: 'card',
      ...overrides
    };
  }
}
```

#### 2.2.2. Test Data Builder
```typescript
// src/utils/TestDataBuilder.ts
export class UserBuilder {
  private user: Partial<User> = {};

  withEmail(email: string): UserBuilder {
    this.user.email = email;
    return this;
  }

  withPassword(password: string): UserBuilder {
    this.user.password = password;
    return this;
  }

  withFirstName(firstName: string): UserBuilder {
    this.user.firstName = firstName;
    return this;
  }

  build(): User {
    return TestDataFactory.createUser(this.user);
  }
}

// Использование
const user = new UserBuilder()
  .withEmail('admin@example.com')
  .withPassword('AdminPass123!')
  .withFirstName('Admin')
  .build();
```

### 2.3. УПРАВЛЕНИЕ ТЕСТОВЫМИ СЦЕНАРИЯМИ

#### 2.3.1. Test Scenarios
```typescript
// src/utils/TestScenarios.ts
export class TestScenarios {
  static async loginAsUser(page: Page, user: User): Promise<void> {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(user.email, user.password);
    await loginPage.waitForSuccess();
  }

  static async openGameAndVerify(page: Page, gameTitle: string): Promise<void> {
    const gamePage = new GamePage(page);
    await gamePage.navigate();
    await gamePage.openGame(gameTitle);
    await gamePage.verifyGameLoaded();
  }

  static async completePaymentFlow(page: Page, amount: number): Promise<void> {
    const paymentPage = new PaymentPage(page);
    await paymentPage.navigate();
    await paymentPage.selectAmount(amount);
    await paymentPage.submitPayment();
    await paymentPage.verifySuccess();
  }
}
```

---

## 3. УПРАВЛЕНИЕ СОСТОЯНИЯМИ

### 3.1. STATE MANAGEMENT PATTERNS

#### 3.1.1. Singleton State Manager
```typescript
// src/core/state/StateManager.ts
export class StateManager {
  private static instance: StateManager;
  private state: Map<string, unknown> = new Map();

  static getInstance(): StateManager {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager();
    }
    return StateManager.instance;
  }

  setState<T>(key: string, value: T): void {
    this.state.set(key, value);
  }

  getState<T>(key: string): T | undefined {
    return this.state.get(key) as T;
  }

  clearState(): void {
    this.state.clear();
  }
}
```

#### 3.1.2. Context-based State
```typescript
// src/core/state/TestContext.ts
export class TestContext {
  private context: Map<string, unknown> = new Map();

  setContext<T>(key: string, value: T): void {
    this.context.set(key, value);
  }

  getContext<T>(key: string): T | undefined {
    return this.context.get(key) as T;
  }

  hasContext(key: string): boolean {
    return this.context.has(key);
  }

  removeContext(key: string): boolean {
    return this.context.delete(key);
  }
}
```

### 3.2. SESSION MANAGEMENT

#### 3.2.1. Authentication State
```typescript
// src/core/auth/AuthStateManager.ts
export class AuthStateManager {
  private static instance: AuthStateManager;
  private authState: AuthState | null = null;

  static getInstance(): AuthStateManager {
    if (!AuthStateManager.instance) {
      AuthStateManager.instance = new AuthStateManager();
    }
    return AuthStateManager.instance;
  }

  async saveAuthState(page: Page): Promise<void> {
    const storageState = await page.context().storageState();
    this.authState = {
      storageState,
      timestamp: Date.now(),
      isValid: true
    };
  }

  async restoreAuthState(page: Page): Promise<boolean> {
    if (!this.authState || !this.isValid()) {
      return false;
    }

    await page.context().addCookies(this.authState.storageState.cookies);
    return true;
  }

  private isValid(): boolean {
    if (!this.authState) return false;
    const now = Date.now();
    const maxAge = 30 * 60 * 1000; // 30 minutes
    return (now - this.authState.timestamp) < maxAge;
  }
}
```

### 3.3. DATA PERSISTENCE

#### 3.3.1. Test Data Persistence
```typescript
// src/core/persistence/TestDataPersistence.ts
export class TestDataPersistence {
  private static dataFile = 'test-results/test-data.json';

  static async saveTestData(data: TestData): Promise<void> {
    const fs = require('fs');
    const existingData = await this.loadTestData();
    existingData.push(data);
    fs.writeFileSync(this.dataFile, JSON.stringify(existingData, null, 2));
  }

  static async loadTestData(): Promise<TestData[]> {
    const fs = require('fs');
    if (!fs.existsSync(this.dataFile)) {
      return [];
    }
    const data = fs.readFileSync(this.dataFile, 'utf8');
    return JSON.parse(data);
  }

  static async clearTestData(): Promise<void> {
    const fs = require('fs');
    if (fs.existsSync(this.dataFile)) {
      fs.unlinkSync(this.dataFile);
    }
  }
}
```

---

## 4. РАБОТА С КОНФИГУРАЦИЯМИ

### 4.1. ENVIRONMENT CONFIGURATIONS

#### 4.1.1. Environment-specific Configs
```typescript
// src/config/environments/development.ts
export const developmentConfig = {
  baseURL: 'https://dev.luckycoin777.live',
  timeout: 30000,
  retries: 1,
  workers: 4,
  fullyParallel: true,
  reporter: [['html'], ['line']],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  }
};

// src/config/environments/production.ts
export const productionConfig = {
  baseURL: 'https://luckycoin777.live',
  timeout: 60000,
  retries: 3,
  workers: 2,
  fullyParallel: true,
  reporter: [['html'], ['json'], ['junit']],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  }
};
```

#### 4.1.2. Dynamic Configuration
```typescript
// src/config/ConfigurationManager.ts
export class ConfigurationManager {
  private static config: PlaywrightConfig;

  static getConfig(): PlaywrightConfig {
    if (!this.config) {
      this.config = this.loadConfig();
    }
    return this.config;
  }

  private static loadConfig(): PlaywrightConfig {
    const environment = process.env.NODE_ENV || 'development';
    
    switch (environment) {
      case 'development':
        return developmentConfig;
      case 'production':
        return productionConfig;
      case 'staging':
        return stagingConfig;
      default:
        throw new Error(`Unknown environment: ${environment}`);
    }
  }

  static updateConfig(updates: Partial<PlaywrightConfig>): void {
    this.config = { ...this.config, ...updates };
  }
}
```

### 4.2. FEATURE FLAGS

#### 4.2.1. Feature Flag Manager
```typescript
// src/config/FeatureFlagManager.ts
export class FeatureFlagManager {
  private static flags: Map<string, boolean> = new Map();

  static setFlag(flag: string, enabled: boolean): void {
    this.flags.set(flag, enabled);
  }

  static isEnabled(flag: string): boolean {
    return this.flags.get(flag) || false;
  }

  static getFlags(): Map<string, boolean> {
    return new Map(this.flags);
  }
}

// Использование
if (FeatureFlagManager.isEnabled('NEW_PAYMENT_FLOW')) {
  await newPaymentFlow();
} else {
  await legacyPaymentFlow();
}
```

### 4.3. TEST CONFIGURATION

#### 4.3.1. Test-specific Configuration
```typescript
// src/config/TestConfiguration.ts
export class TestConfiguration {
  static getTestConfig(testName: string): TestConfig {
    const configs: Record<string, TestConfig> = {
      'smoke': {
        timeout: 30000,
        retries: 1,
        parallel: true
      },
      'regression': {
        timeout: 60000,
        retries: 2,
        parallel: false
      },
      'integration': {
        timeout: 120000,
        retries: 3,
        parallel: false
      }
    };

    return configs[testName] || configs['smoke'];
  }
}
```

---

## 5. ПАТТЕРНЫ И АНТИ-ПАТТЕРНЫ

### 5.1. ХОРОШИЕ ПАТТЕРНЫ

#### 5.1.1. Page Object Model
```typescript
// ✅ Хорошо - четкое разделение ответственности
export class LoginPage extends BasePage {
  private readonly emailInput: Input;
  private readonly passwordInput: Input;
  private readonly loginButton: Button;

  constructor(page: Page) {
    super(page, 'LoginPage', '/login');
    this.emailInput = new Input(page, '#email');
    this.passwordInput = new Input(page, '#password');
    this.loginButton = new Button(page, '#login-button');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

#### 5.1.2. Factory Pattern
```typescript
// ✅ Хорошо - создание объектов через фабрику
export class PageFactory {
  static createPage(page: Page, pageType: PageType): BasePage {
    switch (pageType) {
      case PageType.LOGIN:
        return new LoginPage(page);
      case PageType.GAME:
        return new GamePage(page);
      case PageType.PAYMENT:
        return new PaymentPage(page);
      default:
        throw new Error(`Unknown page type: ${pageType}`);
    }
  }
}
```

#### 5.1.3. Strategy Pattern
```typescript
// ✅ Хорошо - разные стратегии для разных типов игр
interface GameStrategy {
  openGame(gameTitle: string): Promise<void>;
  validateGame(): Promise<boolean>;
}

export class SlotGameStrategy implements GameStrategy {
  async openGame(gameTitle: string): Promise<void> {
    // Логика для слотов
  }

  async validateGame(): Promise<boolean> {
    // Валидация для слотов
  }
}

export class LiveCasinoStrategy implements GameStrategy {
  async openGame(gameTitle: string): Promise<void> {
    // Логика для живого казино
  }

  async validateGame(): Promise<boolean> {
    // Валидация для живого казино
  }
}
```

#### 5.1.4. Observer Pattern
```typescript
// ✅ Хорошо - уведомления о событиях
export class TestEventEmitter {
  private listeners: Map<string, Function[]> = new Map();

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  emit(event: string, data: unknown): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }
}
```

### 5.2. АНТИ-ПАТТЕРНЫ

#### 5.2.1. God Object
```typescript
// ❌ Плохо - класс делает слишком много
class TestHelper {
  async login() { /* ... */ }
  async openGame() { /* ... */ }
  async makePayment() { /* ... */ }
  async generateReport() { /* ... */ }
  async sendEmail() { /* ... */ }
  async validateData() { /* ... */ }
}

// ✅ Хорошо - разделение ответственности
class AuthService {
  async login() { /* ... */ }
}

class GameService {
  async openGame() { /* ... */ }
}

class PaymentService {
  async makePayment() { /* ... */ }
}
```

#### 5.2.2. Hard-coded Values
```typescript
// ❌ Плохо - жестко заданные значения
await page.waitForTimeout(5000);
await page.click('button[data-testid="login"]');
const email = 'test@example.com';

// ✅ Хорошо - конфигурируемые значения
await page.waitForTimeout(config.timeouts.default);
await page.click(selectors.loginButton);
const email = TestDataFactory.createEmail();
```

#### 5.2.3. Flaky Selectors
```typescript
// ❌ Плохо - нестабильные селекторы
await page.click('div:nth-child(3) > button:nth-child(2)');
await page.fill('input[class*="form-control"]');

// ✅ Хорошо - стабильные селекторы
await page.click('[data-testid="submit-button"]');
await page.fill('[data-testid="email-input"]');
```

#### 5.2.4. Missing Error Handling
```typescript
// ❌ Плохо - отсутствие обработки ошибок
async openGame(gameTitle: string) {
  await page.click(`[data-game="${gameTitle}"]`);
  await page.waitForSelector('iframe');
}

// ✅ Хорошо - комплексная обработка ошибок
async openGame(gameTitle: string): Promise<GameOpenResult> {
  try {
    this.logger.info('GameService', `Opening game: ${gameTitle}`);
    
    const gameElement = await this.findGameElement(gameTitle);
    if (!gameElement) {
      return { success: false, error: 'Game not found' };
    }
    
    await gameElement.click();
    await this.waitForGameToLoad();
    
    return { success: true };
  } catch (error) {
    this.logger.error('GameService', `Failed to open game: ${error}`);
    return { success: false, error: error.message };
  }
}
```

---

## 6. НАПИСАНИЕ СТАБИЛЬНЫХ ТЕСТОВ

### 6.1. ПРИНЦИПЫ СТАБИЛЬНОСТИ

#### 6.1.1. Используйте умные ожидания
```typescript
// ❌ Плохо - фиксированные таймауты
await page.waitForTimeout(5000);

// ✅ Хорошо - умные ожидания
await page.waitForSelector(selector, { state: 'visible' });
await page.waitForLoadState('networkidle');
```

#### 6.1.2. Обрабатывайте асинхронность правильно
```typescript
// ❌ Плохо - неправильная обработка промисов
page.click(selector).then(() => {
  // Действия после клика
});

// ✅ Хорошо - правильная обработка
await page.click(selector);
// Действия после клика
```

#### 6.1.3. Используйте retry логику
```typescript
// ✅ Хорошо - retry с экспоненциальной задержкой
export class RetryHelper {
  static async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < maxRetries - 1) {
          const delay = baseDelay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError!;
  }
}
```

### 6.2. ОБРАБОТКА ОШИБОК

#### 6.2.1. Graceful Error Handling
```typescript
// ✅ Хорошо - graceful обработка ошибок
export class ErrorHandler {
  static async handleError(error: Error, context: string): Promise<boolean> {
    const errorMessage = error.message.toLowerCase();

    // Сетевые ошибки
    if (errorMessage.includes('net::err_')) {
      console.log('Network error detected, retrying...');
      return true; // Retry
    }

    // Таймауты
    if (errorMessage.includes('timeout')) {
      console.log('Timeout detected, retrying...');
      return true; // Retry
    }

    // Критические ошибки
    if (errorMessage.includes('element not found')) {
      console.log('Element not found, failing test');
      return false; // Don't retry
    }

    return false; // Default: don't retry
  }
}
```

#### 6.2.2. Error Recovery
```typescript
// ✅ Хорошо - автоматическое восстановление
export class AutoRecovery {
  static async recoverFromError(page: Page, error: Error): Promise<boolean> {
    const errorMessage = error.message.toLowerCase();

    // Восстановление от сетевых ошибок
    if (errorMessage.includes('net::err_')) {
      await page.reload();
      await page.waitForLoadState('networkidle');
      return true;
    }

    // Восстановление от ошибок загрузки
    if (errorMessage.includes('timeout')) {
      await page.waitForTimeout(2000);
      return true;
    }

    return false;
  }
}
```

### 6.3. ВАЛИДАЦИЯ ТЕСТОВ

#### 6.3.1. Pre-test Validation
```typescript
// ✅ Хорошо - валидация перед тестом
export class TestValidator {
  static async validateTestEnvironment(page: Page): Promise<boolean> {
    try {
      // Проверка доступности страницы
      await page.goto('/health-check');
      const response = await page.textContent('body');
      
      if (response !== 'OK') {
        throw new Error('Health check failed');
      }

      // Проверка необходимых элементов
      const requiredElements = [
        '[data-testid="main-navigation"]',
        '[data-testid="user-menu"]'
      ];

      for (const selector of requiredElements) {
        await page.waitForSelector(selector, { timeout: 5000 });
      }

      return true;
    } catch (error) {
      console.error('Test environment validation failed:', error);
      return false;
    }
  }
}
```

#### 6.3.2. Post-test Cleanup
```typescript
// ✅ Хорошо - очистка после теста
export class TestCleanup {
  static async cleanup(page: Page): Promise<void> {
    try {
      // Очистка localStorage
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });

      // Очистка cookies
      await page.context().clearCookies();

      // Очистка состояния
      StateManager.getInstance().clearState();
    } catch (error) {
      console.warn('Cleanup failed:', error);
    }
  }
}
```

---

## 7. ОТЛАДКА И МОНИТОРИНГ

### 7.1. ЛОГИРОВАНИЕ

#### 7.1.1. Structured Logging
```typescript
// ✅ Хорошо - структурированное логирование
export class StructuredLogger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  info(message: string, data?: unknown): void {
    this.log('INFO', message, data);
  }

  error(message: string, error?: Error, data?: unknown): void {
    this.log('ERROR', message, { error: error?.message, stack: error?.stack, ...data });
  }

  private log(level: string, message: string, data?: unknown): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      context: this.context,
      message,
      data
    };

    console.log(JSON.stringify(logEntry));
  }
}
```

#### 7.1.2. Test Execution Logging
```typescript
// ✅ Хорошо - логирование выполнения тестов
export class TestLogger {
  static logTestStart(testName: string): void {
    console.log(`🚀 Starting test: ${testName}`);
  }

  static logTestStep(step: string): void {
    console.log(`  📝 Step: ${step}`);
  }

  static logTestSuccess(testName: string): void {
    console.log(`✅ Test passed: ${testName}`);
  }

  static logTestFailure(testName: string, error: Error): void {
    console.log(`❌ Test failed: ${testName}`);
    console.log(`   Error: ${error.message}`);
  }
}
```

### 7.2. МОНИТОРИНГ ПРОИЗВОДИТЕЛЬНОСТИ

#### 7.2.1. Performance Metrics
```typescript
// ✅ Хорошо - метрики производительности
export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map();

  static startTimer(operation: string): () => void {
    const startTime = Date.now();
    
    return () => {
      const duration = Date.now() - startTime;
      this.recordMetric(operation, duration);
    };
  }

  static recordMetric(operation: string, value: number): void {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    this.metrics.get(operation)!.push(value);
  }

  static getMetrics(): Map<string, { avg: number; min: number; max: number }> {
    const result = new Map();
    
    for (const [operation, values] of this.metrics) {
      result.set(operation, {
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values)
      });
    }
    
    return result;
  }
}
```

### 7.3. ОТЛАДОЧНЫЕ ИНСТРУМЕНТЫ

#### 7.3.1. Debug Helpers
```typescript
// ✅ Хорошо - помощники для отладки
export class DebugHelpers {
  static async takeScreenshot(page: Page, name: string): Promise<void> {
    await page.screenshot({ 
      path: `debug-screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }

  static async logPageInfo(page: Page): Promise<void> {
    const url = page.url();
    const title = await page.title();
    const viewport = page.viewportSize();
    
    console.log('Page Info:', {
      url,
      title,
      viewport
    });
  }

  static async logElementInfo(page: Page, selector: string): Promise<void> {
    const element = page.locator(selector);
    const count = await element.count();
    const isVisible = await element.isVisible();
    const text = await element.textContent();
    
    console.log('Element Info:', {
      selector,
      count,
      isVisible,
      text: text?.substring(0, 100)
    });
  }
}
```

---

## 8. ПРОИЗВОДИТЕЛЬНОСТЬ

### 8.1. ОПТИМИЗАЦИЯ СЕЛЕКТОРОВ

#### 8.1.1. Efficient Selectors
```typescript
// ❌ Плохо - медленные селекторы
page.locator('div[class*="game-card"] button[data-testid="play"]')
page.locator('body > div > div > div > div > div > button')

// ✅ Хорошо - быстрые селекторы
page.locator('[data-testid="play-game-button"]')
page.locator('#play-button')
```

#### 8.1.2. Selector Optimization
```typescript
// ✅ Хорошо - оптимизированные селекторы
export class OptimizedSelectors {
  // Кэш для часто используемых селекторов
  private static cache = new Map<string, string>();

  static getGameCardSelector(gameTitle: string): string {
    const cacheKey = `game-card-${gameTitle}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const selector = `[data-testid="game-card"][data-title="${gameTitle}"]`;
    this.cache.set(cacheKey, selector);
    
    return selector;
  }
}
```

### 8.2. ПАРАЛЛЕЛЬНОЕ ВЫПОЛНЕНИЕ

#### 8.2.1. Parallel Test Configuration
```typescript
// ✅ Хорошо - конфигурация для параллельного выполнения
export default defineConfig({
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 2 : 1,
  
  // Оптимизация для параллельного выполнения
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  }
});
```

#### 8.2.2. Test Isolation
```typescript
// ✅ Хорошо - изоляция тестов
test.describe('Game Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Каждый тест получает чистую страницу
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async ({ page }) => {
    // Очистка после каждого теста
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });
});
```

### 8.3. КЭШИРОВАНИЕ

#### 8.3.1. Test Data Caching
```typescript
// ✅ Хорошо - кэширование тестовых данных
export class TestDataCache {
  private static cache = new Map<string, any>();
  private static ttl = new Map<string, number>();

  static set<T>(key: string, value: T, ttlMs: number = 300000): void {
    this.cache.set(key, value);
    this.ttl.set(key, Date.now() + ttlMs);
  }

  static get<T>(key: string): T | undefined {
    const expiry = this.ttl.get(key);
    
    if (expiry && Date.now() > expiry) {
      this.cache.delete(key);
      this.ttl.delete(key);
      return undefined;
    }

    return this.cache.get(key);
  }
}
```

---

## ЗАКЛЮЧЕНИЕ

Следование этим лучшим практикам обеспечит:

- 🎯 **Высокую стабильность** тестов
- 🚀 **Оптимальную производительность**
- 🔧 **Легкость поддержки** и расширения
- 📈 **Масштабируемость** для роста команды

**Ключевые принципы:**
1. **Четкая структура** проекта
2. **Правильная организация** тестов
3. **Эффективное управление** состояниями
4. **Гибкие конфигурации**
5. **Стабильные паттерны** проектирования
6. **Комплексная отладка** и мониторинг

Применение этих практик создаст **прочную основу** для долгосрочного успеха проекта автоматизированного тестирования.
