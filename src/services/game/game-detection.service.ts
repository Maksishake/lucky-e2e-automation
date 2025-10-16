/**
 * Game Detection Service - Сервис для поиска и получения игр
 */

import { Locator, Page } from '@playwright/test';
import { BaseService } from '../../core/base.service';

export class GameDetectionService extends BaseService {
  // Селекторы для игр
  get gameCard(): Locator {
    return this.page.locator('.game-card');
  }
  
  get gameTitle(): Locator {
    return this.page.locator('.game-card .title');
  }
  
  get gameProvider(): Locator {
    return this.page.locator('.game-card .provider');
  }
  
  get gameImage(): Locator {
    return this.page.locator('.game-card img');
  }
  
  get favoriteButton(): Locator {
    return this.page.locator('.game-card .favorite-btn');
  }
  
  get playButton(): Locator {
    return this.page.locator('.game-card .play-btn');
  }
  
  get demoButton(): Locator {
    return this.page.locator('.game-card .btn-secondary');
  }

  get realButton(): Locator {
    return this.page.locator('.game-card .btn-default');
  }

  get gameGrid(): Locator {
    return this.page.locator('.game-grid, .games-list');
  }

  get searchInput(): Locator {
    return this.page.locator('input[type="search"], .search-input');
  }

  get categoryFilter(): Locator {
    return this.page.locator('.category-filter, [data-filter="category"]');
  }

  get providerFilter(): Locator {
    return this.page.locator('.provider-filter, [data-filter="provider"]');
  }

  constructor(page: Page) {
    super(page, 'GameDetectionService');
  }

  /**
   * Найти игру на странице по названию
   */
  async findGameOnPage(title: string): Promise<boolean> {
    this.logStep(`Finding game on page: ${title}`);
    
    try {
      const gameCards = await this.gameCard.all();
      
      for (const card of gameCards) {
        const gameTitle = await card.locator('.title').textContent();
        if (gameTitle && gameTitle.toLowerCase().includes(title.toLowerCase())) {
          this.logSuccess(`Game found on page: ${title}`);
          return true;
        }
      }
      
      this.logError(`Game not found on page: ${title}`);
      return false;
    } catch (error) {
      this.logError(`Failed to find game on page: ${error}`);
      return false;
    }
  }

  /**
   * Получить игру по индексу
   */
  async getGameByIndex(index: number): Promise<{ title: string; provider: string; locator: Locator } | null> {
    this.logStep(`Getting game by index: ${index}`);
    
    try {
      const gameCards = await this.gameCard.all();
      
      if (index < 0 || index >= gameCards.length) {
        this.logError(`Game index ${index} is out of range. Available games: ${gameCards.length}`);
        return null;
      }
      
      const gameCard = gameCards[index];
      const title = await gameCard.locator('.title').textContent();
      const provider = await gameCard.locator('.provider').textContent();
      
      if (!title) {
        this.logError(`Game at index ${index} has no title`);
        return null;
      }
      
      this.logSuccess(`Game found at index ${index}: ${title} (${provider || 'Unknown provider'})`);
      return {
        title: title.trim(),
        provider: provider?.trim() || 'Unknown',
        locator: gameCard
      };
    } catch (error) {
      this.logError(`Failed to get game by index ${index}: ${error}`);
      return null;
    }
  }

  /**
   * Получить все игры на странице с их индексами
   */
  async getAllGamesWithIndexes(): Promise<Array<{ index: number; title: string; provider: string; locator: Locator }>> {
    this.logStep('Getting all games with indexes');
    
    try {
      const gameCards = await this.gameCard.all();
      const games: Array<{ index: number; title: string; provider: string; locator: Locator }> = [];
      
      for (let i = 0; i < gameCards.length; i++) {
        const gameCard = gameCards[i];
        const title = await gameCard.locator('.title').textContent();
        const provider = await gameCard.locator('.provider').textContent();
        
        if (title) {
          games.push({
            index: i,
            title: title.trim(),
            provider: provider?.trim() || 'Unknown',
            locator: gameCard
          });
        }
      }
      
      this.logSuccess(`Found ${games.length} games with indexes`);
      return games;
    } catch (error) {
      this.logError(`Failed to get all games with indexes: ${error}`);
      return [];
    }
  }

  /**
   * Найти игру по индексу с фильтром по провайдеру
   */
  async findGameByIndexWithProvider(
    index: number, 
    providerName: string
  ): Promise<{ title: string; provider: string; locator: Locator } | null> {
    this.logStep(`Finding game by index ${index} with provider filter: ${providerName}`);
    
    try {
      // Применяем фильтр по провайдеру
      await this.filterByProvider(providerName);
      await this.page.waitForTimeout(2000);
      
      // Получаем игру по индексу
      const gameData = await this.getGameByIndex(index);
      
      if (gameData && gameData.provider.toLowerCase().includes(providerName.toLowerCase())) {
        this.logSuccess(`Game found by index ${index} with provider ${providerName}: ${gameData.title}`);
        return gameData;
      }
      
      this.logError(`Game at index ${index} does not match provider ${providerName}`);
      return null;
    } catch (error) {
      this.logError(`Failed to find game by index ${index} with provider ${providerName}: ${error}`);
      return null;
    }
  }

  /**
   * Получить игры по провайдеру с индексами
   */
  async getGamesByProviderWithIndexes(
    providerName: string
  ): Promise<Array<{ index: number; title: string; provider: string; locator: Locator }>> {
    this.logStep(`Getting games by provider with indexes: ${providerName}`);
    
    try {
      // Применяем фильтр по провайдеру
      await this.filterByProvider(providerName);
      await this.page.waitForTimeout(2000);
      
      // Получаем все игры с индексами
      const allGames = await this.getAllGamesWithIndexes();
      
      // Фильтруем по провайдеру
      const filteredGames = allGames.filter(game => 
        game.provider.toLowerCase().includes(providerName.toLowerCase())
      );
      
      this.logSuccess(`Found ${filteredGames.length} games for provider ${providerName}`);
      return filteredGames;
    } catch (error) {
      this.logError(`Failed to get games by provider ${providerName}: ${error}`);
      return [];
    }
  }

  /**
   * Получить случайную игру по индексу
   */
  async getRandomGameByIndex(): Promise<{ index: number; title: string; provider: string; locator: Locator } | null> {
    this.logStep('Getting random game by index');
    
    try {
      const allGames = await this.getAllGamesWithIndexes();
      
      if (allGames.length === 0) {
        this.logError('No games found on page');
        return null;
      }
      
      const randomIndex = Math.floor(Math.random() * allGames.length);
      const randomGame = allGames[randomIndex];
      
      this.logSuccess(`Random game selected: index ${randomIndex}, ${randomGame.title} (${randomGame.provider})`);
      return randomGame;
    } catch (error) {
      this.logError(`Failed to get random game: ${error}`);
      return null;
    }
  }

  /**
   * Получить игры по диапазону индексов
   */
  async getGamesByIndexRange(
    startIndex: number, 
    endIndex: number
  ): Promise<Array<{ index: number; title: string; provider: string; locator: Locator }>> {
    this.logStep(`Getting games by index range: ${startIndex} to ${endIndex}`);
    
    try {
      const allGames = await this.getAllGamesWithIndexes();
      
      if (startIndex < 0 || endIndex >= allGames.length || startIndex > endIndex) {
        this.logError(`Invalid index range: ${startIndex} to ${endIndex}. Available games: ${allGames.length}`);
        return [];
      }
      
      const gamesInRange = allGames.slice(startIndex, endIndex + 1);
      
      this.logSuccess(`Found ${gamesInRange.length} games in range ${startIndex} to ${endIndex}`);
      return gamesInRange;
    } catch (error) {
      this.logError(`Failed to get games by index range ${startIndex} to ${endIndex}: ${error}`);
      return [];
    }
  }

  /**
   * Получить количество игр на странице
   */
  async getGamesCount(): Promise<number> {
    this.logStep('Getting games count on page');
    
    try {
      const count = await this.gameCard.count();
      this.logSuccess(`Found ${count} games on page`);
      return count;
    } catch (error) {
      this.logError(`Failed to get games count: ${error}`);
      return 0;
    }
  }

  /**
   * Получить список названий игр на странице
   */
  async getGamesTitles(): Promise<string[]> {
    this.logStep('Getting games titles on page');
    
    try {
      const gameCards = await this.gameCard.all();
      const titles: string[] = [];
      
      for (const card of gameCards) {
        const title = await card.locator('.title').textContent();
        if (title) {
          titles.push(title.trim());
        }
      }
      
      this.logSuccess(`Found ${titles.length} game titles`);
      return titles;
    } catch (error) {
      this.logError(`Failed to get games titles: ${error}`);
      return [];
    }
  }

  /**
   * Проверить, есть ли игры на странице
   */
  async hasGames(): Promise<boolean> {
    this.logStep('Checking if games are present on page');
    
    try {
      const count = await this.gameCard.count();
      const hasGames = count > 0;
      this.logStep(`Games present: ${hasGames} (${count} games)`);
      return hasGames;
    } catch (error) {
      this.logError(`Failed to check games presence: ${error}`);
      return false;
    }
  }

  /**
   * Дождаться загрузки игр
   */
  async waitForGamesLoad(): Promise<void> {
    this.logStep('Waiting for games to load');
    
    try {
      await this.gameGrid.waitFor({ state: 'visible', timeout: 10000 });
      await this.page.waitForTimeout(1000);
      this.logSuccess('Games loaded');
    } catch (error) {
      this.logError(`Failed to wait for games load: ${error}`);
    }
  }

  /**
   * Поиск игр по запросу
   */
  async searchGames(query: string): Promise<boolean> {
    this.logStep(`Searching games: ${query}`);
    
    try {
      if (await this.searchInput.count() > 0) {
        await this.searchInput.fill(query);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(2000);
        this.logSuccess(`Search completed: ${query}`);
        return true;
      }
      
      this.logError('Search input not found');
      return false;
    } catch (error) {
      this.logError(`Search failed: ${error}`);
      return false;
    }
  }

  /**
   * Фильтр по категории
   */
  async filterByCategory(categoryName: string): Promise<boolean> {
    this.logStep(`Filtering by category: ${categoryName}`);
    
    try {
      if (await this.categoryFilter.count() > 0) {
        await this.categoryFilter.click();
        const categoryOption = this.page.locator(
          `[data-category="${categoryName}"], .category-option:has-text("${categoryName}")`
        );
        await categoryOption.click();
        await this.page.waitForTimeout(1000);
        this.logSuccess(`Category filter applied: ${categoryName}`);
        return true;
      }
      
      this.logError('Category filter not found');
      return false;
    } catch (error) {
      this.logError(`Category filter failed: ${error}`);
      return false;
    }
  }

  /**
   * Фильтр по провайдеру
   */
  async filterByProvider(providerName: string): Promise<boolean> {
    this.logStep(`Filtering by provider: ${providerName}`);
    
    try {
      if (await this.providerFilter.count() > 0) {
        await this.providerFilter.click();
        const providerOption = this.page.locator(
          `[data-provider="${providerName}"], .provider-option:has-text("${providerName}")`
        );
        await providerOption.click();
        await this.page.waitForTimeout(1000);
        this.logSuccess(`Provider filter applied: ${providerName}`);
        return true;
      }
      
      this.logError('Provider filter not found');
      return false;
    } catch (error) {
      this.logError(`Provider filter failed: ${error}`);
      return false;
    }
  }

  /**
   * Очистить поиск
   */
  async clearSearch(): Promise<void> {
    this.logStep('Clearing search');
    
    try {
      if (await this.searchInput.count() > 0) {
        await this.searchInput.fill('');
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(1000);
        this.logSuccess('Search cleared');
      }
    } catch (error) {
      this.logError(`Failed to clear search: ${error}`);
    }
  }

  /**
   * Сбросить все фильтры
   */
  async resetFilters(): Promise<void> {
    this.logStep('Resetting all filters');
    
    try {
      const resetButton = this.page.locator('.reset-filters, .clear-filters, [data-reset="filters"]');
      
      if (await resetButton.count() > 0) {
        await resetButton.click();
        await this.page.waitForTimeout(1000);
        this.logSuccess('Filters reset');
      } else {
        this.logStep('No reset button found, clearing manually');
        await this.clearSearch();
      }
    } catch (error) {
      this.logError(`Failed to reset filters: ${error}`);
    }
  }
}
