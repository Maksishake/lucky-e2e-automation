import { Page, expect, test } from '@playwright/test';
import { logger } from '@/core/logger';
import { Routes } from '@config/routes';
import { SidebarComponent } from '@/components/sidebar/sidebar.component';
import { SidebarServiceFactory } from '@/services/sidebar/factories/SidebarServiceFactory';

/**
 * Pages Availability Tests - Рефакторинг с использованием новой архитектуры
 * Тестирует доступность всех страниц через сайдбар
 */

test.describe('Pages Availability Tests (Refactored Architecture)', () => {
  let sidebarComponent: SidebarComponent;
  let navigationService: any;
  let page: Page;
  
  test.beforeEach(async ({ page: testPage }) => {
    logger.testStart('Pages Availability Tests (Refactored)', 'pages-availability.spec.ts');
    page = testPage;
    
    // Инициализируем компоненты через новую архитектуру
    sidebarComponent = new SidebarComponent(page);
    navigationService = SidebarServiceFactory.createNavigationService(page);

    // Переходим на главную страницу
    await page.goto(Routes.HOME);
    await page.waitForLoadState('domcontentloaded');
    
    logger.info('Pages Availability Tests (Refactored)', 'Using cached authentication from global setup');
  });

  // ==================== BASIC AVAILABILITY TESTS ====================

  test('Проверка доступности главной страницы', async () => {
    const result = await navigationService.navigateToItem('all-games');
    expect(result.success).toBe(true);
    
    // Проверяем, что мы на правильной странице
    const currentUrl = page.url();
    expect(currentUrl).toContain('/category/all');
  });

  test('Проверка доступности страницы "Популярные"', async () => {
    const result = await navigationService.navigateToItem('popular');
    expect(result.success).toBe(true);
    
    const currentUrl = page.url();
    expect(currentUrl).toContain('/category/popular');
  });

  test('Проверка доступности страницы "Новые"', async () => {
    const result = await navigationService.navigateToItem('new');
    expect(result.success).toBe(true);
    
    const currentUrl = page.url();
    expect(currentUrl).toContain('/category/new');
  });

  test('Проверка доступности страницы "Слоты"', async () => {
    const result = await navigationService.navigateToItem('slots');
    expect(result.success).toBe(true);
    
    const currentUrl = page.url();
    expect(currentUrl).toContain('/category/slots');
  });

  test('Проверка доступности страницы "Buy Bonus"', async () => {
    const result = await navigationService.navigateToItem('buy-bonus');
    expect(result.success).toBe(true);
    
    const currentUrl = page.url();
    expect(currentUrl).toContain('/category/buy-bonus');
  });

  test('Проверка доступности страницы "Live Casino"', async () => {
    const result = await navigationService.navigateToItem('live-casino');
    expect(result.success).toBe(true);
    
    const currentUrl = page.url();
    expect(currentUrl).toContain('/category/live-casino');
  });

  test('Проверка доступности страницы "Show Games"', async () => {
    const result = await navigationService.navigateToItem('show-games');
    expect(result.success).toBe(true);
    
    const currentUrl = page.url();
    expect(currentUrl).toContain('/category/show-games');
  });

  // ==================== SECTION TESTS ====================

  test('Проверка доступности страницы "Избранное"', async () => {
    const result = await navigationService.navigateToItem('favorites');
    expect(result.success).toBe(true);
    
    const currentUrl = page.url();
    expect(currentUrl).toContain('/favorite');
  });

  test('Проверка доступности страницы "Бонусы"', async () => {
    const result = await navigationService.navigateToItem('bonuses');
    expect(result.success).toBe(true);
    
    const currentUrl = page.url();
    expect(currentUrl).toContain('/bonuses');
  });

  test('Проверка доступности страницы "Турниры"', async () => {
    const result = await navigationService.navigateToItem('tournaments');
    expect(result.success).toBe(true);
    
    const currentUrl = page.url();
    expect(currentUrl).toContain('/tournaments');
  });

  // ==================== COMPONENT TESTS ====================

  test('Проверка видимости сайдбара', async () => {
    const isVisible = await sidebarComponent.isVisible();
    expect(isVisible).toBe(true);
  });

  test('Проверка загрузки сайдбара', async () => {
    await sidebarComponent.waitForLoad();
    const isVisible = await sidebarComponent.isVisible();
    expect(isVisible).toBe(true);
  });

  test('Проверка получения элементов меню', async () => {
    const menuItems = await sidebarComponent.getMenuItems();
    expect(menuItems.length).toBeGreaterThan(0);
    
    // Проверяем, что есть основные категории
    const itemTexts = menuItems.map(item => item.text);
    expect(itemTexts).toContain('Усі');
    expect(itemTexts).toContain('Popular');
  });

  // ==================== NAVIGATION TESTS ====================

  test('Проверка навигации через компонент', async () => {
    // Тестируем навигацию через компонент
    const result = await sidebarComponent.goToAllGames();
    expect(result).toBe(true);
    
    const currentUrl = page.url();
    expect(currentUrl).toContain('/category/all');
  });

  test('Проверка активного элемента', async () => {
    // Переходим на страницу
    await navigationService.navigateToItem('popular');
    
    // Проверяем, что элемент активен
    const isActive = await navigationService.isItemActive('popular');
    expect(isActive).toBe(true);
  });

  test('Проверка получения текущего активного элемента', async () => {
    // Переходим на страницу
    await navigationService.navigateToItem('slots');
    
    // Получаем текущий активный элемент
    const activeItem = await navigationService.getCurrentActiveItem();
    expect(activeItem).not.toBeNull();
    expect(activeItem?.id).toBe('slots');
  });

  // ==================== CATEGORY TESTS ====================

  test('Проверка получения всех категорий', async () => {
    const categories = navigationService.getCategories();
    expect(categories.length).toBeGreaterThan(0);
    
    // Проверяем, что есть основные категории
    const categoryIds = categories.map((cat: any) => cat.id);
    expect(categoryIds).toContain('all-games');
    expect(categoryIds).toContain('popular');
    expect(categoryIds).toContain('slots');
  });

  test('Проверка получения всех секций', async () => {
    const sections = navigationService.getSections();
    expect(sections.length).toBeGreaterThan(0);
    
    // Проверяем, что есть основные секции
    const sectionIds = sections.map((sec: any) => sec.id);
    expect(sectionIds).toContain('favorites');
    expect(sectionIds).toContain('bonuses');
    expect(sectionIds).toContain('tournaments');
  });

  // ==================== ERROR HANDLING TESTS ====================

  test('Проверка обработки несуществующего элемента', async () => {
    const result = await navigationService.navigateToItem('non-existent');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  test('Проверка проверки существования элемента', async () => {
    const exists = navigationService.hasItem('all-games');
    expect(exists).toBe(true);
    
    const notExists = navigationService.hasItem('non-existent');
    expect(notExists).toBe(false);
  });

  // ==================== UNIVERSAL NAVIGATION TESTS ====================

  test('Универсальная навигация по всем категориям', async () => {
    const categories = navigationService.getCategories();
    
    for (const category of categories) {
      const result = await navigationService.navigateToItem(category.id);
      expect(result.success).toBe(true);
      
      // Проверяем URL
      const currentUrl = page.url();
      if (category.href) {
        expect(currentUrl).toContain(category.href);
      }
      
      // Небольшая пауза между переходами
      await page.waitForTimeout(500);
    }
  });

  // ==================== SEARCH TESTS ====================

  test('Проверка открытия поиска', async () => {
    const searchService = SidebarServiceFactory.createSearchService(page);
    const result = await searchService.openSearch();
    expect(result).toBe(true);
  });

  test('Проверка закрытия поиска', async () => {
    const searchService = SidebarServiceFactory.createSearchService(page);
    
    // Сначала открываем поиск
    await searchService.openSearch();
    
    // Затем закрываем
    const result = await searchService.closeSearch();
    expect(result).toBe(true);
  });

  // ==================== LANGUAGE TESTS ====================

  test('Проверка получения текущего языка', async () => {
    const languageService = SidebarServiceFactory.createLanguageService(page);
    const currentLanguage = await languageService.getCurrentLanguage();
    expect(currentLanguage).toBeDefined();
    expect(currentLanguage).not.toBe('unknown');
  });

  test('Проверка получения доступных языков', async () => {
    const languageService = SidebarServiceFactory.createLanguageService(page);
    const availableLanguages = await languageService.getAvailableLanguages();
    expect(availableLanguages.length).toBeGreaterThan(0);
  });

  // ==================== ACTIONS TESTS ====================

  test('Проверка получения доступных действий', async () => {
    const actionsService = SidebarServiceFactory.createActionsService(page);
    const availableActions = actionsService.getAvailableActions();
    expect(availableActions.length).toBeGreaterThan(0);
    
    // Проверяем, что есть основные действия
    const actionIds = availableActions.map(action => action.id);
    expect(actionIds).toContain('promocode');
    expect(actionIds).toContain('get-money');
    expect(actionIds).toContain('telegram');
    expect(actionIds).toContain('support');
  });

  // ==================== ARCHITECTURE TESTS ====================

  test('Проверка создания всех сервисов через фабрику', async () => {
    const services = SidebarServiceFactory.createAllServices(page);
    
    expect(services.navigation).toBeDefined();
    expect(services.actions).toBeDefined();
    expect(services.search).toBeDefined();
    expect(services.language).toBeDefined();
  });

  test('Проверка создания сервиса по типу', async () => {
    const navigationService = SidebarServiceFactory.createServiceByType(page, 'navigation');
    const actionsService = SidebarServiceFactory.createServiceByType(page, 'actions');
    const searchService = SidebarServiceFactory.createServiceByType(page, 'search');
    const languageService = SidebarServiceFactory.createServiceByType(page, 'language');
    
    expect(navigationService).toBeDefined();
    expect(actionsService).toBeDefined();
    expect(searchService).toBeDefined();
    expect(languageService).toBeDefined();
  });
});