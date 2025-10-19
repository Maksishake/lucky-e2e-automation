/**
 * Sidebar Component - Рефакторинг с использованием новой архитектуры
 * Основной компонент для работы с боковой панелью
 */

import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '@core/base.component';
import { 
  SidebarServiceFactory,
  SidebarConfig, 
  DEFAULT_SIDEBAR_CONFIG,
  SidebarItemConfig,
  ISidebarNavigation,
  ISidebarActions,
  ISidebarSearch,
  ISidebarLanguage
} from '@services/sidebar';

export class SidebarComponent extends BaseComponent {
  // Специализированные сервисы через интерфейсы
  private readonly navigationService: ISidebarNavigation;
  private readonly actionsService: ISidebarActions;
  private readonly searchService: ISidebarSearch;
  private readonly languageService: ISidebarLanguage;
  private readonly config: SidebarConfig;

  constructor(page: Page, config: SidebarConfig = DEFAULT_SIDEBAR_CONFIG) {
    super(page, 'SidebarComponent');
    this.config = config;
    
    // Создаем сервисы через фабрику
    this.navigationService = SidebarServiceFactory.createNavigationService(page);
    this.actionsService = SidebarServiceFactory.createActionsService(page);
    this.searchService = SidebarServiceFactory.createSearchService(page);
    this.languageService = SidebarServiceFactory.createLanguageService(page);
  }

  // ==================== SELECTORS ====================

  /**
   * Получить селектор сайдбара
   */
  get sidebar(): Locator {
    return this.page.locator(this.config.sidebarSelector);
  }

  /**
   * Получить список меню
   */
  get menuList(): Locator {
    return this.sidebar.locator(this.config.menuListSelector);
  }

  /**
   * Получить элементы меню
   */
  get menuItems(): Locator {
    return this.menuList.locator(this.config.menuItemSelector);
  }

  /**
   * Получить кнопку поиска
   */
  get searchToggle(): Locator {
    return this.sidebar.locator('.search-toggle');
  }

  /**
   * Получить нижний блок меню
   */
  get menuBlockBottom(): Locator {
    return this.sidebar.locator('.menu-block-bottom');
  }

  /**
   * Получить кнопки в нижнем блоке
   */
  get bottomButtons(): Locator {
    return this.menuBlockBottom.locator('.buttons');
  }

  // ==================== BASIC OPERATIONS ====================

  /**
   * Проверить, что сайдбар видим
   */
  async isVisible(): Promise<boolean> {
    this.logStep('Checking if sidebar is visible');
    
    try {
      const isVisible = await this.sidebar.isVisible();
      this.logStep(`Sidebar visibility: ${isVisible}`);
      return isVisible;
    } catch (error) {
      this.logError(`Failed to check sidebar visibility: ${error}`);
      return false;
    }
  }

  /**
   * Дождаться загрузки сайдбара
   */
  async waitForLoad(): Promise<void> {
    this.logStep('Waiting for sidebar to load');
    
    try {
      await this.sidebar.waitFor({ state: 'visible', timeout: 10000 });
      await this.page.waitForTimeout(1000);
      this.logSuccess('Sidebar loaded successfully');
    } catch (error) {
      this.logError(`Failed to wait for sidebar load: ${error}`);
    }
  }

  /**
   * Получить все пункты меню
   */
  async getMenuItems(): Promise<Array<{ text: string; href: string; isActive: boolean }>> {
    this.logStep('Getting all menu items');
    
    try {
      const items = await this.menuItems.all();
      const menuItems: Array<{ text: string; href: string; isActive: boolean }> = [];
      
      for (const item of items) {
        const link = item.locator('a').first();
        const text = await link.locator('span').textContent();
        const href = await link.getAttribute('href');
        const isActive = await item.locator(`.${this.config.activeClass}`).count() > 0;
        
        if (text && href) {
          menuItems.push({
            text: text.trim(),
            href: href,
            isActive
          });
        }
      }
      
      this.logSuccess(`Found ${menuItems.length} menu items`);
      return menuItems;
    } catch (error) {
      this.logError(`Failed to get menu items: ${error}`);
      return [];
    }
  }

  /**
   * Найти пункт меню по тексту
   */
  async findMenuItemByText(text: string): Promise<Locator | null> {
    this.logStep(`Finding menu item by text: ${text}`);
    
    try {
      const menuItem = this.menuItems.filter({ hasText: text }).first();
      
      if (await menuItem.count() > 0) {
        this.logSuccess(`Menu item found: ${text}`);
        return menuItem;
      }
      
      this.logError(`Menu item not found: ${text}`);
      return null;
    } catch (error) {
      this.logError(`Failed to find menu item: ${error}`);
      return null;
    }
  }

  /**
   * Кликнуть по пункту меню
   */
  async clickMenuItem(text: string): Promise<boolean> {
    this.logStep(`Clicking menu item: ${text}`);
    
    try {
      const menuItem = await this.findMenuItemByText(text);
      
      if (!menuItem) {
        return false;
      }
      
      const link = menuItem.locator('a').first();
      await link.click();
      
      this.logSuccess(`Menu item clicked: ${text}`);
      return true;
    } catch (error) {
      this.logError(`Failed to click menu item: ${error}`);
      return false;
    }
  }

  /**
   * Проверить, активен ли пункт меню
   */
  async isMenuItemActive(text: string): Promise<boolean> {
    this.logStep(`Checking if menu item is active: ${text}`);
    
    try {
      const menuItem = await this.findMenuItemByText(text);
      
      if (!menuItem) {
        return false;
      }
      
      const isActive = await menuItem.locator(`.${this.config.activeClass}`).count() > 0;
      this.logStep(`Menu item active status: ${isActive}`);
      return isActive;
    } catch (error) {
      this.logError(`Failed to check menu item active status: ${error}`);
      return false;
    }
  }

  // ==================== DELEGATION METHODS ====================

  /**
   * Открыть поиск
   */
  async openSearch(): Promise<boolean> {
    return await this.searchService.openSearch();
  }

  /**
   * Перейти к категории "Все игры"
   */
  async goToAllGames(): Promise<boolean> {
    const result = await this.navigationService.navigateToItem('all-games');
    return result.success;
  }

  /**
   * Перейти к категории "Популярные"
   */
  async goToPopular(): Promise<boolean> {
    const result = await this.navigationService.navigateToItem('popular');
    return result.success;
  }

  /**
   * Перейти к категории "Новые"
   */
  async goToNew(): Promise<boolean> {
    const result = await this.navigationService.navigateToItem('new');
    return result.success;
  }

  /**
   * Перейти к категории "Слоты"
   */
  async goToSlots(): Promise<boolean> {
    const result = await this.navigationService.navigateToItem('slots');
    return result.success;
  }

  /**
   * Перейти к категории "Buy Bonus"
   */
  async goToBuyBonus(): Promise<boolean> {
    const result = await this.navigationService.navigateToItem('buy-bonus');
    return result.success;
  }

  /**
   * Перейти к категории "Live Casino"
   */
  async goToLiveCasino(): Promise<boolean> {
    const result = await this.navigationService.navigateToItem('live-casino');
    return result.success;
  }

  /**
   * Перейти к категории "Show Games"
   */
  async goToShowGames(): Promise<boolean> {
    const result = await this.navigationService.navigateToItem('show-games');
    return result.success;
  }

  /**
   * Перейти к избранному
   */
  async goToFavorites(): Promise<boolean> {
    const result = await this.navigationService.navigateToItem('favorites');
    return result.success;
  }

  /**
   * Перейти к бонусам
   */
  async goToBonuses(): Promise<boolean> {
    const result = await this.navigationService.navigateToItem('bonuses');
    return result.success;
  }

  /**
   * Перейти к турнирам
   */
  async goToTournaments(): Promise<boolean> {
    const result = await this.navigationService.navigateToItem('tournaments');
    return result.success;
  }

  /**
   * Открыть промо-код
   */
  async openPromocode(): Promise<boolean> {
    return await this.actionsService.openPromocode();
  }

  /**
   * Получить деньги
   */
  async getMoney(): Promise<boolean> {
    return await this.actionsService.getMoney();
  }

  /**
   * Открыть Telegram
   */
  async openTelegram(): Promise<boolean> {
    return await this.actionsService.openTelegram();
  }

  /**
   * Открыть поддержку
   */
  async openSupport(): Promise<boolean> {
    return await this.actionsService.openSupport();
  }

  /**
   * Сменить язык
   */
  async changeLanguage(language: string): Promise<boolean> {
    return await this.languageService.changeLanguage(language);
  }

  /**
   * Получить текущий язык
   */
  async getCurrentLanguage(): Promise<string> {
    return await this.languageService.getCurrentLanguage();
  }

  /**
   * Получить доступные языки
   */
  async getAvailableLanguages(): Promise<string[]> {
    return await this.languageService.getAvailableLanguages();
  }

  // ==================== ADVANCED METHODS ====================

  /**
   * Универсальная навигация к элементу по ID
   */
  async navigateToItem(itemId: string): Promise<boolean> {
    const result = await this.navigationService.navigateToItem(itemId);
    return result.success;
  }

  /**
   * Выполнить действие по ID
   */
  async executeAction(actionId: string): Promise<boolean> {
    const result = await this.actionsService.executeAction(actionId);
    return result.success;
  }

  /**
   * Получить все категории
   */
  getCategories(): SidebarItemConfig[] {
    return this.navigationService.getCategories();
  }

  /**
   * Получить все секции
   */
  getSections(): SidebarItemConfig[] {
    return this.navigationService.getSections();
  }

  /**
   * Получить все действия
   */
  getActions(): SidebarItemConfig[] {
    return this.actionsService.getAvailableActions();
  }

  /**
   * Получить текущий активный элемент
   */
  async getCurrentActiveItem(): Promise<SidebarItemConfig | null> {
    return await this.navigationService.getCurrentActiveItem();
  }

  // ==================== SEARCH METHODS ====================

  /**
   * Закрыть поиск
   */
  async closeSearch(): Promise<boolean> {
    return await this.searchService.closeSearch();
  }

  /**
   * Проверить, открыт ли поиск
   */
  async isSearchOpen(): Promise<boolean> {
    return await this.searchService.isSearchOpen();
  }

  /**
   * Выполнить поиск
   */
  async search(query: string): Promise<boolean> {
    return await this.searchService.search(query);
  }

  /**
   * Очистить поиск
   */
  async clearSearch(): Promise<boolean> {
    return await this.searchService.clearSearch();
  }

  // ==================== LANGUAGE METHODS ====================

  /**
   * Проверить, поддерживается ли язык
   */
  async isLanguageSupported(language: string): Promise<boolean> {
    return await this.languageService.isLanguageSupported(language);
  }
}