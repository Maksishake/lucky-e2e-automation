/**
 * Game Grid Component - Упрощенный компонент сетки игр
 * Применяет принцип SRP - только работа с сеткой игр
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@/core/abstract/base-component';
import { ILogger } from '@/core/interfaces/logger.interface';
import { GameInfo, GameGridState } from '@/types/game.types';
import { GameCardComponent } from './game-card.component';
import { GameSelectors } from '@/core/selectors/GameSelectors';
import { logger } from '@/core/logger';

export class GameGridComponent extends BaseComponent {
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'GameGrid', GameSelectors.GAME_GRID, loggerInstance || logger);
  }

  // ============ СЕЛЕКТОРЫ ============
  
  get gameCards(): Locator {
    return this.rootElement.locator(GameSelectors.GAME_CARDS);
  }

  get loadingSpinner(): Locator {
    return this.rootElement.locator(GameSelectors.LOADING_SPINNER);
  }

  get emptyState(): Locator {
    return this.rootElement.locator(GameSelectors.EMPTY_STATE);
  }

  // ============ ОСНОВНЫЕ МЕТОДЫ ============

  async getGamesCount(): Promise<number> {
    try {
      await this.waitForGridLoad();
      const count = await this.gameCards.count();
      this.logStep(`Games count: ${count}`);
      return count;
    } catch (error) {
      this.logError('Failed to get games count', error);
      return 0;
    }
  }

  async getGameCardByIndex(index: number): Promise<GameCardComponent> {
    const cardLocator = this.gameCards.nth(index);
    return new GameCardComponent(this.page, cardLocator, this.logger);
  }

  async getGameInfoByIndex(index: number): Promise<GameInfo | null> {
    try {
      const gameCard = await this.getGameCardByIndex(index);
      const gameInfo = await gameCard.getGameInfo();
      gameInfo.index = index; // Устанавливаем правильный индекс
      return gameInfo;
    } catch (error) {
      this.logError(`Failed to get game info by index: ${index}`, error);
      return null;
    }
  }

  async clickGameByIndex(index: number): Promise<void> {
    this.logStep(`Clicking game card at index: ${index}`);
    
    try {
      const gameCard = await this.getGameCardByIndex(index);
      await gameCard.clickCard();
      this.logSuccess(`Game card clicked at index: ${index}`);
    } catch (error) {
      this.logError(`Failed to click game at index: ${index}`, error);
      throw error;
    }
  }

  async waitForGridLoad(): Promise<void> {
    this.logStep('Waiting for game grid to load');
    
    try {
      // Ждем исчезновения спиннера загрузки
      if (await this.loadingSpinner.isVisible()) {
        await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
      }
      
      // Ждем появления хотя бы одной карточки игры
      await this.gameCards.first().waitFor({ state: 'visible', timeout: 15000 });
      
      this.logSuccess('Game grid loaded');
    } catch (error) {
      this.logError('Game grid did not load in time', error);
      throw error;
    }
  }

  async getGridState(): Promise<GameGridState> {
    this.logStep('Getting game grid state');
    
    try {
      const gamesCount = await this.getGamesCount();
      const gamesInfo: GameInfo[] = [];
      
      for (let i = 0; i < gamesCount; i++) {
        const info = await this.getGameInfoByIndex(i);
        if (info) {
          gamesInfo.push(info);
        }
      }
      
      const state: GameGridState = {
        games: gamesInfo.map(info => ({
          id: `${info.index}`,
          title: info.title,
          provider: info.provider,
          imageUrl: info.image || '',
          isFavorite: false, // Будет установлено отдельно
          hasDemo: info.hasDemoButton || false,
          hasReal: info.hasPlayButton || false,
          category: info.type || 'slot',
          gameUrl: ''
        })),
        isLoading: false,
        hasMore: false,
        currentPage: 1,
        totalCount: gamesCount
      };
      
      this.logSuccess('Game grid state retrieved');
      return state;
    } catch (error) {
      this.logError('Failed to get grid state', error);
      return {
        games: [],
        isLoading: false,
        hasMore: false,
        currentPage: 1,
        totalCount: 0
      };
    }
  }

  // ============ ПРОВЕРКИ СОСТОЯНИЯ ============

  async isGridVisible(): Promise<boolean> {
    return await this.rootElement.isVisible();
  }

  async isEmpty(): Promise<boolean> {
    return await this.emptyState.isVisible();
  }

  async isLoading(): Promise<boolean> {
    return await this.loadingSpinner.isVisible();
  }

  async hasGames(): Promise<boolean> {
    const count = await this.getGamesCount();
    return count > 0;
  }

  // ============ ДОПОЛНИТЕЛЬНЫЕ МЕТОДЫ ============

  async scrollToGame(index: number): Promise<void> {
    this.logStep(`Scrolling to game at index: ${index}`);
    
    try {
      const gameCard = this.gameCards.nth(index);
      await gameCard.scrollIntoViewIfNeeded();
      this.logSuccess(`Scrolled to game at index: ${index}`);
    } catch (error) {
      this.logError(`Failed to scroll to game at index: ${index}`, error);
      throw error;
    }
  }

  async getAllGameTitles(): Promise<string[]> {
    this.logStep('Getting all game titles');
    
    try {
      const count = await this.getGamesCount();
      const titles: string[] = [];
      
      for (let i = 0; i < count; i++) {
        const gameCard = await this.getGameCardByIndex(i);
        const title = await gameCard.getCardTitle();
        titles.push(title);
      }
      
      this.logSuccess(`Retrieved ${titles.length} game titles`);
      return titles;
    } catch (error) {
      this.logError('Failed to get all game titles', error);
      return [];
    }
  }

  async findGameByTitle(title: string): Promise<number | null> {
    this.logStep(`Finding game by title: ${title}`);
    
    try {
      const count = await this.getGamesCount();
      
      for (let i = 0; i < count; i++) {
        const gameCard = await this.getGameCardByIndex(i);
        const gameTitle = await gameCard.getCardTitle();
        
        if (gameTitle.toLowerCase().includes(title.toLowerCase())) {
          this.logSuccess(`Game found at index: ${i}`);
          return i;
        }
      }
      
      this.logStep(`Game not found: ${title}`);
      return null;
    } catch (error) {
      this.logError(`Failed to find game by title: ${title}`, error);
      return null;
    }
  }
}