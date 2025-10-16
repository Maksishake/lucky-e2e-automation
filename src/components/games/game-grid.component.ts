/**
 * Game Grid Component - Компонент сетки игр
 */

import { Page } from '@playwright/test';
import { BaseComponent } from '../../core/base.component';
import { GameCardComponent } from './game-card.component';
import { Game, GameGridState, GameSearchResult } from '../../types/game.types';

export class GameGridComponent extends BaseComponent {

  constructor(page: Page) {
    super(page, 'GameGrid', '.game-cards-vertical');
  }

  // ============ ОСНОВНЫЕ ЭЛЕМЕНТЫ ============
  get gridContainerSelector() {
    return this.page.locator('.game-cards-vertical');
  }

  get gameCardSelector() {
    return this.page.locator('.game-card');
  }

  get loadMoreButtonSelector() {
    return this.page.locator('button[wire\\:click="loadMore"]');
  }

  get loadingTextSelector() {
    return this.page.locator('span[wire\\:loading]');
  }

  get preloaderSelector() {
    return this.page.locator('#preloader');
  }

  get loaderSelector() {
    return this.page.locator('.loader');
  }

  // ============ ОСНОВНЫЕ МЕТОДЫ ============
  /**
   * Проверить, видна ли сетка игр
   */
  async isGridVisible(): Promise<boolean> {
    return await this.isVisible();
  }

  /**
   * Получить количество игровых карточек
   */
  async getGamesCount(): Promise<number> {
    const gameCards = this.gameCardSelector;
    return await gameCards.count();
  }

  // ============ РАБОТА С КАРТОЧКАМИ ============
  /**
   * Получить игровую карточку по индексу
   */
  async getGameCard(): Promise<GameCardComponent> {
    return new GameCardComponent(this.page);
  }

  /**
   * Получить все игровые карточки
   */
  async getAllGameCards(): Promise<GameCardComponent[]> {
    const count = await this.getGamesCount();
    const cards: GameCardComponent[] = [];

    for (let i = 0; i < count; i++) {
      const card = await this.getGameCard();
      cards.push(card);
    }

    return cards;
  }

  /**
   * Получить информацию о всех играх
   */
  async getAllGames(): Promise<Game[]> {
    const cards = await this.getAllGameCards();
    const games: Game[] = [];

    for (const card of cards) {
      const gameInfo = await card.getGameInfo();
      games.push(gameInfo);
    }

    return games;
  }

  // ============ ПОИСК И ФИЛЬТРАЦИЯ ============
  /**
   * Найти игру по названию
   */
  async findGameByTitle(title: string): Promise<GameCardComponent | null> {
    const cards = await this.getAllGameCards();
    
    for (const card of cards) {
      const gameTitle = await card.getGameTitle();
      if (gameTitle.toLowerCase().includes(title.toLowerCase())) {
        return card;
      }
    }

    return null;
  }

  /**
   * Найти игры по провайдеру
   */
  async findGamesByProvider(provider: string): Promise<GameCardComponent[]> {
    const cards = await this.getAllGameCards();
    const matchingCards: GameCardComponent[] = [];

    for (const card of cards) {
      const gameProvider = await card.getGameProvider();
      if (gameProvider.toLowerCase().includes(provider.toLowerCase())) {
        matchingCards.push(card);
      }
    }

    return matchingCards;
  }

  /**
   * Найти избранные игры
   */
  async findFavoriteGames(): Promise<GameCardComponent[]> {
    const cards = await this.getAllGameCards();
    const favoriteCards: GameCardComponent[] = [];

    for (const card of cards) {
      const isFavorite = await card.isFavorite();
      if (isFavorite) {
        favoriteCards.push(card);
      }
    }

    return favoriteCards;
  }

  // ============ ЗАГРУЗКА И ПАГИНАЦИЯ ============
  /**
   * Загрузить больше игр
   */
  async loadMoreGames(): Promise<void> {
    this.logStep('Loading more games');
    await this.loadMoreButtonSelector.click();
    await this.waitForLoadingComplete();
    this.logSuccess('Loaded more games');
  }

  /**
   * Проверить, есть ли кнопка "Загрузить больше"
   */
  async hasLoadMoreButton(): Promise<boolean> {
    const button = this.loadMoreButtonSelector;
    return await button.isVisible();
  }

  /**
   * Проверить, загружаются ли игры
   */
  async isLoading(): Promise<boolean> {
    const loadingText = this.loadingTextSelector;
    const preloader = this.preloaderSelector;
    
    const isTextLoading = await loadingText.isVisible();
    const isPreloaderVisible = await preloader.isVisible();
    
    return isTextLoading || isPreloaderVisible;
  }

  /**
   * Дождаться завершения загрузки
   */
  async waitForLoadingComplete(): Promise<void> {
    this.logStep('Waiting for loading to complete');
    
    // Ждем исчезновения прелоадера
    await this.preloaderSelector.waitFor({ state: 'hidden' });
    
    // Ждем исчезновения текста загрузки
    await this.loadingTextSelector.waitFor({ state: 'hidden' });
    
    // Дополнительная пауза для стабилизации
    await this.page.waitForTimeout(1000);
    
    this.logSuccess('Loading completed');
  }

  /**
   * Дождаться загрузки сетки
   */
  async waitForGridLoad(): Promise<void> {
    this.logStep('Waiting for game grid to load');
    await this.gridContainerSelector.waitFor({ state: 'visible' });
    await this.gameCardSelector.waitFor({ state: 'visible' });
    this.logSuccess('Game grid loaded');
  }

  // ============ ПРОКРУТКА И НАВИГАЦИЯ ============
  /**
   * Прокрутить к кнопке "Загрузить больше"
   */
  async scrollToLoadMoreButton(): Promise<void> {
    this.logStep('Scrolling to load more button');
    const button = this.loadMoreButtonSelector;
    await button.scrollIntoViewIfNeeded();
    this.logSuccess('Scrolled to load more button');
  }

  /**
   * Прокрутить к концу сетки
   */
  async scrollToBottom(): Promise<void> {
    this.logStep('Scrolling to bottom of grid');
    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await this.page.waitForTimeout(500);
    this.logSuccess('Scrolled to bottom');
  }

  // ============ СОСТОЯНИЕ И ИНФОРМАЦИЯ ============
  /**
   * Получить состояние сетки
   */
  async getGridState(): Promise<GameGridState> {
    const games = await this.getAllGames();
    const isLoading = await this.isLoading();
    const hasMore = await this.hasLoadMoreButton();

    return {
      games,
      isLoading,
      hasMore,
      currentPage: 1, // Будет обновляться при пагинации
      totalCount: games.length
    };
  }

  /**
   * Получить результаты поиска
   */
  async getSearchResults(): Promise<GameSearchResult> {
    const games = await this.getAllGames();
    const hasMore = await this.hasLoadMoreButton();

    return {
      games,
      totalCount: games.length,
      hasMore
    };
  }

  /**
   * Проверить, пуста ли сетка
   */
  async isEmpty(): Promise<boolean> {
    const count = await this.getGamesCount();
    return count === 0;
  }

  // ============ ФИЛЬТРАЦИЯ ПО ТИПУ ИГР ============
  /**
   * Получить игры с демо режимом
   */
  async getGamesWithDemo(): Promise<GameCardComponent[]> {
    const cards = await this.getAllGameCards();
    const demoCards: GameCardComponent[] = [];

    for (const card of cards) {
      const hasDemo = await card.hasDemoButton();
      if (hasDemo) {
        demoCards.push(card);
      }
    }

    return demoCards;
  }

  /**
   * Получить игры с реальным режимом
   */
  async getGamesWithReal(): Promise<GameCardComponent[]> {
    const cards = await this.getAllGameCards();
    const realCards: GameCardComponent[] = [];

    for (const card of cards) {
      const hasReal = await card.hasRealButton();
      if (hasReal) {
        realCards.push(card);
      }
    }

    return realCards;
  }

  /**
   * Получить игры по категории (по провайдеру)
   */
  async getGamesByCategory(category: string): Promise<GameCardComponent[]> {
    return await this.findGamesByProvider(category);
  }

  // ============ ВЗАИМОДЕЙСТВИЕ ============
  /**
   * Кликнуть по случайной игре
   */
  async clickRandomGame(): Promise<GameCardComponent> {
    const count = await this.getGamesCount();
    const randomIndex = Math.floor(Math.random() * count);
    const card = await this.getGameCard();
    
    this.logStep(`Clicking random game at index ${randomIndex}`);
    await card.clickCard();
    this.logSuccess('Clicked random game');
    
    return card;
  }

  // ============ ПРОВЕРКИ ЗАГРУЗКИ ============
  /**
   * Проверить, загружены ли все изображения
   */
  async areAllImagesLoaded(): Promise<boolean> {
    const cards = await this.getAllGameCards();
    
    for (const card of cards) {
      const isLoaded = await card.isImageLoaded();
      if (!isLoaded) {
        return false;
      }
    }

    return true;
  }

  /**
   * Дождаться загрузки всех изображений
   */
  async waitForAllImagesLoad(): Promise<void> {
    this.logStep('Waiting for all images to load');
    
    const cards = await this.getAllGameCards();
    for (const card of cards) {
      await card.waitForCardLoad();
    }
    
    this.logSuccess('All images loaded');
  }
}
