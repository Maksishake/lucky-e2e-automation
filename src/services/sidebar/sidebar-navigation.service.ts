/**
 * Sidebar Navigation Service - Сервис для навигации по сайдбару
 * Отвечает за переходы между категориями игр
 */

import { Page } from '@playwright/test';
import { BaseService } from '../../core/base.service';

export class SidebarNavigationService extends BaseService {
  constructor(page: Page) {
    super(page, 'SidebarNavigationService');
  }

  /**
   * Перейти к категории "Все игры"
   */
  async goToAllGames(): Promise<boolean> {
    this.logStep('Navigating to All Games category');
    
    try {
      const sidebar = this.page.locator('sidebar.menu');
      const allGamesLink = sidebar.locator('a[href*="/category/all"]');
      
      await allGamesLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      
      this.logSuccess('Navigated to All Games category');
      return true;
    } catch (error) {
      this.logError(`Failed to navigate to All Games: ${error}`);
      return false;
    }
  }

  /**
   * Перейти к категории "Популярные"
   */
  async goToPopular(): Promise<boolean> {
    this.logStep('Navigating to Popular category');
    
    try {
      const sidebar = this.page.locator('sidebar.menu');
      const popularLink = sidebar.locator('a[href*="/category/popular"]');
      
      await popularLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      
      this.logSuccess('Navigated to Popular category');
      return true;
    } catch (error) {
      this.logError(`Failed to navigate to Popular: ${error}`);
      return false;
    }
  }

  /**
   * Перейти к категории "Новые"
   */
  async goToNew(): Promise<boolean> {
    this.logStep('Navigating to New category');
    
    try {
      const sidebar = this.page.locator('sidebar.menu');
      const newLink = sidebar.locator('a[href*="/category/new"]');
      
      await newLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      
      this.logSuccess('Navigated to New category');
      return true;
    } catch (error) {
      this.logError(`Failed to navigate to New: ${error}`);
      return false;
    }
  }

  /**
   * Перейти к категории "Слоты"
   */
  async goToSlots(): Promise<boolean> {
    this.logStep('Navigating to Slots category');
    
    try {
      const sidebar = this.page.locator('sidebar.menu');
      const slotsLink = sidebar.locator('a[href*="/category/slots"]');
      
      await slotsLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      
      this.logSuccess('Navigated to Slots category');
      return true;
    } catch (error) {
      this.logError(`Failed to navigate to Slots: ${error}`);
      return false;
    }
  }

  /**
   * Перейти к категории "Buy Bonus"
   */
  async goToBuyBonus(): Promise<boolean> {
    this.logStep('Navigating to Buy Bonus category');
    
    try {
      const sidebar = this.page.locator('sidebar.menu');
      const buyBonusLink = sidebar.locator('a[href*="/category/buy-bonus"]');
      
      await buyBonusLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      
      this.logSuccess('Navigated to Buy Bonus category');
      return true;
    } catch (error) {
      this.logError(`Failed to navigate to Buy Bonus: ${error}`);
      return false;
    }
  }

  /**
   * Перейти к категории "Live Casino"
   */
  async goToLiveCasino(): Promise<boolean> {
    this.logStep('Navigating to Live Casino category');
    
    try {
      const sidebar = this.page.locator('sidebar.menu');
      const liveCasinoLink = sidebar.locator('a[href*="/category/live-casino"]');
      
      await liveCasinoLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      
      this.logSuccess('Navigated to Live Casino category');
      return true;
    } catch (error) {
      this.logError(`Failed to navigate to Live Casino: ${error}`);
      return false;
    }
  }

  /**
   * Перейти к категории "Show Games"
   */
  async goToShowGames(): Promise<boolean> {
    this.logStep('Navigating to Show Games category');
    
    try {
      const sidebar = this.page.locator('sidebar.menu');
      const showGamesLink = sidebar.locator('a[href*="/category/show-games"]');
      
      await showGamesLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      
      this.logSuccess('Navigated to Show Games category');
      return true;
    } catch (error) {
      this.logError(`Failed to navigate to Show Games: ${error}`);
      return false;
    }
  }

  /**
   * Перейти к избранному
   */
  async goToFavorites(): Promise<boolean> {
    this.logStep('Navigating to Favorites');
    
    try {
      const sidebar = this.page.locator('sidebar.menu');
      const favoritesLink = sidebar.locator('a[href*="/favorite"]');
      
      await favoritesLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      
      this.logSuccess('Navigated to Favorites');
      return true;
    } catch (error) {
      this.logError(`Failed to navigate to Favorites: ${error}`);
      return false;
    }
  }

  /**
   * Перейти к бонусам
   */
  async goToBonuses(): Promise<boolean> {
    this.logStep('Navigating to Bonuses');
    
    try {
      const sidebar = this.page.locator('sidebar.menu');
      const bonusesLink = sidebar.locator('a[href*="/bonuses"]');
      
      await bonusesLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      
      this.logSuccess('Navigated to Bonuses');
      return true;
    } catch (error) {
      this.logError(`Failed to navigate to Bonuses: ${error}`);
      return false;
    }
  }

  /**
   * Перейти к турнирам
   */
  async goToTournaments(): Promise<boolean> {
    this.logStep('Navigating to Tournaments');
    
    try {
      const sidebar = this.page.locator('sidebar.menu');
      const tournamentsLink = sidebar.locator('a[href*="/tournaments"]');
      
      await tournamentsLink.click();
      await this.page.waitForLoadState('domcontentloaded');
      
      this.logSuccess('Navigated to Tournaments');
      return true;
    } catch (error) {
      this.logError(`Failed to navigate to Tournaments: ${error}`);
      return false;
    }
  }

  /**
   * Проверить, что мы находимся в определенной категории
   */
  async isInCategory(categoryName: string): Promise<boolean> {
    this.logStep(`Checking if we are in category: ${categoryName}`);
    
    try {
      const sidebar = this.page.locator('sidebar.menu');
      const categoryLink = sidebar.locator(`a[href*="/category/${categoryName}"]`);
      const isActive = await categoryLink.locator('..').locator('.current-page').count() > 0;
      
      this.logStep(`Category active status: ${isActive}`);
      return isActive;
    } catch (error) {
      this.logError(`Failed to check category status: ${error}`);
      return false;
    }
  }

  /**
   * Получить текущую активную категорию
   */
  async getCurrentCategory(): Promise<string | null> {
    this.logStep('Getting current active category');
    
    try {
      const sidebar = this.page.locator('sidebar.menu');
      const activeItem = sidebar.locator('.current-page a');
      
      if (await activeItem.count() > 0) {
        const href = await activeItem.getAttribute('href');
        if (href) {
          const category = href.split('/').pop();
          this.logSuccess(`Current category: ${category}`);
          return category || null; 
        }
      }
      
      this.logStep('No active category found');
      return null;
    } catch (error) {
      this.logError(`Failed to get current category: ${error}`);
      return null;
    }
  }
}
