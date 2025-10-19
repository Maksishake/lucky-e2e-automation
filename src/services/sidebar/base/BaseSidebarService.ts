/**
 * Base abstract class for all Sidebar services
 * Базовый абстрактный класс для всех сервисов сайдбара
 */

import { Locator, Page } from '@playwright/test';
import { BaseService } from '../../../core/base.service';
import { 
  SidebarItemConfig, 
  SidebarOperationResult, 
  SidebarConfig,
  DEFAULT_SIDEBAR_CONFIG,
  SIDEBAR_ITEMS,
  SidebarItemType
} from '../types/sidebar.types';
import { ISidebarService } from '../interfaces/ISidebarService';

/**
 * Базовый абстрактный класс для всех сервисов сайдбара
 * Применяет принцип SRP - общая функциональность для всех сервисов
 */
export abstract class BaseSidebarService extends BaseService implements ISidebarService {
  protected readonly config: SidebarConfig;
  protected readonly items: Map<string, SidebarItemConfig> = new Map();
  public readonly serviceName: string;

  constructor(
    page: Page, 
    serviceName: string, 
    config: SidebarConfig = DEFAULT_SIDEBAR_CONFIG
  ) {
    super(page, serviceName);
    this.serviceName = serviceName;
    this.config = config;
    this.initializeItems();
  }

  // ==================== INITIALIZATION ====================

  /**
   * Инициализация элементов сайдбара
   */
  protected initializeItems(): void {
    SIDEBAR_ITEMS.forEach(item => {
      this.items.set(item.id, item);
    });
  }

  // ==================== SELECTORS ====================

  /**
   * Получить селектор сайдбара
   */
  protected get sidebar(): Locator {
    return this.page.locator(this.config.sidebarSelector);
  }

  /**
   * Получить элемент по ID
   */
  protected getItemById(itemId: string): SidebarItemConfig | null {
    return this.items.get(itemId) || null;
  }

  /**
   * Получить локатор элемента по ID
   */
  protected getItemLocator(itemId: string): Locator | null {
    const item = this.getItemById(itemId);
    if (!item) return null;
    
    return this.sidebar.locator(item.selector);
  }

  // ==================== CORE METHODS ====================

  /**
   * Абстрактный метод выполнения операции - должен быть реализован в наследниках
   */
  abstract execute(itemId: string): Promise<SidebarOperationResult>;

  /**
   * Проверить, доступен ли элемент
   */
  async isAvailable(itemId: string): Promise<boolean> {
    const item = this.getItemById(itemId);
    if (!item) {
      this.logError(`Item with ID '${itemId}' not found`);
      return false;
    }

    try {
      const locator = this.getItemLocator(itemId);
      if (!locator) return false;
      
      return await locator.isVisible();
    } catch (error) {
      this.logError(`Failed to check availability for ${itemId}: ${error}`);
      return false;
    }
  }

  /**
   * Получить конфигурацию элемента
   */
  getItemConfig(itemId: string): SidebarItemConfig | null {
    return this.getItemById(itemId);
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Получить элементы определенного типа
   */
  protected getItemsByType(type: SidebarItemType): SidebarItemConfig[] {
    const items: SidebarItemConfig[] = [];
    this.items.forEach(item => {
      if (item.type === type) {
        items.push(item);
      }
    });
    return items;
  }

  /**
   * Проверить, существует ли элемент
   */
  protected hasItem(itemId: string): boolean {
    return this.items.has(itemId);
  }

  /**
   * Создать результат операции
   */
  protected createOperationResult(
    success: boolean, 
    item: SidebarItemConfig, 
    error?: string
  ): SidebarOperationResult {
    return {
      success,
      item,
      error,
      timestamp: new Date()
    };
  }

  /**
   * Валидировать элемент
   */
  protected validateItem(itemId: string): { isValid: boolean; error?: string } {
    if (!this.hasItem(itemId)) {
      return { isValid: false, error: `Item with ID '${itemId}' not found` };
    }

    const item = this.getItemById(itemId);
    if (!item) {
      return { isValid: false, error: `Item configuration not found for '${itemId}'` };
    }

    return { isValid: true };
  }
}
