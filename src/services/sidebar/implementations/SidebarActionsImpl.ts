/**
 * Concrete implementation of Sidebar Actions
 * Конкретная реализация действий в сайдбаре
 */

import { Page } from '@playwright/test';
import { BaseSidebarActions } from '../base/BaseSidebarActions';
import { SidebarOperationResult, SidebarItemConfig } from '../types/sidebar.types';

/**
 * Конкретная реализация действий в сайдбаре
 * Применяет принцип SRP - только действия
 */
export class SidebarActionsImpl extends BaseSidebarActions {
  constructor(page: Page) {
    super(page, 'SidebarActionsImpl');
  }

  // ==================== IMPLEMENTED METHODS ====================

  /**
   * Выполнить операцию (реализация абстрактного метода из BaseSidebarService)
   */
  async execute(itemId: string): Promise<SidebarOperationResult> {
    return await this.executeAction(itemId);
  }

  /**
   * Выполнить действие
   */
  async executeAction(actionId: string): Promise<SidebarOperationResult> {
    return await this.performAction(actionId);
  }

  // ==================== SPECIFIC ACTION METHODS ====================

  /**
   * Открыть промо-код
   */
  async openPromocode(): Promise<boolean> {
    const result = await this.executeAction('promocode');
    
    if (result.success) {
      // Ждем появления модального окна промо-кода
      const modalOpened = await this.handleModalAction('[wire\\:id*="modal-promocode"]', 5000);
      if (!modalOpened) {
        return false;
      }
    }
    
    return result.success;
  }

  /**
   * Получить деньги (переход на внешний сайт)
   */
  async getMoney(): Promise<boolean> {
    const result = await this.executeAction('get-money');
    
    if (result.success) {
      // Проверяем, что ссылка открывается в новой вкладке
      const externalAction = await this.handleExternalAction(2000);
      if (!externalAction) {
        return false;
      }
    }
    
    return result.success;
  }

  /**
   * Открыть Telegram
   */
  async openTelegram(): Promise<boolean> {
    const result = await this.executeAction('telegram');
    
    if (result.success) {
      // Ждем открытия Telegram
      const externalAction = await this.handleExternalAction(2000);
      if (!externalAction) {
        return false;
      }
    }
    
    return result.success;
  }

  /**
   * Открыть поддержку
   */
  async openSupport(): Promise<boolean> {
    const result = await this.executeAction('support');
    
    if (result.success) {
      // Ждем открытия поддержки
      const externalAction = await this.handleExternalAction(2000);
      if (!externalAction) {
        return false;
      }
    }
    
    return result.success;
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Получить все доступные действия
   */
  getAvailableActions(): SidebarItemConfig[] {
    return super.getAvailableActions();
  }

  /**
   * Проверить, существует ли действие
   */
  hasAction(actionId: string): boolean {
    return this.hasItem(actionId);
  }

  /**
   * Получить конфигурацию действия
   */
  getActionConfig(actionId: string): SidebarItemConfig | null {
    return this.getItemConfig(actionId);
  }
}
