/**
 * Game Categories Component - Упрощенный компонент категорий игр
 * Применяет принцип SRP - только работа с категориями и фильтрами
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@/core/abstract/base-component';
import { ILogger } from '@/core/interfaces/logger.interface';
import { GameCategory, GameProvider, GameFilterState } from '@/types/game.types';
import { GameSelectors } from '@/core/selectors/GameSelectors';
import { logger } from '@/core/logger';

export class GameCategoriesComponent extends BaseComponent {
  constructor(page: Page, componentName: string, baseSelector: string, loggerInstance?: ILogger) {
    super(page, componentName, baseSelector, loggerInstance || logger);
  }

  // ============ СЕЛЕКТОРЫ ============
  
  get categoryList(): Locator {
    return this.rootElement.locator(GameSelectors.CATEGORY_LIST);
  }

  get categoryItems(): Locator {
    return this.categoryList.locator(GameSelectors.CATEGORY_ITEMS);
  }

  get providerDropdown(): Locator {
    return this.rootElement.locator(GameSelectors.PROVIDER_DROPDOWN);
  }

  get providerSearchInput(): Locator {
    return this.providerDropdown.locator('input[type="search"], .search-input, [data-testid="provider-search"]');
  }

  get providerItems(): Locator {
    return this.providerDropdown.locator(GameSelectors.PROVIDER_ITEMS);
  }

  get searchInput(): Locator {
    return this.rootElement.locator(GameSelectors.SEARCH_INPUT);
  }

  get searchButton(): Locator {
    return this.rootElement.locator('button.search-button, .btn-search, [data-testid="search-button"]');
  }

  get clearFiltersButton(): Locator {
    return this.rootElement.locator(GameSelectors.CLEAR_FILTERS);
  }

  // ============ ОСНОВНЫЕ МЕТОДЫ ============

  async selectCategory(name: string): Promise<void> {
    this.logStep(`Selecting category: ${name}`);
    
    try {
      const category = this.getCategoryByName(name);
      await category.click();
      await this.waitForGamesToLoad();
      this.logSuccess(`Category selected: ${name}`);
    } catch (error) {
      this.logError(`Failed to select category: ${name}`, error);
      throw error;
    }
  }

  async selectProvider(name: string): Promise<void> {
    this.logStep(`Selecting provider: ${name}`);
    
    try {
      await this.providerDropdown.click(); // Открываем dropdown
      await this.providerSearchInput.fill(name);
      await this.getProviderByName(name).click();
      await this.waitForGamesToLoad();
      this.logSuccess(`Provider selected: ${name}`);
    } catch (error) {
      this.logError(`Failed to select provider: ${name}`, error);
      throw error;
    }
  }

  async searchGame(query: string): Promise<void> {
    this.logStep(`Searching for game: ${query}`);
    
    try {
      await this.searchInput.fill(query);
      await this.searchButton.click();
      await this.waitForGamesToLoad();
      this.logSuccess(`Game search initiated for: ${query}`);
    } catch (error) {
      this.logError(`Failed to search game: ${query}`, error);
      throw error;
    }
  }

  async clearAllFilters(): Promise<void> {
    this.logStep('Clearing all filters');
    
    try {
      await this.clearFiltersButton.click();
      await this.waitForGamesToLoad();
      this.logSuccess('All filters cleared');
    } catch (error) {
      this.logError('Failed to clear filters', error);
      throw error;
    }
  }

  // ============ ПОЛУЧЕНИЕ ДАННЫХ ============

  async getFilterState(): Promise<GameFilterState> {
    this.logStep('Getting current filter state');
    
    try {
      const selectedCategory = await this.activeCategory.textContent() || '';
      const selectedProvider = await this.activeProvider.textContent() || '';
      const searchQuery = await this.searchInput.inputValue() || '';
      
      this.logSuccess('Filter state retrieved');
      return {
        selectedCategory: this.parseCategoryId(selectedCategory),
        selectedProvider: this.parseProviderId(selectedProvider),
        searchQuery,
        showFavorites: false // Будет реализовано отдельно
      };
    } catch (error) {
      this.logError('Failed to get filter state', error);
    return {
        selectedCategory: 0,
        selectedProvider: 0,
      searchQuery: '',
      showFavorites: false
    };
  }
  }

  async getAllCategories(): Promise<GameCategory[]> {
    this.logStep('Getting all categories');
    
    try {
      const categories: GameCategory[] = [];
      const items = await this.categoryItems.all();
      
      for (let i = 0; i < items.length; i++) {
        const category = await this.extractCategoryInfo(items[i], i);
        if (category) {
          categories.push(category);
        }
      }
      
      this.logSuccess(`Retrieved ${categories.length} categories`);
      return categories;
    } catch (error) {
      this.logError('Failed to get all categories', error);
      return [];
    }
  }

  async getAllProviders(): Promise<GameProvider[]> {
    this.logStep('Getting all providers');
    
    try {
      const providers: GameProvider[] = [];
      const items = await this.providerItems.all();
      
      for (let i = 0; i < items.length; i++) {
        const provider = await this.extractProviderInfo(items[i], i);
        if (provider) {
          providers.push(provider);
        }
      }
      
      this.logSuccess(`Retrieved ${providers.length} providers`);
      return providers;
    } catch (error) {
      this.logError('Failed to get all providers', error);
      return [];
    }
  }

  // ============ ПРОВЕРКИ СОСТОЯНИЯ ============

  async isVisible(): Promise<boolean> {
    return await this.rootElement.isVisible();
  }

  async hasActiveCategory(): Promise<boolean> {
    return await this.activeCategory.isVisible();
  }

  async hasActiveProvider(): Promise<boolean> {
    return await this.activeProvider.isVisible();
  }

  // ============ ПРИВАТНЫЕ МЕТОДЫ ============

  private getCategoryByName(name: string): Locator {
    return this.categoryItems.filter({ hasText: name });
  }

  private getProviderByName(name: string): Locator {
    return this.providerItems.filter({ hasText: name });
  }

  private get activeCategory(): Locator {
    return this.categoryItems.locator('.active, .selected, [data-active="true"]');
  }

  private get activeProvider(): Locator {
    return this.providerDropdown.locator('.selected-provider, .active-provider, [data-active="true"]');
  }

  private async waitForGamesToLoad(): Promise<void> {
    // Ждем загрузки игр после изменения фильтров
    await this.page.waitForTimeout(1000);
  }

  private parseCategoryId(categoryText: string): number {
    // Простая логика парсинга ID категории
    return categoryText ? 1 : 0;
  }

  private parseProviderId(providerText: string): number {
    // Простая логика парсинга ID провайдера
    return providerText ? 1 : 0;
  }

  private async extractCategoryInfo(item: Locator, index: number): Promise<GameCategory | null> {
    try {
      const name = await item.textContent() || '';
      const isActive = await item.locator('.active, .selected').isVisible();
      
      return {
        id: index,
        name: name.trim(),
        icon: '',
        count: 0,
        isActive
      };
    } catch (error) {
      return null;
    }
  }

  private async extractProviderInfo(item: Locator, index: number): Promise<GameProvider | null> {
    try {
      const name = await item.textContent() || '';
      const isActive = await item.locator('.active, .selected').isVisible();
      
      return {
        id: index,
        name: name.trim(),
        count: 0,
        isActive
      };
    } catch (error) {
      return null;
    }
  }
}