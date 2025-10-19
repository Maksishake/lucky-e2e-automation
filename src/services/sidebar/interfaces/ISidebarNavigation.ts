/**
 * Interface for Sidebar Navigation operations
 * Интерфейс для операций навигации по сайдбару
 */

import { SidebarOperationResult, SidebarItemConfig } from '../types/sidebar.types';

/**
 * Интерфейс для навигации по сайдбару
 */
export interface ISidebarNavigation {
  /**
   * Навигация к элементу
   */
  navigateToItem(itemId: string): Promise<SidebarOperationResult>;
  
  /**
   * Проверить, активен ли элемент
   */
  isItemActive(itemId: string): Promise<boolean>;
  
  /**
   * Получить текущий активный элемент
   */
  getCurrentActiveItem(): Promise<SidebarItemConfig | null>;
  
  /**
   * Получить все категории
   */
  getCategories(): SidebarItemConfig[];
  
  /**
   * Получить все секции
   */
  getSections(): SidebarItemConfig[];
}
