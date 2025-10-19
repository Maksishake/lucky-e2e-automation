# 🏗️ Sidebar Services Architecture - SOLID & OOP

## 📋 Обзор архитектуры

Данный документ описывает полную архитектуру сервисов сайдбара, построенную согласно принципам SOLID и OOP с четким разделением ответственности и иерархией.

## 🎯 Архитектурные принципы

### **1. Single Responsibility Principle (SRP)**
- Каждый класс имеет одну ответственность
- Интерфейсы разделены по функциональности
- Базовые классы содержат только общую логику

### **2. Open/Closed Principle (OCP)**
- Классы открыты для расширения, закрыты для модификации
- Новые сервисы можно добавлять через наследование
- Конфигурация вынесена в отдельные файлы

### **3. Liskov Substitution Principle (LSP)**
- Наследники могут заменять базовые классы
- Интерфейсы реализуются корректно
- Контракты соблюдаются

### **4. Interface Segregation Principle (ISP)**
- Интерфейсы разделены по функциональности
- Клиенты зависят только от нужных методов
- Нет "толстых" интерфейсов

### **5. Dependency Inversion Principle (DIP)**
- Зависимости от абстракций, не от конкретных реализаций
- Фабрика создает объекты через интерфейсы
- Инъекция зависимостей через конструктор

## 📁 Структура архитектуры

```
src/services/sidebar/
├── interfaces/           # Интерфейсы (ISP)
│   ├── ISidebarService.ts
│   ├── ISidebarNavigation.ts
│   ├── ISidebarActions.ts
│   ├── ISidebarSearch.ts
│   └── ISidebarLanguage.ts
├── base/                 # Базовые классы (SRP, OCP)
│   ├── BaseSidebarService.ts
│   ├── BaseSidebarNavigation.ts
│   └── BaseSidebarActions.ts
├── implementations/      # Конкретные реализации (LSP)
│   ├── SidebarNavigationImpl.ts
│   ├── SidebarActionsImpl.ts
│   ├── SidebarSearchImpl.ts
│   └── SidebarLanguageImpl.ts
├── factories/           # Фабрики (DIP)
│   └── SidebarServiceFactory.ts
├── types/              # Типы и конфигурация
│   └── sidebar.types.ts
└── index.ts           # Главный экспорт
```

## 🔧 Компоненты архитектуры

### **1. Интерфейсы (ISP)**

#### **ISidebarService** - Базовый интерфейс
```typescript
interface ISidebarService {
  readonly page: Page;
  readonly serviceName: string;
  execute(itemId: string): Promise<SidebarOperationResult>;
  isAvailable(itemId: string): Promise<boolean>;
  getItemConfig(itemId: string): SidebarItemConfig | null;
}
```

#### **ISidebarNavigation** - Навигация
```typescript
interface ISidebarNavigation {
  navigateToItem(itemId: string): Promise<SidebarOperationResult>;
  isItemActive(itemId: string): Promise<boolean>;
  getCurrentActiveItem(): Promise<SidebarItemConfig | null>;
  getCategories(): SidebarItemConfig[];
  getSections(): SidebarItemConfig[];
}
```

#### **ISidebarActions** - Действия
```typescript
interface ISidebarActions {
  executeAction(actionId: string): Promise<SidebarOperationResult>;
  openPromocode(): Promise<boolean>;
  getMoney(): Promise<boolean>;
  openTelegram(): Promise<boolean>;
  openSupport(): Promise<boolean>;
  getAvailableActions(): SidebarItemConfig[];
}
```

### **2. Базовые классы (SRP, OCP)**

#### **BaseSidebarService** - Общая функциональность
```typescript
abstract class BaseSidebarService extends BaseService implements ISidebarService {
  protected readonly config: SidebarConfig;
  protected readonly items: Map<string, SidebarItemConfig>;
  public readonly serviceName: string;
  public readonly page: Page;
  
  // Общие методы для всех сервисов
  protected initializeItems(): void;
  protected getItemById(itemId: string): SidebarItemConfig | null;
  protected getItemLocator(itemId: string): Locator | null;
  protected createOperationResult(...): SidebarOperationResult;
  
  // Абстрактный метод для реализации в наследниках
  abstract execute(itemId: string): Promise<SidebarOperationResult>;
}
```

#### **BaseSidebarNavigation** - Навигация
```typescript
abstract class BaseSidebarNavigation extends BaseSidebarService implements ISidebarNavigation {
  // Абстрактные методы для реализации
  abstract navigateToItem(itemId: string): Promise<SidebarOperationResult>;
  abstract isItemActive(itemId: string): Promise<boolean>;
  abstract getCurrentActiveItem(): Promise<SidebarItemConfig | null>;
  
  // Реализованные методы
  getCategories(): SidebarItemConfig[];
  getSections(): SidebarItemConfig[];
  
  // Защищенные методы для наследников
  protected async navigateToCategory(categoryId: string): Promise<SidebarOperationResult>;
  protected async navigateToSection(sectionId: string): Promise<SidebarOperationResult>;
  protected async checkItemActive(itemId: string): Promise<boolean>;
}
```

### **3. Конкретные реализации (LSP)**

#### **SidebarNavigationImpl** - Реализация навигации
```typescript
class SidebarNavigationImpl extends BaseSidebarNavigation {
  // Реализация абстрактных методов
  async navigateToItem(itemId: string): Promise<SidebarOperationResult>;
  async isItemActive(itemId: string): Promise<boolean>;
  async getCurrentActiveItem(): Promise<SidebarItemConfig | null>;
  
  // Специфичные методы навигации
  async goToAllGames(): Promise<boolean>;
  async goToPopular(): Promise<boolean>;
  // ... другие методы
}
```

### **4. Фабрика (DIP)**

#### **SidebarServiceFactory** - Создание сервисов
```typescript
class SidebarServiceFactory {
  static createNavigationService(page: Page): ISidebarNavigation;
  static createActionsService(page: Page): ISidebarActions;
  static createSearchService(page: Page): ISidebarSearch;
  static createLanguageService(page: Page): ISidebarLanguage;
  static createAllServices(page: Page): AllServices;
  static createServiceByType(page: Page, type: ServiceType): Service;
}
```

## 🚀 Использование архитектуры

### **1. Создание сервисов через фабрику**

```typescript
// Создание отдельных сервисов
const navigationService = SidebarServiceFactory.createNavigationService(page);
const actionsService = SidebarServiceFactory.createActionsService(page);

// Создание всех сервисов
const services = SidebarServiceFactory.createAllServices(page);
const { navigation, actions, search, language } = services;

// Создание по типу
const service = SidebarServiceFactory.createServiceByType(page, 'navigation');
```

### **2. Использование через компонент**

```typescript
// Создание компонента
const sidebarComponent = new SidebarComponent(page);

// Навигация
await sidebarComponent.goToAllGames();
await sidebarComponent.navigateToItem('popular');

// Действия
await sidebarComponent.openPromocode();
await sidebarComponent.executeAction('telegram');

// Поиск
await sidebarComponent.openSearch();
await sidebarComponent.search('game name');

// Языки
await sidebarComponent.changeLanguage('en');
const currentLang = await sidebarComponent.getCurrentLanguage();
```

### **3. Прямое использование сервисов**

```typescript
// Создание сервиса
const navigationService = SidebarServiceFactory.createNavigationService(page);

// Навигация
const result = await navigationService.navigateToItem('all-games');
if (result.success) {
  console.log(`Navigated to ${result.item.displayName}`);
}

// Проверка активности
const isActive = await navigationService.isItemActive('popular');

// Получение информации
const categories = navigationService.getCategories();
const activeItem = await navigationService.getCurrentActiveItem();
```

## 🔄 Расширение архитектуры

### **1. Добавление нового сервиса**

```typescript
// 1. Создать интерфейс
interface ISidebarNewFeature {
  doSomething(): Promise<boolean>;
}

// 2. Создать базовый класс
abstract class BaseSidebarNewFeature extends BaseSidebarService implements ISidebarNewFeature {
  abstract doSomething(): Promise<boolean>;
}

// 3. Создать реализацию
class SidebarNewFeatureImpl extends BaseSidebarNewFeature {
  async doSomething(): Promise<boolean> {
    // Реализация
  }
}

// 4. Добавить в фабрику
static createNewFeatureService(page: Page): ISidebarNewFeature {
  return new SidebarNewFeatureImpl(page);
}
```

### **2. Добавление новых элементов**

```typescript
// В types/sidebar.types.ts
export const SIDEBAR_ITEMS: readonly SidebarItemConfig[] = [
  // ... существующие элементы
  {
    id: 'new-feature',
    name: 'New Feature',
    href: '/new-feature',
    type: SidebarItemType.SECTION,
    selector: 'a[href*="/new-feature"]',
    displayName: 'Новая функция'
  }
];
```

## 📊 Преимущества архитектуры

### **1. SOLID принципы**
- ✅ **SRP**: Каждый класс имеет одну ответственность
- ✅ **OCP**: Легко расширяется без модификации
- ✅ **LSP**: Наследники заменяют базовые классы
- ✅ **ISP**: Интерфейсы разделены по функциональности
- ✅ **DIP**: Зависимости от абстракций

### **2. OOP принципы**
- ✅ **Инкапсуляция**: Логика скрыта в классах
- ✅ **Наследование**: Переиспользование кода
- ✅ **Полиморфизм**: Разные реализации одного интерфейса
- ✅ **Абстракция**: Скрытие сложности

### **3. Практические преимущества**
- ✅ **Тестируемость**: Каждый компонент тестируется изолированно
- ✅ **Поддерживаемость**: Легко вносить изменения
- ✅ **Расширяемость**: Простое добавление новых функций
- ✅ **Переиспользование**: Компоненты используются многократно
- ✅ **Типобезопасность**: Строгая типизация

## 🧪 Тестирование

### **1. Unit тесты для сервисов**

```typescript
describe('SidebarNavigationImpl', () => {
  let navigationService: ISidebarNavigation;
  
  beforeEach(() => {
    navigationService = SidebarServiceFactory.createNavigationService(page);
  });
  
  test('should navigate to item', async () => {
    const result = await navigationService.navigateToItem('all-games');
    expect(result.success).toBe(true);
  });
});
```

### **2. Integration тесты для компонента**

```typescript
describe('SidebarComponent', () => {
  let sidebarComponent: SidebarComponent;
  
  beforeEach(() => {
    sidebarComponent = new SidebarComponent(page);
  });
  
  test('should navigate through component', async () => {
    const result = await sidebarComponent.goToAllGames();
    expect(result).toBe(true);
  });
});
```

## 🎯 Заключение

Архитектура сервисов сайдбара построена согласно принципам SOLID и OOP, обеспечивая:

- **Четкое разделение ответственности** между компонентами
- **Легкое расширение** без модификации существующего кода
- **Высокую тестируемость** и поддерживаемость
- **Типобезопасность** и переиспользование кода
- **Гибкость** в использовании через фабрики и интерфейсы

**Результат:** Enterprise-grade архитектура с чистой структурой, высокой переиспользуемостью и легкой поддержкой! 🚀
