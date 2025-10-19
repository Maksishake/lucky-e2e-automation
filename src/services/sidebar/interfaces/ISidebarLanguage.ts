/**
 * Interface for Sidebar Language operations
 * Интерфейс для операций с языками в сайдбаре
 */

/**
 * Интерфейс для работы с языками в сайдбаре
 */
export interface ISidebarLanguage {
  /**
   * Сменить язык
   */
  changeLanguage(language: string): Promise<boolean>;
  
  /**
   * Получить текущий язык
   */
  getCurrentLanguage(): Promise<string>;
  
  /**
   * Получить доступные языки
   */
  getAvailableLanguages(): Promise<string[]>;
  
  /**
   * Проверить, поддерживается ли язык
   */
  isLanguageSupported(language: string): Promise<boolean>;
}
