# ПРИМЕРЫ КОДА И ШАБЛОНЫ
## Lucky E2E Automation - Практические примеры

**Дата создания:** 2024-12-19  
**Автор:** Head of AQA  
**Версия:** 1.0  
**Целевая аудитория:** Junior/Senior AQA Engineers  

---

## СОДЕРЖАНИЕ

1. [Примеры до/после рефакторинга](#1-примеры-до-после-рефакторинга)
2. [Шаблоны для новых тестов](#2-шаблоны-для-новых-тестов)
3. [Примеры обработки ошибок](#3-примеры-обработки-ошибок)
4. [Шаблоны конфигураций](#4-шаблоны-конфигураций)
5. [Примеры компонентов](#5-примеры-компонентов)
6. [Примеры сервисов](#6-примеры-сервисов)

---

## 1. ПРИМЕРЫ ДО/ПОСЛЕ РЕФАКТОРИНГА

### 1.1. УЛУЧШЕНИЕ PAGE OBJECT

#### До рефакторинга:
```typescript
// ❌ Плохо - все в одном методе
test('should open game', async ({ page }) => {
  await page.goto('/games');
  await page.waitForSelector('.game-card');
  await page.click('.game-card:first-child');
  await page.waitForSelector('iframe[src*="game"]');
  await expect(page.locator('iframe[src*="game"]')).toBeVisible();
});
```

#### После рефакторинга:
```typescript
// ✅ Хорошо - использование Page Object
test('should open game', async ({ page }) => {
  const gamePage = new GamePage(page);
  
  await gamePage.navigate();
  await gamePage.selectFirstGame();
  await gamePage.waitForGameToLoad();
  
  expect(await gamePage.isGameLoaded()).toBe(true);
});

// GamePage.ts
export class GamePage extends BasePage {
  private readonly gameGrid: GameGridComponent;
  private readonly gameIframe: Locator;

  constructor(page: Page) {
    super(page, 'GamePage', '/games');
    this.gameGrid = new GameGridComponent(page);
    this.gameIframe = page.locator('iframe[src*="game"]');
  }

  async selectFirstGame(): Promise<void> {
    await this.gameGrid.selectGameByIndex(0);
  }

  async waitForGameToLoad(): Promise<void> {
    await this.gameIframe.waitFor({ state: 'visible' });
  }

  async isGameLoaded(): Promise<boolean> {
    return await this.gameIframe.isVisible();
  }
}
```

### 1.2. УЛУЧШЕНИЕ ОБРАБОТКИ ОШИБОК

#### До рефакторинга:
```typescript
// ❌ Плохо - отсутствие обработки ошибок
async openGame(gameTitle: string) {
  await this.page.click(`[data-game="${gameTitle}"]`);
  await this.page.waitForSelector('iframe');
}
```

#### После рефакторинга:
```typescript
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
    
    this.logger.info('GameService', `Game opened successfully: ${gameTitle}`);
    return { success: true };
    
  } catch (error) {
    this.logger.error('GameService', `Failed to open game: ${error}`);
    return { success: false, error: error.message };
  }
}

private async findGameElement(gameTitle: string): Promise<Locator | null> {
  try {
    const selector = `[data-game="${gameTitle}"]`;
    await this.page.waitForSelector(selector, { timeout: 5000 });
    return this.page.locator(selector);
  } catch {
    return null;
  }
}

private async waitForGameToLoad(): Promise<void> {
  await this.page.waitForSelector('iframe[src*="game"]', { timeout: 10000 });
}
```

### 1.3. УЛУЧШЕНИЕ СТРУКТУРЫ ТЕСТОВ

#### До рефакторинга:
```typescript
// ❌ Плохо - дублирование кода
test('should login with valid email', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#email', 'test@example.com');
  await page.fill('#password', 'password123');
  await page.click('#login-button');
  await expect(page.locator('.success-message')).toBeVisible();
});

test('should login with valid phone', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#phone', '+380123456789');
  await page.fill('#password', 'password123');
  await page.click('#login-button');
  await expect(page.locator('.success-message')).toBeVisible();
});
```

#### После рефакторинга:
```typescript
// ✅ Хорошо - переиспользование кода
test.describe('Login Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('should login with valid email', async () => {
    const user = TestDataFactory.createUser({ email: 'test@example.com' });
    await loginPage.login(user.email, user.password);
    await expect(loginPage.successMessage).toBeVisible();
  });

  test('should login with valid phone', async () => {
    const user = TestDataFactory.createUser({ phone: '+380123456789' });
    await loginPage.loginWithPhone(user.phone, user.password);
    await expect(loginPage.successMessage).toBeVisible();
  });
});
```

---

## 2. ШАБЛОНЫ ДЛЯ НОВЫХ ТЕСТОВ

### 2.1. ШАБЛОН SMOKE ТЕСТА

```typescript
// tests/smoke/example-smoke.spec.ts
import { test, expect } from '@playwright/test';
import { GamePage } from '@/pages/GamePage';
import { TestData } from '@/utils/TestData';

test.describe('Game Smoke Tests', () => {
  let gamePage: GamePage;

  test.beforeEach(async ({ page }) => {
    gamePage = new GamePage(page);
    await gamePage.navigate();
  });

  test('should open game successfully', async () => {
    // Arrange
    const gameTitle = TestData.getGameTitle();
    
    // Act
    await gamePage.openGame(gameTitle);
    
    // Assert
    expect(await gamePage.isGameLoaded()).toBe(true);
  });

  test('should display game grid', async () => {
    // Arrange & Act
    await gamePage.waitForGameGrid();
    
    // Assert
    expect(await gamePage.isGameGridVisible()).toBe(true);
    expect(await gamePage.getGameCount()).toBeGreaterThan(0);
  });
});
```

### 2.2. ШАБЛОН COMPONENT ТЕСТА

```typescript
// tests/unit/game-filter.component.spec.ts
import { test, expect } from '@playwright/test';
import { GameFilterComponent } from '@/components/GameFilterComponent';

test.describe('Game Filter Component', () => {
  let filterComponent: GameFilterComponent;

  test.beforeEach(async ({ page }) => {
    filterComponent = new GameFilterComponent(page);
    await page.goto('/games');
  });

  test('should filter games by provider', async () => {
    // Arrange
    const provider = 'Play\'n GO';
    
    // Act
    await filterComponent.selectProvider(provider);
    
    // Assert
    expect(await filterComponent.getSelectedProvider()).toBe(provider);
    expect(await filterComponent.getFilteredGameCount()).toBeGreaterThan(0);
  });

  test('should clear all filters', async () => {
    // Arrange
    await filterComponent.selectProvider('Play\'n GO');
    await filterComponent.selectCategory('slots');
    
    // Act
    await filterComponent.clearAllFilters();
    
    // Assert
    expect(await filterComponent.hasActiveFilters()).toBe(false);
  });
});
```

### 2.3. ШАБЛОН INTEGRATION ТЕСТА

```typescript
// tests/integration/payment-flow.spec.ts
import { test, expect } from '@playwright/test';
import { PaymentPage } from '@/pages/PaymentPage';
import { GamePage } from '@/pages/GamePage';
import { TestScenarios } from '@/utils/TestScenarios';

test.describe('Payment Integration Flow', () => {
  test('should complete full payment flow', async ({ page }) => {
    // Arrange
    const gamePage = new GamePage(page);
    const paymentPage = new PaymentPage(page);
    const paymentData = TestDataFactory.createPaymentData();

    // Act & Assert
    await TestScenarios.loginAsUser(page, TestDataFactory.createUser());
    await TestScenarios.openGameAndVerify(page, 'Book of Dead');
    await TestScenarios.completePaymentFlow(page, paymentData.amount);
    
    // Verify final state
    expect(await paymentPage.isPaymentSuccessful()).toBe(true);
  });
});
```

### 2.4. ШАБЛОН E2E ТЕСТА

```typescript
// tests/e2e/complete-user-journey.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '@/pages/LoginPage';
import { GamePage } from '@/pages/GamePage';
import { PaymentPage } from '@/pages/PaymentPage';

test.describe('Complete User Journey', () => {
  test('should complete full user journey', async ({ page }) => {
    // Step 1: Login
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('user@example.com', 'password123');
    await expect(loginPage.successMessage).toBeVisible();

    // Step 2: Browse games
    const gamePage = new GamePage(page);
    await gamePage.navigate();
    await gamePage.filterByProvider('Play\'n GO');
    await expect(gamePage.getGameCount()).toBeGreaterThan(0);

    // Step 3: Open game
    await gamePage.openGame('Book of Dead');
    await expect(gamePage.isGameLoaded()).toBe(true);

    // Step 4: Make payment
    const paymentPage = new PaymentPage(page);
    await paymentPage.navigate();
    await paymentPage.selectAmount(100);
    await paymentPage.submitPayment();
    await expect(paymentPage.isPaymentSuccessful()).toBe(true);
  });
});
```

---

## 3. ПРИМЕРЫ ОБРАБОТКИ ОШИБОК

### 3.1. RETRY С ЭКСПОНЕНЦИАЛЬНОЙ ЗАДЕРЖКОЙ

```typescript
// src/core/retry/RetryManager.ts
export class RetryManager {
  static async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000,
    backoffMultiplier: number = 2
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < maxRetries - 1) {
          const delay = baseDelay * Math.pow(backoffMultiplier, attempt);
          console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError!;
  }

  static async retryWithCondition<T>(
    operation: () => Promise<T>,
    condition: (error: Error) => boolean,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (!condition(lastError) || attempt === maxRetries - 1) {
          throw lastError;
        }

        console.log(`Attempt ${attempt + 1} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    throw lastError!;
  }
}

// Использование
await RetryManager.retryWithBackoff(async () => {
  await page.click('[data-testid="submit-button"]');
  await page.waitForSelector('.success-message');
});
```

### 3.2. УМНАЯ ОБРАБОТКА СЕТЕВЫХ ОШИБОК

```typescript
// src/core/error/NetworkErrorHandler.ts
export class NetworkErrorHandler {
  private static networkErrors = [
    'net::ERR_INTERNET_DISCONNECTED',
    'net::ERR_NETWORK_CHANGED',
    'net::ERR_CONNECTION_RESET',
    'net::ERR_CONNECTION_TIMED_OUT'
  ];

  static isNetworkError(error: Error): boolean {
    return this.networkErrors.some(err => 
      error.message.includes(err)
    );
  }

  static async handleNetworkError(page: Page, error: Error): Promise<boolean> {
    if (!this.isNetworkError(error)) {
      return false;
    }

    console.log('Network error detected, attempting recovery...');

    try {
      // Попытка перезагрузки страницы
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Проверка, что страница загрузилась
      const title = await page.title();
      if (title && title !== '') {
        console.log('Network error recovery successful');
        return true;
      }
    } catch (recoveryError) {
      console.log('Network error recovery failed:', recoveryError);
    }

    return false;
  }
}

// Использование в тестах
try {
  await page.click('[data-testid="submit-button"]');
} catch (error) {
  const recovered = await NetworkErrorHandler.handleNetworkError(page, error as Error);
  if (recovered) {
    // Повторить операцию
    await page.click('[data-testid="submit-button"]');
  } else {
    throw error;
  }
}
```

### 3.3. ОБРАБОТКА ОШИБОК ЭЛЕМЕНТОВ

```typescript
// src/core/error/ElementErrorHandler.ts
export class ElementErrorHandler {
  static async handleElementNotFound(
    page: Page,
    selector: string,
    context: string
  ): Promise<boolean> {
    console.log(`Element not found: ${selector} in context: ${context}`);

    try {
      // Попытка найти элемент с альтернативными селекторами
      const alternativeSelectors = this.getAlternativeSelectors(selector);
      
      for (const altSelector of alternativeSelectors) {
        try {
          await page.waitForSelector(altSelector, { timeout: 2000 });
          console.log(`Found element with alternative selector: ${altSelector}`);
          return true;
        } catch {
          // Продолжаем поиск
        }
      }

      // Попытка подождать дольше
      await page.waitForSelector(selector, { timeout: 10000 });
      return true;
    } catch {
      console.log(`Element still not found after all attempts: ${selector}`);
      return false;
    }
  }

  private static getAlternativeSelectors(selector: string): string[] {
    // Логика для генерации альтернативных селекторов
    const alternatives = [];
    
    if (selector.includes('[data-testid=')) {
      // Попробовать по классу
      alternatives.push(selector.replace('[data-testid=', '[class*='));
    }
    
    if (selector.includes('button')) {
      // Попробовать по тексту
      alternatives.push(`button:has-text("${selector}")`);
    }

    return alternatives;
  }
}
```

---

## 4. ШАБЛОНЫ КОНФИГУРАЦИЙ

### 4.1. DEVELOPMENT КОНФИГУРАЦИЯ

```typescript
// src/config/environments/development.ts
export const developmentConfig = {
  baseURL: 'https://dev.luckycoin777.live',
  timeout: 30000,
  retries: 1,
  workers: 4,
  fullyParallel: true,
  reporter: [
    ['html', { 
      outputFolder: 'playwright-report-dev',
      open: 'never'
    }],
    ['line']
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Дополнительные настройки для разработки
    headless: false,
    slowMo: 100
  }
};
```

### 4.2. PRODUCTION КОНФИГУРАЦИЯ

```typescript
// src/config/environments/production.ts
export const productionConfig = {
  baseURL: 'https://luckycoin777.live',
  timeout: 60000,
  retries: 3,
  workers: 2,
  fullyParallel: true,
  reporter: [
    ['html', { 
      outputFolder: 'playwright-report-prod',
      open: 'never'
    }],
    ['json', { 
      outputFile: 'test-results/prod-results.json'
    }],
    ['junit', {
      outputFile: 'test-results/prod-results.xml'
    }]
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Настройки для продакшена
    headless: true,
    ignoreHTTPSErrors: true
  }
};
```

### 4.3. CI/CD КОНФИГУРАЦИЯ

```typescript
// src/config/environments/ci.ts
export const ciConfig = {
  baseURL: process.env.BASE_URL || 'https://luckycoin777.live',
  timeout: 120000,
  retries: 2,
  workers: process.env.CI_WORKERS ? parseInt(process.env.CI_WORKERS) : 2,
  fullyParallel: true,
  reporter: [
    ['github'],
    ['json', { 
      outputFile: 'test-results/ci-results.json'
    }],
    ['junit', {
      outputFile: 'test-results/ci-results.xml'
    }]
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Настройки для CI
    headless: true,
    ignoreHTTPSErrors: true,
    launchOptions: {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    }
  }
};
```

### 4.4. ДИНАМИЧЕСКАЯ КОНФИГУРАЦИЯ

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
    const baseConfig = this.getBaseConfig();
    
    switch (environment) {
      case 'development':
        return { ...baseConfig, ...developmentConfig };
      case 'production':
        return { ...baseConfig, ...productionConfig };
      case 'ci':
        return { ...baseConfig, ...ciConfig };
      default:
        throw new Error(`Unknown environment: ${environment}`);
    }
  }

  private static getBaseConfig(): PlaywrightConfig {
    return {
      testDir: './tests',
      forbidOnly: !!process.env.CI,
      outputDir: 'test-results/',
      globalSetup: './src/setup/global-setup.ts'
    };
  }

  static updateConfig(updates: Partial<PlaywrightConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  static getEnvironmentVariable(key: string, defaultValue?: string): string {
    const value = process.env[key];
    if (value === undefined && defaultValue === undefined) {
      throw new Error(`Environment variable ${key} is required`);
    }
    return value || defaultValue!;
  }
}
```

---

## 5. ПРИМЕРЫ КОМПОНЕНТОВ

### 5.1. БАЗОВЫЙ КОМПОНЕНТ

```typescript
// src/components/base/BaseComponent.ts
import { Page, Locator } from '@playwright/test';
import { BaseService } from '@/core/abstract/base-service';
import { ILogger } from '@/core/interfaces/logger.interface';

export abstract class BaseComponent extends BaseService {
  protected readonly baseSelector: string;

  constructor(
    page: Page,
    componentName: string,
    baseSelector: string,
    loggerInstance?: ILogger
  ) {
    super(page, componentName, loggerInstance);
    this.baseSelector = baseSelector;
  }

  get rootElement(): Locator {
    return this.page.locator(this.baseSelector);
  }

  async isVisible(): Promise<boolean> {
    return await this.rootElement.isVisible();
  }

  async waitForVisible(timeout: number = 10000): Promise<void> {
    await this.rootElement.waitFor({ state: 'visible', timeout });
  }

  async click(): Promise<void> {
    this.logStep(`Clicking ${this.componentName}`);
    await this.rootElement.click();
    this.logSuccess(`Clicked ${this.componentName}`);
  }

  async getText(): Promise<string> {
    return await this.rootElement.textContent() || '';
  }

  async getAttribute(attributeName: string): Promise<string | null> {
    return await this.rootElement.getAttribute(attributeName);
  }
}
```

### 5.2. КОМПОНЕНТ КНОПКИ

```typescript
// src/components/atoms/Button.ts
import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@/components/base/BaseComponent';

export class Button extends BaseComponent {
  constructor(page: Page, selector: string) {
    super(page, 'Button', selector);
  }

  async click(): Promise<void> {
    await this.waitForVisible();
    await super.click();
  }

  async isEnabled(): Promise<boolean> {
    return await this.rootElement.isEnabled();
  }

  async isDisabled(): Promise<boolean> {
    return !(await this.isEnabled());
  }

  async getButtonText(): Promise<string> {
    return await this.getText();
  }

  async waitForEnabled(timeout: number = 10000): Promise<void> {
    await this.rootElement.waitFor({ state: 'visible', timeout });
    await this.page.waitForFunction(
      (selector) => {
        const element = document.querySelector(selector);
        return element && !element.hasAttribute('disabled');
      },
      this.baseSelector,
      { timeout }
    );
  }
}
```

### 5.3. КОМПОНЕНТ ПОЛЯ ВВОДА

```typescript
// src/components/atoms/Input.ts
import { Page } from '@playwright/test';
import { BaseComponent } from '@/components/base/BaseComponent';

export class Input extends BaseComponent {
  constructor(page: Page, selector: string) {
    super(page, 'Input', selector);
  }

  async fill(value: string): Promise<void> {
    this.logStep(`Filling input with: ${value}`);
    await this.rootElement.fill(value);
    this.logSuccess(`Input filled with: ${value}`);
  }

  async clear(): Promise<void> {
    this.logStep('Clearing input');
    await this.rootElement.clear();
    this.logSuccess('Input cleared');
  }

  async getValue(): Promise<string> {
    return await this.rootElement.inputValue();
  }

  async isRequired(): Promise<boolean> {
    return await this.rootElement.getAttribute('required') !== null;
  }

  async hasError(): Promise<boolean> {
    const classes = await this.getAttribute('class');
    return classes?.includes('error') || classes?.includes('invalid') || false;
  }

  async getErrorMessage(): Promise<string> {
    const errorElement = this.page.locator(`${this.baseSelector} + .error-message`);
    return await errorElement.textContent() || '';
  }
}
```

### 5.4. КОМПОНЕНТ ФОРМЫ

```typescript
// src/components/molecules/LoginForm.ts
import { Page } from '@playwright/test';
import { BaseComponent } from '@/components/base/BaseComponent';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';

export class LoginForm extends BaseComponent {
  private readonly emailInput: Input;
  private readonly passwordInput: Input;
  private readonly submitButton: Button;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page, 'LoginForm', '.login-form');
    this.emailInput = new Input(page, '#email');
    this.passwordInput = new Input(page, '#password');
    this.submitButton = new Button(page, '#submit');
    this.errorMessage = page.locator('.error-message');
  }

  async login(email: string, password: string): Promise<void> {
    this.logStep(`Logging in with email: ${email}`);
    
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    
    this.logSuccess('Login form submitted');
  }

  async loginWithPhone(phone: string, password: string): Promise<void> {
    this.logStep(`Logging in with phone: ${phone}`);
    
    // Переключение на ввод телефона
    await this.page.click('[data-tab="phone"]');
    
    const phoneInput = new Input(this.page, '#phone');
    await phoneInput.fill(phone);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    
    this.logSuccess('Login form submitted with phone');
  }

  async isErrorVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  async isFormValid(): Promise<boolean> {
    const emailValid = !(await this.emailInput.hasError());
    const passwordValid = !(await this.passwordInput.hasError());
    return emailValid && passwordValid;
  }
}
```

---

## 6. ПРИМЕРЫ СЕРВИСОВ

### 6.1. БАЗОВЫЙ СЕРВИС

```typescript
// src/core/abstract/base-service.ts
import { Page } from '@playwright/test';
import { ILogger } from '@/core/interfaces/logger.interface';
import { logger } from '@/core/logger';

export abstract class BaseService {
  protected readonly page: Page;
  protected readonly componentName: string;
  protected readonly logger: ILogger;

  constructor(
    page: Page,
    componentName: string,
    loggerInstance: ILogger = logger
  ) {
    this.page = page;
    this.componentName = componentName;
    this.logger = loggerInstance;
  }

  protected logStep(message: string): void {
    this.logger.info(this.componentName, message);
  }

  protected logSuccess(message: string): void {
    this.logger.info(this.componentName, `✅ ${message}`);
  }

  protected logError(message: string, error?: unknown): void {
    this.logger.error(this.componentName, `❌ ${message}`, error);
  }

  protected logInfo(message: string): void {
    this.logger.info(this.componentName, message);
  }
}
```

### 6.2. СЕРВИС АВТОРИЗАЦИИ

```typescript
// src/services/auth/AuthService.ts
import { Page } from '@playwright/test';
import { BaseService } from '@/core/abstract/base-service';
import { LoginForm } from '@/components/molecules/LoginForm';
import { User } from '@/types/user.types';

export class AuthService extends BaseService {
  private readonly loginForm: LoginForm;

  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'AuthService', loggerInstance);
    this.loginForm = new LoginForm(page);
  }

  async loginWithEmail(email: string, password: string): Promise<AuthResult> {
    this.logStep(`Logging in with email: ${email}`);
    
    try {
      await this.loginForm.login(email, password);
      
      // Проверяем успешность авторизации
      const isLoggedIn = await this.isLoggedIn();
      if (isLoggedIn) {
        this.logSuccess(`Successfully logged in with email: ${email}`);
        return { success: true, user: { email } };
      } else {
        const errorMessage = await this.loginForm.getErrorMessage();
        this.logError(`Login failed: ${errorMessage}`);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      this.logError(`Login failed with error: ${error}`);
      return { success: false, error: error.message };
    }
  }

  async loginWithPhone(phone: string, password: string): Promise<AuthResult> {
    this.logStep(`Logging in with phone: ${phone}`);
    
    try {
      await this.loginForm.loginWithPhone(phone, password);
      
      const isLoggedIn = await this.isLoggedIn();
      if (isLoggedIn) {
        this.logSuccess(`Successfully logged in with phone: ${phone}`);
        return { success: true, user: { phone } };
      } else {
        const errorMessage = await this.loginForm.getErrorMessage();
        this.logError(`Login failed: ${errorMessage}`);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      this.logError(`Login failed with error: ${error}`);
      return { success: false, error: error.message };
    }
  }

  async logout(): Promise<void> {
    this.logStep('Logging out');
    
    try {
      await this.page.click('[data-testid="user-menu"]');
      await this.page.click('[data-testid="logout-button"]');
      await this.page.waitForURL('**/login');
      
      this.logSuccess('Successfully logged out');
    } catch (error) {
      this.logError(`Logout failed: ${error}`);
      throw error;
    }
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      const userMenu = this.page.locator('[data-testid="user-menu"]');
      return await userMenu.isVisible();
    } catch {
      return false;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (!(await this.isLoggedIn())) {
      return null;
    }

    try {
      await this.page.click('[data-testid="user-menu"]');
      const userInfo = await this.page.locator('[data-testid="user-info"]').textContent();
      
      // Парсинг информации о пользователе
      return this.parseUserInfo(userInfo);
    } catch (error) {
      this.logError(`Failed to get current user: ${error}`);
      return null;
    }
  }

  private parseUserInfo(userInfo: string | null): User | null {
    if (!userInfo) return null;
    
    // Логика парсинга информации о пользователе
    // Зависит от структуры UI
    return {
      email: 'parsed@example.com',
      firstName: 'Parsed',
      lastName: 'User'
    };
  }
}
```

### 6.3. СЕРВИС РАБОТЫ С ИГРАМИ

```typescript
// src/services/game/GameService.ts
import { Page } from '@playwright/test';
import { BaseService } from '@/core/abstract/base-service';
import { GameGridComponent } from '@/components/organisms/GameGrid';
import { GameFilterComponent } from '@/components/molecules/GameFilter';
import { GameInfo, GameOpenResult } from '@/types/game.types';

export class GameService extends BaseService {
  private readonly gameGrid: GameGridComponent;
  private readonly gameFilter: GameFilterComponent;

  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'GameService', loggerInstance);
    this.gameGrid = new GameGridComponent(page);
    this.gameFilter = new GameFilterComponent(page);
  }

  async openGame(gameTitle: string, provider?: string): Promise<GameOpenResult> {
    this.logStep(`Opening game: ${gameTitle}${provider ? ` by ${provider}` : ''}`);
    
    try {
      // Применяем фильтр по провайдеру, если указан
      if (provider) {
        await this.gameFilter.selectProvider(provider);
        await this.page.waitForTimeout(1000); // Ждем применения фильтра
      }

      // Находим и открываем игру
      const gameFound = await this.gameGrid.selectGameByTitle(gameTitle);
      if (!gameFound) {
        return { success: false, error: `Game not found: ${gameTitle}` };
      }

      // Ждем загрузки игры
      await this.waitForGameToLoad();
      
      this.logSuccess(`Game opened successfully: ${gameTitle}`);
      return { success: true };
    } catch (error) {
      this.logError(`Failed to open game: ${error}`);
      return { success: false, error: error.message };
    }
  }

  async getAvailableGames(): Promise<GameInfo[]> {
    this.logStep('Getting available games');
    
    try {
      const games = await this.gameGrid.getAllGames();
      this.logSuccess(`Found ${games.length} available games`);
      return games;
    } catch (error) {
      this.logError(`Failed to get available games: ${error}`);
      return [];
    }
  }

  async filterGamesByProvider(provider: string): Promise<void> {
    this.logStep(`Filtering games by provider: ${provider}`);
    
    try {
      await this.gameFilter.selectProvider(provider);
      await this.page.waitForTimeout(1000); // Ждем применения фильтра
      this.logSuccess(`Games filtered by provider: ${provider}`);
    } catch (error) {
      this.logError(`Failed to filter games by provider: ${error}`);
      throw error;
    }
  }

  async clearFilters(): Promise<void> {
    this.logStep('Clearing all filters');
    
    try {
      await this.gameFilter.clearAllFilters();
      await this.page.waitForTimeout(1000); // Ждем применения изменений
      this.logSuccess('All filters cleared');
    } catch (error) {
      this.logError(`Failed to clear filters: ${error}`);
      throw error;
    }
  }

  async isGameLoaded(): Promise<boolean> {
    try {
      const iframe = this.page.locator('iframe[src*="game"]');
      return await iframe.isVisible();
    } catch {
      return false;
    }
  }

  private async waitForGameToLoad(timeout: number = 10000): Promise<void> {
    await this.page.waitForSelector('iframe[src*="game"]', { timeout });
  }
}
```

---

## ЗАКЛЮЧЕНИЕ

Эти примеры кода и шаблоны предоставляют **практическую основу** для разработки стабильных и поддерживаемых автотестов. 

**Ключевые принципы:**
1. **Четкая структура** и разделение ответственности
2. **Комплексная обработка ошибок** с retry логикой
3. **Переиспользуемые компоненты** и сервисы
4. **Гибкие конфигурации** для разных окружений
5. **Детальное логирование** для отладки

Следование этим шаблонам обеспечит **высокое качество** кода и **эффективность** разработки тестов.
