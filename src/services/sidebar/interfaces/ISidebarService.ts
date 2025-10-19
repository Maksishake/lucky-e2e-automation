/**
 * Base interface for all Sidebar services
 * Базовый интерфейс для всех сервисов сайдбара
 */

import { Page } from '@playwright/test';
import { SidebarOperationResult, SidebarItemConfig } from '../types/sidebar.types';

/**
 * Базовый интерфейс для всех сервисов сайдбара
 */
export interface ISidebarService {
  readonly page: Page;
  readonly serviceName: string;
  
  /**
   * Выполнить операцию
   */
  execute(itemId: string): Promise<SidebarOperationResult>;
  
  /**
   * Проверить, доступен ли элемент
   */
  isAvailable(itemId: string): Promise<boolean>;
  
  /**
   * Получить конфигурацию элемента
   */
  getItemConfig(itemId: string): SidebarItemConfig | null;
}
