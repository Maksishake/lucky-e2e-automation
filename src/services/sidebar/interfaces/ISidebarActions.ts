/**
 * Interface for Sidebar Actions operations
 * Интерфейс для операций действий в сайдбаре
 */

import { SidebarOperationResult, SidebarItemConfig } from '../types/sidebar.types';

/**
 * Интерфейс для действий в сайдбаре
 */
export interface ISidebarActions {
  /**
   * Выполнить действие
   */
  executeAction(actionId: string): Promise<SidebarOperationResult>;
  
  /**
   * Открыть промо-код
   */
  openPromocode(): Promise<boolean>;
  
  /**
   * Получить деньги
   */
  getMoney(): Promise<boolean>;
  
  /**
   * Открыть Telegram
   */
  openTelegram(): Promise<boolean>;
  
  /**
   * Открыть поддержку
   */
  openSupport(): Promise<boolean>;
  
  /**
   * Получить все доступные действия
   */
  getAvailableActions(): SidebarItemConfig[];
}
