/**
 * Base abstract class for Sidebar Actions
 * Базовый абстрактный класс для действий в сайдбаре
 */

import { Page } from '@playwright/test';
import { BaseSidebarService } from './BaseSidebarService';
import { ISidebarActions } from '../interfaces/ISidebarActions';
import { SidebarOperationResult, SidebarItemType, SidebarItemConfig } from '../types/sidebar.types';

/**
 * Базовый абстрактный класс для действий в сайдбаре
 * Применяет принцип SRP - только действия
 */
export abstract class BaseSidebarActions extends BaseSidebarService implements ISidebarActions {
  constructor(page: Page, serviceName: string) {
    super(page, serviceName);
  }

  // ==================== ABSTRACT METHODS ====================

  /**
   * Абстрактный метод выполнения действия - должен быть реализован в наследниках
   */
  abstract executeAction(actionId: string): Promise<SidebarOperationResult>;

  // ==================== IMPLEMENTED METHODS ====================

  /**
   * Получить все доступные действия
   */
  getAvailableActions(): SidebarItemConfig[] {
    return this.getItemsByType(SidebarItemType.ACTION);
  }

  // ==================== ABSTRACT METHODS FOR INTERFACE ====================

  /**
   * Абстрактные методы интерфейса - должны быть реализованы в наследниках
   */
  abstract openPromocode(): Promise<boolean>;
  abstract getMoney(): Promise<boolean>;
  abstract openTelegram(): Promise<boolean>;
  abstract openSupport(): Promise<boolean>;

  // ==================== UTILITY METHODS ====================

  /**
   * Выполнить действие с обработкой ошибок
   */
  protected async performAction(actionId: string): Promise<SidebarOperationResult> {
    const validation = this.validateItem(actionId);
    if (!validation.isValid) {
      const item = this.getItemById(actionId) || { id: '', name: '', type: SidebarItemType.ACTION, selector: '', displayName: '' };
      return this.createOperationResult(false, item, validation.error);
    }

    const item = this.getItemById(actionId);
    if (!item) {
      throw new Error(`Item not found: ${actionId}`);
    }
    this.logStep(`Executing action: ${item.displayName}`);
    
    try {
      const locator = this.getItemLocator(actionId);
      if (!locator) {
        throw new Error(`Locator not found for action: ${actionId}`);
      }

      await locator.click();
      
      // Дополнительная обработка для внешних ссылок
      if (item.isExternal) {
        await this.handleExternalLink(item);
      }
      
      this.logSuccess(`Action executed: ${item.displayName}`);
      return this.createOperationResult(true, item);
    } catch (error) {
      const errorMessage = `Failed to execute action ${item.displayName}: ${error}`;
      this.logError(errorMessage);
      return this.createOperationResult(false, item, errorMessage);
    }
  }

  /**
   * Обработка внешних ссылок
   */
  protected async handleExternalLink(item: SidebarItemConfig): Promise<void> {
    if (item.isExternal && item.href) {
      // Ждем открытия новой вкладки или перехода
      await this.page.waitForTimeout(1000);
      this.logStep(`External link opened: ${item.href}`);
    }
  }

  /**
   * Обработка модальных окон
   */
  protected async handleModalAction(modalSelector: string, timeout: number = 5000): Promise<boolean> {
    try {
      await this.page.waitForSelector(modalSelector, { 
        state: 'visible', 
        timeout 
      });
      this.logSuccess('Modal opened successfully');
      return true;
    } catch (error) {
      this.logError(`Modal did not appear: ${error}`);
      return false;
    }
  }

  /**
   * Обработка внешних действий
   */
  protected async handleExternalAction(timeout: number = 2000): Promise<boolean> {
    try {
      await this.page.waitForTimeout(timeout);
      this.logSuccess('External action completed successfully');
      return true;
    } catch (error) {
      this.logError(`External action failed: ${error}`);
      return false;
    }
  }
}
