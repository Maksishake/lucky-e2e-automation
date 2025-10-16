/**
 * Sidebar Search Service - Сервис для работы с поиском в сайдбаре
 * Отвечает за открытие и управление поиском
 */

import { Page } from '@playwright/test';
import { BaseService } from '../../core/base.service';

export class SidebarSearchService extends BaseService {
  constructor(page: Page) {
    super(page, 'SidebarSearchService');
  }

  /**
   * Открыть поиск
   */
  async openSearch(): Promise<boolean> {
    this.logStep('Opening search modal');
    
    try {
      const sidebar = this.page.locator('sidebar.menu');
      const searchToggle = sidebar.locator('.search-toggle');
      
      await searchToggle.click();
      
      // Ждем появления модального окна поиска
      await this.page.waitForSelector('[wire\\:id*="modal-search"]', { 
        state: 'visible', 
        timeout: 5000 
      });
      
      this.logSuccess('Search modal opened successfully');
      return true;
    } catch (error) {
      this.logError(`Failed to open search: ${error}`);
      return false;
    }
  }

  /**
   * Проверить, открыт ли поиск
   */
  async isSearchOpen(): Promise<boolean> {
    this.logStep('Checking if search is open');
    
    try {
      const searchModal = this.page.locator('[wire\\:id*="modal-search"]');
      const isVisible = await searchModal.isVisible();
      
      this.logStep(`Search modal visibility: ${isVisible}`);
      return isVisible;
    } catch (error) {
      this.logError(`Failed to check search status: ${error}`);
      return false;
    }
  }

  /**
   * Закрыть поиск
   */
  async closeSearch(): Promise<boolean> {
    this.logStep('Closing search modal');
    
    try {
      const searchModal = this.page.locator('[wire\\:id*="modal-search"]');
      
      if (await searchModal.isVisible()) {
        // Ищем кнопку закрытия или кликаем по backdrop
        const closeButton = searchModal.locator('.close, .modal-close, [data-dismiss="modal"]');
        
        if (await closeButton.count() > 0) {
          await closeButton.click();
        } else {
          // Если нет кнопки закрытия, нажимаем Escape
          await this.page.keyboard.press('Escape');
        }
        
        // Ждем скрытия модального окна
        await searchModal.waitFor({ state: 'hidden', timeout: 3000 });
      }
      
      this.logSuccess('Search modal closed successfully');
      return true;
    } catch (error) {
      this.logError(`Failed to close search: ${error}`);
      return false;
    }
  }

  /**
   * Выполнить поиск
   */
  async performSearch(query: string): Promise<boolean> {
    this.logStep(`Performing search for: ${query}`);
    
    try {
      // Сначала открываем поиск
      if (!await this.openSearch()) {
        return false;
      }
      
      // Ищем поле ввода поиска
      const searchInput = this.page.locator('[wire\\:id*="modal-search"] input[type="text"], [wire\\:id*="modal-search"] input[type="search"]');
      
      if (await searchInput.count() > 0) {
        await searchInput.fill(query);
        await this.page.keyboard.press('Enter');
        
        // Ждем результатов поиска
        await this.page.waitForTimeout(2000);
        
        this.logSuccess(`Search performed for: ${query}`);
        return true;
      } else {
        this.logError('Search input not found');
        return false;
      }
    } catch (error) {
      this.logError(`Failed to perform search: ${error}`);
      return false;
    }
  }

  /**
   * Получить результаты поиска
   */
  async getSearchResults(): Promise<Array<{ title: string; href: string }>> {
    this.logStep('Getting search results');
    
    try {
      const searchModal = this.page.locator('[wire\\:id*="modal-search"]');
      const resultItems = searchModal.locator('.search-result, .game-item, .result-item');
      
      const results: Array<{ title: string; href: string }> = [];
      const items = await resultItems.all();
      
      for (const item of items) {
        const title = await item.locator('.title, .name, h3, h4').textContent();
        const link = item.locator('a').first();
        const href = await link.getAttribute('href');
        
        if (title && href) {
          results.push({
            title: title.trim(),
            href: href
          });
        }
      }
      
      this.logSuccess(`Found ${results.length} search results`);
      return results;
    } catch (error) {
      this.logError(`Failed to get search results: ${error}`);
      return [];
    }
  }

  /**
   * Очистить поиск
   */
  async clearSearch(): Promise<boolean> {
    this.logStep('Clearing search');
    
    try {
      const searchModal = this.page.locator('[wire\\:id*="modal-search"]');
      const searchInput = searchModal.locator('input[type="text"], input[type="search"]');
      
      if (await searchInput.count() > 0) {
        await searchInput.fill('');
        await this.page.keyboard.press('Enter');
        
        this.logSuccess('Search cleared successfully');
        return true;
      }
      
      this.logError('Search input not found');
      return false;
    } catch (error) {
      this.logError(`Failed to clear search: ${error}`);
      return false;
    }
  }

  /**
   * Проверить, есть ли результаты поиска
   */
  async hasSearchResults(): Promise<boolean> {
    this.logStep('Checking if search has results');
    
    try {
      const searchModal = this.page.locator('[wire\\:id*="modal-search"]');
      const resultItems = searchModal.locator('.search-result, .game-item, .result-item');
      const count = await resultItems.count();
      
      this.logStep(`Search results count: ${count}`);
      return count > 0;
    } catch (error) {
      this.logError(`Failed to check search results: ${error}`);
      return false;
    }
  }
}
