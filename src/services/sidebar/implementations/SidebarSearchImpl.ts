/**
 * Concrete implementation of Sidebar Search
 * Конкретная реализация поиска в сайдбаре
 */

import { Page } from '@playwright/test';
import { BaseService } from '@core/base.service';
import { ISidebarSearch } from '../interfaces/ISidebarSearch';

/**
 * Конкретная реализация поиска в сайдбаре
 * Применяет принцип SRP - только поиск
 */
export class SidebarSearchImpl extends BaseService implements ISidebarSearch {
  constructor(page: Page) {
    super(page, 'SidebarSearchImpl');
  }

  // ==================== IMPLEMENTED METHODS ====================

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
   * Закрыть поиск
   */
  async closeSearch(): Promise<boolean> {
    this.logStep('Closing search modal');
    
    try {
      const searchModal = this.page.locator('[wire\\:id*="modal-search"]');
      
      if (await searchModal.isVisible()) {
        // Ищем кнопку закрытия или кликаем вне модального окна
        const closeButton = searchModal.locator('.close, .btn-close, [data-dismiss="modal"]');
        
        if (await closeButton.count() > 0) {
          await closeButton.click();
        } else {
          // Кликаем вне модального окна
          await this.page.keyboard.press('Escape');
        }
        
        // Ждем исчезновения модального окна
        await searchModal.waitFor({ state: 'hidden', timeout: 3000 });
        
        this.logSuccess('Search modal closed successfully');
        return true;
      }
      
      this.logStep('Search modal was not open');
      return true;
    } catch (error) {
      this.logError(`Failed to close search: ${error}`);
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
   * Выполнить поиск
   */
  async search(query: string): Promise<boolean> {
    this.logStep(`Performing search for: ${query}`);
    
    try {
      // Сначала открываем поиск, если он не открыт
      if (!(await this.isSearchOpen())) {
        const opened = await this.openSearch();
        if (!opened) {
          return false;
        }
      }
      
      // Находим поле поиска
      const searchInput = this.page.locator('[wire\\:id*="modal-search"] input[type="text"], [wire\\:id*="modal-search"] input[placeholder*="search" i]');
      
      if (await searchInput.count() > 0) {
        // Очищаем поле и вводим запрос
        await searchInput.clear();
        await searchInput.fill(query);
        
        // Нажимаем Enter или ищем кнопку поиска
        const searchButton = this.page.locator('[wire\\:id*="modal-search"] button[type="submit"], [wire\\:id*="modal-search"] .btn-search');
        
        if (await searchButton.count() > 0) {
          await searchButton.click();
        } else {
          await searchInput.press('Enter');
        }
        
        // Ждем результатов поиска
        await this.page.waitForTimeout(2000);
        
        this.logSuccess(`Search performed for: ${query}`);
        return true;
      } else {
        this.logError('Search input field not found');
        return false;
      }
    } catch (error) {
      this.logError(`Failed to perform search: ${error}`);
      return false;
    }
  }

  /**
   * Очистить поиск
   */
  async clearSearch(): Promise<boolean> {
    this.logStep('Clearing search');
    
    try {
      if (await this.isSearchOpen()) {
        const searchInput = this.page.locator('[wire\\:id*="modal-search"] input[type="text"]');
        
        if (await searchInput.count() > 0) {
          await searchInput.clear();
          this.logSuccess('Search cleared successfully');
          return true;
        }
      }
      
      this.logStep('Search was not open or input not found');
      return true;
    } catch (error) {
      this.logError(`Failed to clear search: ${error}`);
      return false;
    }
  }
}
