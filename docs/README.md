# LUCKY E2E AUTOMATION - ДОКУМЕНТАЦИЯ
## Полное руководство по проекту автоматизированного тестирования

**Версия:** 1.0  
**Дата обновления:** 2024-12-19  
**Автор:** Head of AQA  
**Технологии:** Playwright + TypeScript + Node.js  

---

## 📋 СОДЕРЖАНИЕ

1. [Обзор проекта](#-обзор-проекта)
2. [Быстрый старт](#-быстрый-старт)
3. [Архитектура](#-архитектура)
4. [Документация](#-документация)
5. [Руководства](#-руководства)
6. [Примеры](#-примеры)
7. [Контрибьюция](#-контрибьюция)

---

## 🎯 ОБЗОР ПРОЕКТА

**Lucky E2E Automation** - это enterprise-grade фреймворк для автоматизированного тестирования веб-приложения казино, построенный на Playwright и TypeScript.

### Ключевые особенности:
- 🏗️ **Модульная архитектура** с применением SOLID принципов
- 🎮 **Специализированные тесты** для игровых сценариев
- 🌍 **Мульти-региональность** с поддержкой геолокации
- 🔐 **Гибкая авторизация** с global setup и без
- 📊 **Комплексная отчетность** с метриками качества
- 🚀 **Высокая производительность** с параллельным выполнением

### Технологический стек:
- **Playwright** - основной фреймворк для E2E тестирования
- **TypeScript** - типобезопасность и лучшая разработка
- **Node.js** - среда выполнения
- **ESLint + Prettier** - качество кода
- **Allure Report** - детальная отчетность

---

## 🚀 БЫСТРЫЙ СТАРТ

### Предварительные требования
- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Установка
```bash
# Клонирование репозитория
git clone https://github.com/lucky-team/lucky-E2E-automation.git
cd lucky-e2e-automation

# Установка зависимостей
npm install

# Установка браузеров Playwright
npm run test:install
```

### Запуск тестов
```bash
# Все тесты
npm run test

# Только smoke тесты
npm run test:smoke

# С UI интерфейсом
npm run test:ui

# Отладка
npm run test:debug
```

### Настройка окружения
```bash
# Копирование примера конфигурации
cp env.example .env

# Редактирование переменных окружения
nano .env
```

---

## 🏗️ АРХИТЕКТУРА

### Структура проекта
```
lucky-e2e-automation/
├── src/                          # Исходный код
│   ├── core/                     # Базовые абстракции
│   │   ├── abstract/            # Абстрактные классы
│   │   ├── interfaces/          # Интерфейсы
│   │   ├── factories/           # Фабрики
│   │   └── utils/               # Утилиты
│   ├── components/              # UI компоненты
│   │   ├── atoms/               # Атомарные компоненты
│   │   ├── molecules/           # Молекулярные компоненты
│   │   └── organisms/           # Организменные компоненты
│   ├── services/                # Бизнес-логика
│   │   ├── game/                # Игровые сервисы
│   │   ├── user/                # Пользовательские сервисы
│   │   └── payment/             # Платежные сервисы
│   ├── pages/                   # Page Objects
│   ├── types/                   # TypeScript типы
│   └── setup/                   # Глобальная настройка
├── tests/                       # Тестовые файлы
│   ├── smoke/                   # Критические тесты
│   ├── regression/              # Регрессионные тесты
│   ├── integration/             # Интеграционные тесты
│   └── e2e/                     # End-to-end тесты
├── docs/                        # Документация
└── config/                      # Конфигурационные файлы
```

### Принципы архитектуры
- **Layered Architecture** - четкое разделение слоев
- **SOLID Principles** - следование принципам SOLID
- **Dependency Injection** - инверсия зависимостей
- **Factory Pattern** - создание объектов через фабрики
- **Observer Pattern** - уведомления о событиях

---

## 📚 ДОКУМЕНТАЦИЯ

### Основные документы

#### 1. [Технический аудит](./TECHNICAL_AUDIT_REPORT.md)
Полный анализ текущего состояния проекта с оценкой архитектуры, качества кода и рекомендациями по улучшению.

**Содержание:**
- Анализ текущей архитектуры
- Оценка соответствия best practices
- Выявление проблем и узких мест
- Рекомендации по улучшению

#### 2. [Архитектурный анализ](./ARCHITECTURE_ANALYSIS.md)
Детальный анализ архитектуры проекта с диаграммами и объяснением компонентов.

**Содержание:**
- Схема архитектуры
- Анализ компонентов
- Паттерны проектирования
- Метрики качества

#### 3. [План рефакторинга](./REFACTORING_ROADMAP.md)
Пошаговый план улучшения проекта с временными рамками и метриками успеха.

**Содержание:**
- Фазы рефакторинга
- Конкретные задачи
- Временные рамки
- Критерии успеха

#### 4. [Руководство по лучшим практикам](./BEST_PRACTICES_GUIDE.md)
Подробное руководство по написанию качественных автотестов.

**Содержание:**
- Структура проекта
- Организация тестов
- Управление состояниями
- Паттерны и анти-паттерны

#### 5. [Примеры кода](./CODE_EXAMPLES.md)
Практические примеры кода, шаблоны и рецепты для разработки.

**Содержание:**
- Примеры до/после рефакторинга
- Шаблоны для новых тестов
- Примеры обработки ошибок
- Шаблоны конфигураций

---

## 📖 РУКОВОДСТВА

### Для разработчиков

#### Начало работы
1. [Быстрый старт](#-быстрый-старт) - установка и первый запуск
2. [Настройка окружения](./docs/guides/getting-started.md) - конфигурация проекта
3. [Структура проекта](./docs/guides/project-structure.md) - понимание архитектуры

#### Разработка тестов
1. [Добавление новых тестов](./docs/guides/adding-new-tests.md) - создание тестов
2. [Page Object Pattern](./docs/guides/page-object-pattern.md) - работа со страницами
3. [Компоненты](./docs/guides/components.md) - создание переиспользуемых компонентов

#### Отладка и мониторинг
1. [Отладка тестов](./docs/guides/debugging.md) - поиск и исправление ошибок
2. [Логирование](./docs/guides/logging.md) - система логирования
3. [Метрики качества](./docs/guides/quality-metrics.md) - отслеживание качества

### Для QA инженеров

#### Тестирование
1. [Запуск тестов](./docs/guides/running-tests.md) - различные способы запуска
2. [Анализ результатов](./docs/guides/analyzing-results.md) - работа с отчетами
3. [Настройка CI/CD](./docs/guides/ci-cd-setup.md) - автоматизация

#### Поддержка
1. [Устранение неполадок](./docs/guides/troubleshooting.md) - решение проблем
2. [Обновление зависимостей](./docs/guides/updating-dependencies.md) - поддержка актуальности
3. [Миграция](./docs/guides/migration.md) - обновление версий

---

## 💡 ПРИМЕРЫ

### Базовые примеры

#### Простой smoke тест
```typescript
import { test, expect } from '@playwright/test';
import { GamePage } from '@/pages/GamePage';

test('should open game successfully', async ({ page }) => {
  const gamePage = new GamePage(page);
  
  await gamePage.navigate();
  await gamePage.openGame('Book of Dead');
  
  expect(await gamePage.isGameLoaded()).toBe(true);
});
```

#### Тест с авторизацией
```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '@/pages/LoginPage';
import { GamePage } from '@/pages/GamePage';

test('should open game after login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const gamePage = new GamePage(page);
  
  await loginPage.navigate();
  await loginPage.login('user@example.com', 'password123');
  
  await gamePage.navigate();
  await gamePage.openGame('Book of Dead');
  
  expect(await gamePage.isGameLoaded()).toBe(true);
});
```

### Продвинутые примеры

#### Тест с retry логикой
```typescript
import { test, expect } from '@playwright/test';
import { RetryManager } from '@/core/retry/RetryManager';
import { GamePage } from '@/pages/GamePage';

test('should open game with retry', async ({ page }) => {
  const gamePage = new GamePage(page);
  
  await RetryManager.retryWithBackoff(async () => {
    await gamePage.navigate();
    await gamePage.openGame('Book of Dead');
    expect(await gamePage.isGameLoaded()).toBe(true);
  });
});
```

#### Тест с кастомными данными
```typescript
import { test, expect } from '@playwright/test';
import { TestDataFactory } from '@/utils/TestDataFactory';
import { LoginPage } from '@/pages/LoginPage';

test('should login with generated data', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const user = TestDataFactory.createUser();
  
  await loginPage.navigate();
  await loginPage.login(user.email, user.password);
  
  expect(await loginPage.isLoggedIn()).toBe(true);
});
```

---

## 🤝 КОНТРИБЬЮЦИЯ

### Как внести вклад

1. **Fork** репозитория
2. Создайте **feature branch** (`git checkout -b feature/amazing-feature`)
3. Внесите изменения и добавьте тесты
4. Запустите проверки (`npm run lint` и `npm run test`)
5. Сделайте **commit** (`git commit -m 'Add amazing feature'`)
6. Сделайте **push** (`git push origin feature/amazing-feature`)
7. Создайте **Pull Request**

### Стандарты кода

- Следуйте [руководству по стилю кода](./docs/guides/code-style.md)
- Используйте TypeScript для типобезопасности
- Покрывайте новый код тестами
- Документируйте публичные API

### Процесс ревью

1. **Автоматические проверки** - линтеры и тесты
2. **Code review** - ревью кода коллегами
3. **Тестирование** - проверка на разных окружениях
4. **Документация** - обновление документации

---

## 📞 ПОДДЕРЖКА

### Получение помощи

- 📖 **Документация** - изучите документацию в папке `docs/`
- 🐛 **Issues** - создайте issue для багов и предложений
- 💬 **Discussions** - обсуждения в GitHub Discussions
- 📧 **Email** - свяжитесь с командой напрямую

### Полезные ссылки

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)

---

## 📄 ЛИЦЕНЗИЯ

Этот проект лицензирован под лицензией ISC - см. файл [LICENSE](LICENSE) для деталей.

---

## 🙏 БЛАГОДАРНОСТИ

- Команде **Playwright** за отличный фреймворк
- Команде **TypeScript** за типобезопасность
- Всем **контрибьюторам** проекта

---

**Последнее обновление:** 2024-12-19  
**Версия документации:** 1.0  
**Статус проекта:** Активная разработка
