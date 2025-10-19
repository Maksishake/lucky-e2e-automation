# GamePage - Документация по использованию

## Обзор

`GamePage` - это класс для работы со страницей игры, который следует паттернам Page Object Model и архитектуре проекта. Предоставляет все необходимые методы и функции для взаимодействия с элементами страницы игры.

## Структура класса

### Основные компоненты

1. **Хлебные крошки** - навигация по сайту
2. **Панель управления** - переключение режимов, кнопки управления
3. **Iframe игры** - основная игровая область
4. **Мобильная панель** - элементы для мобильных устройств
5. **Секция рекомендаций** - похожие игры

### Селекторы

Класс использует централизованные селекторы для всех элементов:

```typescript
// Основные контейнеры
get gameContainer(): Locator
get gameIframe(): Locator

// Хлебные крошки
get breadcrumbs(): Locator
get breadcrumbItems(): Locator

// Панель управления
get gameModeToggle(): Locator
get fullscreenButton(): Locator
get favoriteButton(): Locator
get closeGameButton(): Locator

// Карточки игр
get gameCards(): Locator
get gameCardTitles(): Locator
get realGameButtons(): Locator
get demoGameButtons(): Locator
```

## Основные методы

### Работа с хлебными крошками

```typescript
// Получить все хлебные крошки
const breadcrumbs = await gamePage.getBreadcrumbs();

// Кликнуть по хлебной крошке
await gamePage.clickBreadcrumb(0);

// Получить текст хлебной крошки
const text = await gamePage.getBreadcrumbText(0);
```

### Управление режимом игры

```typescript
// Проверить текущий режим
const isRealMode = await gamePage.isRealModeEnabled();

// Переключить режим
await gamePage.toggleGameMode();

// Установить конкретный режим
await gamePage.setRealMode();
await gamePage.setDemoMode();
```

### Работа с iframe

```typescript
// Проверить видимость iframe
const isVisible = await gamePage.isGameIframeVisible();

// Получить источник iframe
const src = await gamePage.getGameIframeSrc();

// Дождаться загрузки iframe
await gamePage.waitForGameIframeToLoad();
```

### Управление кнопками

```typescript
// Полноэкранный режим
await gamePage.clickFullscreen();
await gamePage.clickFullscreenWide();

// Избранное
await gamePage.toggleFavorite();

// Закрыть игру
await gamePage.closeGame();
```

### Работа с рекомендациями

```typescript
// Получить количество рекомендаций
const count = await gamePage.getRecommendationsCount();

// Получить все карточки игр
const cards = await gamePage.getAllGameCards();

// Получить конкретную карточку
const card = await gamePage.getGameCardByIndex(0);

// Найти игру по названию
const index = await gamePage.findGameCardByTitle('Aztec Gems');

// Найти игру по провайдеру
const index = await gamePage.findGameCardByProvider('Pragmatic Play');
```

### Взаимодействие с карточками игр

```typescript
// Кликнуть по кнопке избранного
await gamePage.clickGameCardFavorite(0);

// Кликнуть по кнопке реальной игры
await gamePage.clickGameCardRealButton(0);

// Кликнуть по кнопке демо игры
await gamePage.clickGameCardDemoButton(0);
```

### Навигация по слайдеру

```typescript
// Кликнуть по стрелке "Далее"
await gamePage.clickNextArrow();

// Кликнуть по стрелке "Назад"
await gamePage.clickPrevArrow();

// Кликнуть "Просмотреть все"
await gamePage.clickViewAll();
```

### Валидация и проверки

```typescript
// Проверить загрузку страницы
const isLoaded = await gamePage.isGamePageLoaded();

// Дождаться загрузки страницы
await gamePage.waitForGamePageToLoad();

// Валидировать страницу
const isValid = await gamePage.validateGamePage();
```

### Утилиты

```typescript
// Прокрутить к рекомендациям
await gamePage.scrollToRecommendations();

// Сделать скриншот
const screenshot = await gamePage.takeGamePageScreenshot('test');
```

## Пример использования

```typescript
import { test, expect } from '@playwright/test';
import { GamePage } from '@/components/pages/game.page';
import { logger } from '@/core/logger';

test('Game page interaction example', async ({ page }) => {
  const gamePage = new GamePage(page, logger);
  
  // Переходим на страницу игры
  await page.goto('https://luckycoin777.live/play/real/gates-of-olympus');
  
  // Ждем загрузки страницы
  await gamePage.waitForGamePageToLoad();
  
  // Проверяем, что страница загрузилась
  const isLoaded = await gamePage.isGamePageLoaded();
  expect(isLoaded).toBe(true);
  
  // Получаем хлебные крошки
  const breadcrumbs = await gamePage.getBreadcrumbs();
  expect(breadcrumbs.length).toBeGreaterThan(0);
  
  // Проверяем режим игры
  const isRealMode = await gamePage.isRealModeEnabled();
  expect(isRealMode).toBe(true);
  
  // Получаем рекомендации
  const recommendations = await gamePage.getAllGameCards();
  expect(recommendations.length).toBeGreaterThan(0);
  
  // Ищем конкретную игру
  const gameIndex = await gamePage.findGameCardByTitle('Aztec Gems');
  if (gameIndex !== null) {
    await gamePage.clickGameCardRealButton(gameIndex);
  }
});
```

## Типы данных

### GameCardInfo

```typescript
interface GameCardInfo {
  title: string;           // Название игры
  subtitle: string;        // Провайдер
  image: string;          // URL изображения
  isFavorite: boolean;    // В избранном ли
  hasRealButton: boolean; // Есть ли кнопка реальной игры
  hasDemoButton: boolean; // Есть ли кнопка демо игры
}
```

### BreadcrumbInfo

```typescript
interface BreadcrumbInfo {
  text: string;      // Текст хлебной крошки
  href?: string;     // Ссылка (если есть)
  isActive: boolean; // Активна ли
}
```

## Логирование

Класс использует систему логирования проекта:

```typescript
// Создание с кастомным логгером
const gamePage = new GamePage(page, customLogger);

// Создание с дефолтным логгером
const gamePage = new GamePage(page);
```

Все действия логируются с соответствующими уровнями:
- `logStep` - информационные сообщения
- `logSuccess` - успешные операции
- `logError` - ошибки

## Обработка ошибок

Все методы включают обработку ошибок:

```typescript
try {
  await gamePage.clickGameCardRealButton(0);
} catch (error) {
  // Ошибка будет залогирована автоматически
  // Можно добавить дополнительную обработку
}
```

## Производительность

- Все селекторы кэшируются
- Используются эффективные методы Playwright
- Минимальное количество ожиданий
- Оптимизированные селекторы

## Совместимость

- Playwright 1.40+
- TypeScript 4.9+
- Node.js 16+

## Поддержка

При возникновении проблем:

1. Проверьте логи в консоли
2. Убедитесь, что страница загрузилась
3. Проверьте селекторы элементов
4. Обратитесь к документации Playwright
