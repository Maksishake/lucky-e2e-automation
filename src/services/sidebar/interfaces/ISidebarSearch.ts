/**
 * Interface for Sidebar Search operations
 * Интерфейс для операций поиска в сайдбаре
 */

/**
 * Интерфейс для поиска в сайдбаре
 */
export interface ISidebarSearch {
  /**
   * Открыть поиск
   */
  openSearch(): Promise<boolean>;
  
  /**
   * Закрыть поиск
   */
  closeSearch(): Promise<boolean>;
  
  /**
   * Проверить, открыт ли поиск
   */
  isSearchOpen(): Promise<boolean>;
  
  /**
   * Выполнить поиск
   */
  search(query: string): Promise<boolean>;
  
  /**
   * Очистить поиск
   */
  clearSearch(): Promise<boolean>;
}
