/**
 * Concrete implementation of Sidebar Language
 * Конкретная реализация работы с языками в сайдбаре
 */

import { Page } from '@playwright/test';
import { BaseService } from '@core/base.service';
import { ISidebarLanguage } from '../interfaces/ISidebarLanguage';  

/**
 * Конкретная реализация работы с языками в сайдбаре
 * Применяет принцип SRP - только языки
 */
export class SidebarLanguageImpl extends BaseService implements ISidebarLanguage {
  constructor(page: Page) {
    super(page, 'SidebarLanguageImpl');
  }

  // ==================== IMPLEMENTED METHODS ====================

  /**
   * Сменить язык
   */
  async changeLanguage(language: string): Promise<boolean> {
    this.logStep(`Changing language to: ${language}`);
    
    try {
      const sidebar = this.page.locator('sidebar.menu');
      const langToggle = sidebar.locator('.lang-toggle');
      
      // Кликаем на переключатель языка
      await langToggle.click();
      
      // Ждем появления выпадающего списка
      const langDropdown = sidebar.locator('.lang-dropdown');
      await langDropdown.waitFor({ state: 'visible', timeout: 3000 });
      
      // Ищем нужный язык в списке
      const languageOption = langDropdown.locator(`li:has-text("${language}")`);
      
      if (await languageOption.count() > 0) {
        await languageOption.click();
        
        // Ждем изменения языка
        await this.page.waitForTimeout(2000);
        
        this.logSuccess(`Language changed to: ${language}`);
        return true;
      } else {
        this.logError(`Language option not found: ${language}`);
        return false;
      }
    } catch (error) {
      this.logError(`Failed to change language: ${error}`);
      return false;
    }
  }

  /**
   * Получить текущий язык
   */
  async getCurrentLanguage(): Promise<string> {
    this.logStep('Getting current language');
    
    try {
      const sidebar = this.page.locator('sidebar.menu');
      const currentLang = sidebar.locator('.lang-toggle img');
      
      if (await currentLang.count() > 0) {
        const altText = await currentLang.getAttribute('alt');
        if (altText) {
          // Извлекаем язык из alt текста (например, "ru.svg" -> "ru")
          const language = altText.replace('.svg', '').toLowerCase();
          this.logSuccess(`Current language: ${language}`);
          return language;
        }
      }
      
      this.logStep('Could not determine current language');
      return 'unknown';
    } catch (error) {
      this.logError(`Failed to get current language: ${error}`);
      return 'unknown';
    }
  }

  /**
   * Получить доступные языки
   */
  async getAvailableLanguages(): Promise<string[]> {
    this.logStep('Getting available languages');
    
    try {
      const sidebar = this.page.locator('sidebar.menu');
      const langToggle = sidebar.locator('.lang-toggle');
      
      // Открываем выпадающий список языков
      await langToggle.click();
      
      // Ждем появления списка
      const langDropdown = sidebar.locator('.lang-dropdown');
      await langDropdown.waitFor({ state: 'visible', timeout: 3000 });
      
      // Получаем все элементы списка языков
      const languageItems = await langDropdown.locator('li').all();
      const languages: string[] = [];
      
      for (const item of languageItems) {
        const text = await item.textContent();
        if (text && text.trim()) {
          languages.push(text.trim());
        }
      }
      
      // Закрываем выпадающий список
      await langToggle.click();
      
      this.logSuccess(`Found ${languages.length} available languages`);
      return languages;
    } catch (error) {
      this.logError(`Failed to get available languages: ${error}`);
      return [];
    }
  }

  /**
   * Проверить, поддерживается ли язык
   */
  async isLanguageSupported(language: string): Promise<boolean> {
    this.logStep(`Checking if language is supported: ${language}`);
    
    try {
      const availableLanguages = await this.getAvailableLanguages();
      const isSupported = availableLanguages.some(lang => 
        lang.toLowerCase().includes(language.toLowerCase())
      );
      
      this.logStep(`Language ${language} supported: ${isSupported}`);
      return isSupported;
    } catch (error) {
      this.logError(`Failed to check language support: ${error}`);
      return false;
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Получить информацию о языках
   */
  async getLanguageInfo(): Promise<{ current: string; available: string[]; supported: boolean }> {
    const current = await this.getCurrentLanguage();
    const available = await this.getAvailableLanguages();
    const supported = available.length > 0;
    
    return {
      current,
      available,
      supported
    };
  }

  /**
   * Переключить на следующий доступный язык
   */
  async switchToNextLanguage(): Promise<boolean> {
    this.logStep('Switching to next available language');
    
    try {
      const availableLanguages = await this.getAvailableLanguages();
      const currentLanguage = await this.getCurrentLanguage();
      
      if (availableLanguages.length <= 1) {
        this.logStep('Only one language available, cannot switch');
        return false;
      }
      
      // Находим текущий язык в списке
      const currentIndex = availableLanguages.findIndex(lang => 
        lang.toLowerCase().includes(currentLanguage.toLowerCase())
      );
      
      // Переключаемся на следующий язык
      const nextIndex = (currentIndex + 1) % availableLanguages.length;
      const nextLanguage = availableLanguages[nextIndex];
      
      return await this.changeLanguage(nextLanguage);
    } catch (error) {
      this.logError(`Failed to switch to next language: ${error}`);
      return false;
    }
  }
}
