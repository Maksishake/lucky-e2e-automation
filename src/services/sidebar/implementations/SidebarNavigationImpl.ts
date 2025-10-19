/**
 * Concrete implementation of Sidebar Navigation
 * Конкретная реализация навигации по сайдбару
 */

import { Page } from '@playwright/test';
import { BaseSidebarNavigation } from '../base/BaseSidebarNavigation';
import { SidebarOperationResult, SidebarItemConfig, SidebarItemType } from '../types/sidebar.types';

/**
 * Конкретная реализация навигации по сайдбару
 * Применяет принцип SRP - только навигация
 */
export class SidebarNavigationImpl extends BaseSidebarNavigation {
  constructor(page: Page) {
    super(page, 'SidebarNavigationImpl');
  }

  // ==================== IMPLEMENTED METHODS ====================

  /**
   * Выполнить операцию (реализация абстрактного метода из BaseSidebarService)
   */
  async execute(itemId: string): Promise<SidebarOperationResult> {
    return await this.navigateToItem(itemId);
  }

  /**
   * Навигация к элементу
   */
  async navigateToItem(itemId: string): Promise<SidebarOperationResult> {
    const item = this.getItemById(itemId);
    if (!item) {
      const error = `Item with ID '${itemId}' not found`;
      this.logError(error);
      return this.createOperationResult(false, { id: '', name: '', type: SidebarItemType.CATEGORY, selector: '', displayName: '' }, error);
    }

    // Определяем тип элемента и используем соответствующий метод
    switch (item.type) {
      case SidebarItemType.CATEGORY: {
        return await this.navigateToCategory(itemId);
      }
      case SidebarItemType.SECTION: {
        return await this.navigateToSection(itemId);
      }
      default: {
        const errorMessage = `Unsupported item type: ${item.type}`;
        this.logError(errorMessage);
        return this.createOperationResult(false, item, errorMessage);
      }
    }
  }

  /**
   * Проверить, активен ли элемент
   */
  async isItemActive(itemId: string): Promise<boolean> {
    return await this.checkItemActive(itemId);
  }

  /**
   * Получить текущий активный элемент
   */
  async getCurrentActiveItem(): Promise<SidebarItemConfig | null> {
    this.logStep('Getting current active item');
    
    try {
      const activeItem = this.sidebar.locator(`.${this.config.activeClass} a`);
      
      if (await activeItem.count() > 0) {
        const href = await activeItem.getAttribute('href');
        if (href) {
          // Найти элемент по href
          let foundItem: SidebarItemConfig | null = null;
          this.items.forEach((item: SidebarItemConfig) => {
            if (item.href && href.includes(item.href)) {
              foundItem = item;
            }
          });
          
          if (foundItem) {
            this.logSuccess('Current active item:');
            return foundItem;
          }
        }
      }
      
      this.logStep('No active item found');
      return null;
    } catch (error) {
      this.logError(`Failed to get current active item: ${error}`);
      return null;
    }
  }

  // ==================== SPECIFIC NAVIGATION METHODS ====================

  /**
   * Перейти к категории "Все игры"
   */
  async goToAllGames(): Promise<boolean> {
    const result = await this.navigateToItem('all-games');
    return result.success;
  }

  /**
   * Перейти к категории "Популярные"
   */
  async goToPopular(): Promise<boolean> {
    const result = await this.navigateToItem('popular');
    return result.success;
  }

  /**
   * Перейти к категории "Новые"
   */
  async goToNew(): Promise<boolean> {
    const result = await this.navigateToItem('new');
    return result.success;
  }

  /**
   * Перейти к категории "Слоты"
   */
  async goToSlots(): Promise<boolean> {
    const result = await this.navigateToItem('slots');
    return result.success;
  }

  /**
   * Перейти к категории "Buy Bonus"
   */
  async goToBuyBonus(): Promise<boolean> {
    const result = await this.navigateToItem('buy-bonus');
    return result.success;
  }

  /**
   * Перейти к категории "Live Casino"
   */
  async goToLiveCasino(): Promise<boolean> {
    const result = await this.navigateToItem('live-casino');
    return result.success;
  }

  /**
   * Перейти к категории "Show Games"
   */
  async goToShowGames(): Promise<boolean> {
    const result = await this.navigateToItem('show-games');
    return result.success;
  }

  /**
   * Перейти к избранному
   */
  async goToFavorites(): Promise<boolean> {
    const result = await this.navigateToItem('favorites');
    return result.success;
  }

  /**
   * Перейти к бонусам
   */
  async goToBonuses(): Promise<boolean> {
    const result = await this.navigateToItem('bonuses');
    return result.success;
  }

  /**
   * Перейти к турнирам
   */
  async goToTournaments(): Promise<boolean> {
    const result = await this.navigateToItem('tournaments');
    return result.success;
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Получить все элементы определенного типа
   */
  getItemsByType(type: SidebarItemType): SidebarItemConfig[] {
    return super.getItemsByType(type);
  }

  /**
   * Проверить, существует ли элемент
   */
  hasItem(itemId: string): boolean {
    return super.hasItem(itemId);
  }

  /**
   * Получить конфигурацию элемента
   */
  getItemConfig(itemId: string): SidebarItemConfig | null {
    return super.getItemConfig(itemId);
  }
}
