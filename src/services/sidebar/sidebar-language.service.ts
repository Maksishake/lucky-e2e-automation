/**
 * Sidebar Language Service - Сервис для работы с языками в сайдбаре
 * Отвечает за смену языка интерфейса
 */

import { Page } from '@playwright/test';
import { BaseService } from '../../core/base.service';

export class SidebarLanguageService extends BaseService {
  constructor(page: Page) {
    super(page, 'SidebarLanguageService');
  }

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
      const currentLang = sidebar.locator('.lang-toggle .icon-lang');
      
      if (await currentLang.count() > 0) {
        const altText = await currentLang.getAttribute('alt');
        if (altText) {
          // Извлекаем код языка из alt текста
          const langCode = altText.split('/').pop()?.replace('.svg', '') || 'uk';
          this.logSuccess(`Current language: ${langCode}`);
          return langCode;
        }
      }
      
      this.logStep('Could not determine current language');
      return 'uk'; // По умолчанию украинский
    } catch (error) {
      this.logError(`Failed to get current language: ${error}`);
      return 'uk';
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
      
      // Открываем выпадающий список
      await langToggle.click();
      
      const langDropdown = sidebar.locator('.lang-dropdown');
      await langDropdown.waitFor({ state: 'visible', timeout: 3000 });
      
      const languageItems = langDropdown.locator('li');
      const items = await languageItems.all();
      const languages: string[] = [];
      
      for (const item of items) {
        const text = await item.textContent();
        if (text) {
          languages.push(text.trim());
        }
      }
      
      // Закрываем выпадающий список
      await this.page.keyboard.press('Escape');
      
      this.logSuccess(`Available languages: ${languages.join(', ')}`);
      return languages;
    } catch (error) {
      this.logError(`Failed to get available languages: ${error}`);
      return [];
    }
  }

  /**
   * Проверить, открыт ли выпадающий список языков
   */
  async isLanguageDropdownOpen(): Promise<boolean> {
    this.logStep('Checking if language dropdown is open');
    
    try {
      const sidebar = this.page.locator('sidebar.menu');
      const langDropdown = sidebar.locator('.lang-dropdown');
      const isVisible = await langDropdown.isVisible();
      
      this.logStep(`Language dropdown visibility: ${isVisible}`);
      return isVisible;
    } catch (error) {
      this.logError(`Failed to check language dropdown status: ${error}`);
      return false;
    }
  }

  /**
   * Закрыть выпадающий список языков
   */
  async closeLanguageDropdown(): Promise<boolean> {
    this.logStep('Closing language dropdown');
    
    try {
      if (await this.isLanguageDropdownOpen()) {
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(500);
        
        this.logSuccess('Language dropdown closed');
        return true;
      }
      
      this.logStep('Language dropdown is already closed');
      return true;
    } catch (error) {
      this.logError(`Failed to close language dropdown: ${error}`);
      return false;
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
      
      this.logStep(`Language support status: ${isSupported}`);
      return isSupported;
    } catch (error) {
      this.logError(`Failed to check language support: ${error}`);
      return false;
    }
  }

  /**
   * Получить информацию о языках
   */
  async getLanguageInfo(): Promise<Array<{ code: string; name: string; isSelected: boolean }>> {
    this.logStep('Getting language information');
    
    try {
      const sidebar = this.page.locator('sidebar.menu');
      const langToggle = sidebar.locator('.lang-toggle');
      
      // Открываем выпадающий список
      await langToggle.click();
      
      const langDropdown = sidebar.locator('.lang-dropdown');
      await langDropdown.waitFor({ state: 'visible', timeout: 3000 });
      
      const languageItems = langDropdown.locator('li');
      const items = await languageItems.all();
      const languageInfo: Array<{ code: string; name: string; isSelected: boolean }> = [];
      
      for (const item of items) {
        const text = await item.textContent();
        const isSelected = await item.locator('.selected').count() > 0;
        const icon = item.locator('.icon-lang');
        const altText = await icon.getAttribute('alt');
        
        if (text && altText) {
          const code = altText.split('/').pop()?.replace('.svg', '') || 'uk';
          languageInfo.push({
            code,
            name: text.trim(),
            isSelected
          });
        }
      }
      
      // Закрываем выпадающий список
      await this.page.keyboard.press('Escape');
      
      this.logSuccess(`Found ${languageInfo.length} language options`);
      return languageInfo;
    } catch (error) {
      this.logError(`Failed to get language information: ${error}`);
      return [];
    }
  }
}
