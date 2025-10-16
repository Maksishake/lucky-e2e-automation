/**
 * Sidebar Component - Основной компонент для работы с боковой панелью
 * Оркестратор для всех операций с сайдбаром согласно принципам SOLID
 */

import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../core/base.component';
import { SidebarNavigationService } from '../services/sidebar/sidebar-navigation.service';
import { SidebarSearchService } from '../services/sidebar/sidebar-search.service';
import { SidebarLanguageService } from '../services/sidebar/sidebar-language.service';
import { SidebarActionsService } from '../services/sidebar/sidebar-actions.service';

export class SidebarComponent extends BaseComponent {
  // Специализированные сервисы
  private navigationService: SidebarNavigationService;
  private searchService: SidebarSearchService;
  private languageService: SidebarLanguageService;
  private actionsService: SidebarActionsService;

  // Основные селекторы
  get sidebar(): Locator {
    return this.page.locator('sidebar.menu');
  }

  get menuList(): Locator {
    return this.sidebar.locator('.menu-list');
  }

  get menuItems(): Locator {
    return this.menuList.locator('li');
  }

  get searchToggle(): Locator {
    return this.sidebar.locator('.search-toggle');
  }

  get menuBlockBottom(): Locator {
    return this.sidebar.locator('.menu-block-bottom');
  }

  get bottomButtons(): Locator {
    return this.menuBlockBottom.locator('.buttons');
  }

  constructor(page: Page) {
    super(page, 'SidebarComponent');
    
    // Инициализируем специализированные сервисы
    this.navigationService = new SidebarNavigationService(page);
    this.searchService = new SidebarSearchService(page);
    this.languageService = new SidebarLanguageService(page);
    this.actionsService = new SidebarActionsService(page);
  }

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
        const isActive = await item.locator('.current-page').count() > 0;
        
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
      
      const isActive = await menuItem.locator('.current-page').count() > 0;
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
    return await this.navigationService.goToAllGames();
  }

  /**
   * Перейти к категории "Популярные"
   */
  async goToPopular(): Promise<boolean> {
    return await this.navigationService.goToPopular();
  }

  /**
   * Перейти к категории "Новые"
   */
  async goToNew(): Promise<boolean> {
    return await this.navigationService.goToNew();
  }

  /**
   * Перейти к категории "Слоты"
   */
  async goToSlots(): Promise<boolean> {
    return await this.navigationService.goToSlots();
  }

  /**
   * Перейти к категории "Buy Bonus"
   */
  async goToBuyBonus(): Promise<boolean> {
    return await this.navigationService.goToBuyBonus();
  }

  /**
   * Перейти к категории "Live Casino"
   */
  async goToLiveCasino(): Promise<boolean> {
    return await this.navigationService.goToLiveCasino();
  }

  /**
   * Перейти к категории "Show Games"
   */
  async goToShowGames(): Promise<boolean> {
    return await this.navigationService.goToShowGames();
  }

  /**
   * Перейти к избранному
   */
  async goToFavorites(): Promise<boolean> {
    return await this.navigationService.goToFavorites();
  }

  /**
   * Перейти к бонусам
   */
  async goToBonuses(): Promise<boolean> {
    return await this.navigationService.goToBonuses();
  }

  /**
   * Перейти к турнирам
   */
  async goToTournaments(): Promise<boolean> {
    return await this.navigationService.goToTournaments();
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
}
