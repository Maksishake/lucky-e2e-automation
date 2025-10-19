# БЫСТРЫЙ СТАРТ - РЕФАКТОРИНГ ПРОЕКТА
## Что делать прямо сейчас

**Время выполнения:** 30 минут  
**Приоритет:** КРИТИЧЕСКИЙ  

---

## 🚨 НЕМЕДЛЕННЫЕ ДЕЙСТВИЯ

### 1. Исправить критические ошибки (5 минут)

```bash
# Перейти в папку проекта
cd /Users/maks/lucky-e2e-automation

# Исправить импорты
find src -name "*.ts" -exec sed -i "s|from '../../types/game.types'|from '@/types/game.types'|g" {} \;

# Проверить компиляцию
npx tsc --noEmit
```

### 2. Создать базовые папки (2 минуты)

```bash
# Создать структуру папок
mkdir -p src/core/selectors
mkdir -p src/core/constants
mkdir -p src/services/game/base
mkdir -p src/services/game/infrastructure
mkdir -p src/services/game/domain
```

### 3. Создать базовые файлы (20 минут)

#### Файл 1: `src/core/selectors/GameSelectors.ts`

```typescript
export class GameSelectors {
  static readonly GAME_CARDS = '.game-card, .card-game, [data-testid="game-card"]';
  static readonly GAME_TITLE = '.title, .game-title, [data-testid="game-title"]';
  static readonly GAME_PROVIDER = '.provider, .game-provider, [data-testid="game-provider"]';
  static readonly GAME_IMAGE = 'img, .game-image, [data-testid="game-image"]';
  static readonly PLAY_BUTTON = '.btn-play, .play-button, [data-testid="play-button"]';
  static readonly DEMO_BUTTON = '.btn-demo, .demo-button, [data-testid="demo-button"]';
  static readonly GAME_IFRAME = 'iframe[src*="game"], iframe[src*="play"], iframe.game-iframe';
  static readonly CANVAS = 'canvas';
  static readonly CANVAS_WRAPPER = '#__canvas_wrapper__ canvas, div[id*="canvas"] canvas';
  static readonly ERROR_SELECTORS = [
    '.error-message',
    '.game-error',
    '[data-testid="error"]',
    '#sub-frame-error',
    '.blocked-message'
  ];
}
```

#### Файл 2: `src/core/constants/GameConstants.ts`

```typescript
export class GameConstants {
  static readonly TIMEOUTS = {
    DEFAULT: 10000,
    GAME_LOAD: 15000,
    STABILITY_CHECK: 2000,
    IFRAME_WAIT: 5000,
    CANVAS_WAIT: 1000
  };
  
  static readonly URL_PATTERNS = {
    GAME_PLAY: '/play/real/',
    HOME: '/',
    DEMO: '/play/demo/'
  };
  
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
  
  static readonly LIMITS = {
    MAX_GAMES: 20,
    MAX_RETRIES: 3,
    MAX_STABILITY_CHECKS: 10
  };
}
```

#### Файл 3: `src/services/game/base/BaseGameService.ts`

```typescript
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
  
  protected async waitForTimeout(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
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

### 4. Проверить работу (3 минуты)

```bash
# Проверить компиляцию
npx tsc --noEmit

# Запустить тесты
npx playwright test tests/smoke/game-stability.spec.ts --headed
```

---

## ✅ РЕЗУЛЬТАТ

После выполнения этих действий:

- ✅ **Исправлены** критические ошибки импортов
- ✅ **Создана** базовая инфраструктура
- ✅ **Подготовлена** основа для рефакторинга
- ✅ **Тесты** должны работать без ошибок

---

## 🚀 СЛЕДУЮЩИЕ ШАГИ

1. **Запустить тесты** и убедиться, что они работают
2. **Создать infrastructure сервисы** (GameIframeService, GameCanvasService)
3. **Создать domain сервисы** (упрощенные версии)
4. **Создать orchestrator** (упрощенная версия)
5. **Мигрировать тесты** на новую архитектуру

---

## ⚠️ ВАЖНО

- **НЕ УДАЛЯЙТЕ** существующие файлы
- **СОЗДАВАЙТЕ** новые файлы параллельно
- **ТЕСТИРУЙТЕ** каждый шаг
- **ДЕЛАЙТЕ** коммиты после каждого успешного шага

---

## 📞 ЕСЛИ ЧТО-ТО НЕ РАБОТАЕТ

1. **Проверьте** консоль на ошибки
2. **Посмотрите** логи тестов
3. **Убедитесь**, что все файлы созданы
4. **Проверьте**, что все импорты правильные

**Главное:** Не паникуйте! Все проблемы решаемы. Просто следуйте плану пошагово.
