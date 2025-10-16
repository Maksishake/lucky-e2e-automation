/**
 * Base Game Page - Базовый класс для всех игровых страниц
 */

import { Page } from '@playwright/test';
import { BasePage } from '../core/base.page';
import { BannerSliderComponent } from '../components/banner-slider.component';
import { GameFilterComponent } from '../components/games/game-filter.component';
import { GameGridComponent } from '../components/games/game-grid.component';
import { GameFilterState, GameGridState } from '../types/game.types';

export abstract class BaseGamePage extends BasePage {
  // Компоненты страницы
  protected bannerSlider: BannerSliderComponent;
  protected gameFilter: GameFilterComponent;
  protected gameGrid: GameGridComponent;

  constructor(page: Page, pageName: string, pageUrl: string) {
    super(page, pageName, pageUrl);
    
    // Инициализация компонентов
    this.bannerSlider = new BannerSliderComponent(page);
    this.gameFilter = new GameFilterComponent(page);
    this.gameGrid = new GameGridComponent(page);
  }

  /**
   * Дождаться загрузки всех компонентов страницы
   */
  async waitForPageComponentsLoad(): Promise<void> {
    this.logStep('Waiting for all page components to load');
    
    // Ждем загрузки основных компонентов
    await this.bannerSlider.waitForSliderLoad();
    await this.gameGrid.waitForGridLoad();
    // QR Panel removed - no longer needed
    
    this.logSuccess('All page components loaded');
  }

  /**
   * Проверить, загружена ли страница полностью
   */
  async isPageFullyLoaded(): Promise<boolean> {
    const bannerLoaded = await this.bannerSlider.isSliderVisible();
    const filterLoaded = await this.gameFilter.isFilterVisible();
    const gridLoaded = await this.gameGrid.isGridVisible();
    // QR Panel removed - no longer needed
    
    return bannerLoaded && filterLoaded && gridLoaded;
  }

  /**
   * Получить состояние фильтров
   */
  async getFilterState(): Promise<GameFilterState> {
    return await this.gameFilter.getFilterState();
  }

  /**
   * Получить состояние сетки игр
   */
  async getGridState(): Promise<GameGridState> {
    return await this.gameGrid.getGridState();
  }

  /**
   * Выбрать категорию игр
   */
  async selectGameCategory(categoryId: number): Promise<void> {
    this.logStep(`Selecting game category ${categoryId}`);
    await this.gameFilter.selectCategory(categoryId);
    await this.gameGrid.waitForLoadingComplete();
    this.logSuccess(`Selected game category ${categoryId}`);
  }

  /**
   * Выбрать провайдера игр
   */
  async selectGameProvider(providerId: number): Promise<void> {
    this.logStep(`Selecting game provider ${providerId}`);
    await this.gameFilter.selectProvider(providerId);
    await this.gameGrid.waitForLoadingComplete();
    this.logSuccess(`Selected game provider ${providerId}`);
  }

  /**
   * Сбросить все фильтры
   */
  async resetAllFilters(): Promise<void> {
    this.logStep('Resetting all filters');
    await this.gameFilter.resetFilters();
    await this.gameGrid.waitForLoadingComplete();
    this.logSuccess('All filters reset');
  }

  /**
   * Загрузить больше игр
   */
  async loadMoreGames(): Promise<void> {
    this.logStep('Loading more games');
    await this.gameGrid.loadMoreGames();
    this.logSuccess('Loaded more games');
  }

  /**
   * Найти игру по названию
   */
  async findGameByTitle(title: string) {
    this.logStep(`Finding game by title: ${title}`);
    const gameCard = await this.gameGrid.findGameByTitle(title);
    if (gameCard) {
      this.logSuccess(`Found game: ${title}`);
    } else {
      this.logError(`Game not found: ${title}`);
    }
    return gameCard;
  }

  /**
   * Запустить случайную игру
   */
  async playRandomGame(): Promise<void> {
    this.logStep('Playing random game');
    await this.gameGrid.clickRandomGame();
    this.logSuccess('Started random game');
  }

  /**
   * Получить количество игр на странице
   */
  async getGamesCount(): Promise<number> {
    return await this.gameGrid.getGamesCount();
  }

  /**
   * Проверить, есть ли кнопка "Загрузить больше"
   */
  async hasLoadMoreButton(): Promise<boolean> {
    return await this.gameGrid.hasLoadMoreButton();
  }

  /**
   * Прокрутить к концу страницы
   */
  async scrollToBottom(): Promise<void> {
    this.logStep('Scrolling to bottom of page');
    await this.gameGrid.scrollToBottom();
    this.logSuccess('Scrolled to bottom');
  }

  /**
   * Перейти к следующему слайду баннера
   */
  async goToNextBannerSlide(): Promise<void> {
    this.logStep('Going to next banner slide');
    await this.bannerSlider.goToNextSlide();
    this.logSuccess('Moved to next banner slide');
  }

  /**
   * Перейти к предыдущему слайду баннера
   */
  async goToPreviousBannerSlide(): Promise<void> {
    this.logStep('Going to previous banner slide');
    await this.bannerSlider.goToPreviousSlide();
    this.logSuccess('Moved to previous banner slide');
  }

  /**
   * Кликнуть по активному слайду баннера
   */
  async clickActiveBannerSlide(): Promise<void> {
    this.logStep('Clicking active banner slide');
    await this.bannerSlider.clickActiveSlide();
    this.logSuccess('Clicked active banner slide');
  }

  /**
   * Открыть поиск игр
   */
  async openGameSearch(): Promise<void> {
    this.logStep('Opening game search');
    await this.gameFilter.openSearch();
    this.logSuccess('Opened game search');
  }

  /**
   * Получить информацию о QR панели
   */
  async getQrPanelInfo() {
    // QR Panel removed - return empty data
    return {};
  }

  /**
   * Кликнуть по QR коду
   */
  async clickQrCode(): Promise<void> {
    // QR Panel removed - no action needed
    this.logStep('QR Panel removed - no action needed');
  }

  /**
   * Кликнуть по кнопке QR панели
   */
  async clickQrButton(): Promise<void> {
    // QR Panel removed - no action needed
    this.logStep('QR Panel removed - no action needed');
  }

  /**
   * Проверить, загружены ли все изображения
   */
  async areAllImagesLoaded(): Promise<boolean> {
    const bannerImagesLoaded = await this.bannerSlider.isSliderActive();
    const gridImagesLoaded = await this.gameGrid.areAllImagesLoaded();
    // QR Panel removed - no check needed
    const qrImageLoaded = true;

    return bannerImagesLoaded && gridImagesLoaded && qrImageLoaded;
  }

  /**
   * Дождаться загрузки всех изображений
   */
  async waitForAllImagesLoad(): Promise<void> {
    this.logStep('Waiting for all images to load');
    await this.gameGrid.waitForAllImagesLoad();
    this.logSuccess('All images loaded');
  }

  /**
   * Получить статистику страницы
   */
  async getPageStats(): Promise<{
    gamesCount: number;
    hasLoadMore: boolean;
    isFullyLoaded: boolean;
    imagesLoaded: boolean;
  }> {
    const gamesCount = await this.getGamesCount();
    const hasLoadMore = await this.hasLoadMoreButton();
    const isFullyLoaded = await this.isPageFullyLoaded();
    const imagesLoaded = await this.areAllImagesLoaded();

    return {
      gamesCount,
      hasLoadMore,
      isFullyLoaded,
      imagesLoaded
    };
  }
}
