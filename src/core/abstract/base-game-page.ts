/**
 * Base Game Page - Базовый класс для всех игровых страниц
 * Применяет принципы SOLID и наследует от BasePage
 */

import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { ILogger } from '../interfaces/logger.interface';
import { logger } from '../logger';
import { BannerSliderComponent } from '@/components/banner-slider.component';
import { GameCategoriesComponent } from '@/components/games/game-categories.component';
import { GameGridComponent } from '@/components/games/game-grid.component';
import { GameFilterState, GameGridState } from '@/types/game.types';

export abstract class BaseGamePage extends BasePage {
  // Компоненты страницы
  protected readonly bannerSlider: BannerSliderComponent;
  protected readonly gameFilter: GameCategoriesComponent;
  protected readonly gameGrid: GameGridComponent;

  constructor(page: Page, pageName: string, pageUrl: string, loggerInstance?: ILogger) {
    super(page, pageName, pageUrl, undefined, loggerInstance || logger);
    
    // Инициализация компонентов
    this.bannerSlider = new BannerSliderComponent(page, loggerInstance);
    this.gameFilter = new GameCategoriesComponent(page, 'GameFilter', '.filter-container-wrapper', loggerInstance);
    this.gameGrid = new GameGridComponent(page, loggerInstance);
  }

  // ============ ЗАГРУЗКА КОМПОНЕНТОВ ============
  
  async waitForPageComponentsLoad(): Promise<void> {
    this.logStep('Waiting for all page components to load');
    
    try {
      // Ждем загрузки основных компонентов
      await this.bannerSlider.waitForSliderLoad();
      await this.gameGrid.waitForGridLoad();
      
      this.logSuccess('All page components loaded');
    } catch (error) {
      this.logError(`Failed to load page components: ${error}`);
      throw error;
    }
  }

  async isPageFullyLoaded(): Promise<boolean> {
    const bannerLoaded = await this.bannerSlider.isSliderVisible();
    const gridLoaded = await this.gameGrid.isGridVisible();
    
    return bannerLoaded && gridLoaded;
  }

  // ============ РАБОТА С ИГРАМИ ============
  
  async getGamesCount(): Promise<number> {
    this.logStep('Getting games count');
    const count = await this.gameGrid.getGamesCount();
    this.logStep(`Games count: ${count}`);
    return count;
  }

  async selectGameCategory(categoryId: number): Promise<void> {
    this.logStep(`Selecting game category: ${categoryId}`);
    await this.gameFilter.selectCategoryById(categoryId);
    await this.waitForGamesToLoad();
    this.logSuccess(`Game category selected: ${categoryId}`);
  }

  async selectGameProvider(providerName: string): Promise<void> {
    this.logStep(`Selecting game provider: ${providerName}`);
    await this.gameFilter.selectProviderByName(providerName);
    await this.waitForGamesToLoad();
    this.logSuccess(`Game provider selected: ${providerName}`);
  }

  async searchGames(query: string): Promise<void> {
    this.logStep(`Searching games with query: ${query}`);
    // TODO: Implement search functionality in GameFilterComponent
    await this.waitForGamesToLoad();
    this.logSuccess(`Games search completed: ${query}`);
  }

  async clearFilters(): Promise<void> {
    this.logStep('Clearing all filters');
    // TODO: Implement clear filters functionality in GameFilterComponent
    await this.waitForGamesToLoad();
    this.logSuccess('All filters cleared');
  }

  async waitForGamesToLoad(): Promise<void> {
    this.logStep('Waiting for games to load');
    await this.gameGrid.waitForGridLoad();
    this.logSuccess('Games loaded');
  }

  // ============ РАБОТА С БАННЕРАМИ ============
  
  async getBannerSlides(): Promise<string[]> {
    this.logStep('Getting banner slides');
    const slides = await this.bannerSlider.getAllSlides();
    this.logStep(`Found ${slides.length} banner slides`);
    return slides.map(slide => slide.title || slide.image || '');
  }

  async clickBannerSlide(index: number): Promise<void> {
    this.logStep(`Clicking banner slide: ${index}`);
    await this.bannerSlider.clickSlide(index);
    this.logSuccess(`Banner slide clicked: ${index}`);
  }

  async nextBannerSlide(): Promise<void> {
    this.logStep('Going to next banner slide');
    await this.bannerSlider.clickNextButton();
    this.logSuccess('Next banner slide');
  }

  async prevBannerSlide(): Promise<void> {
    this.logStep('Going to previous banner slide');
    await this.bannerSlider.clickPrevButton();
    this.logSuccess('Previous banner slide');
  }

  // ============ РАБОТА С ЗАГОЛОВКОМ СТРАНИЦЫ ============
  
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getBreadcrumbs(): Promise<string[]> {
    // Простая реализация получения хлебных крошек
    const breadcrumbs = await this.page.locator('.breadcrumbs li').all();
    const texts: string[] = [];
    for (const breadcrumb of breadcrumbs) {
      const text = await breadcrumb.textContent();
      if (text) texts.push(text.trim());
    }
    return texts;
  }

  // ============ ВАЛИДАЦИЯ СТРАНИЦЫ ============
  
  async validateGamePage(): Promise<boolean> {
    this.logStep('Validating game page');
    
    const isOnCorrectPage = await this.isOnPage();
    const isFullyLoaded = await this.isPageFullyLoaded();
    const hasGames = await this.getGamesCount() > 0;
    
    const isValid = isOnCorrectPage && isFullyLoaded && hasGames;
    
    if (isValid) {
      this.logSuccess('Game page validation passed');
    } else {
      this.logError('Game page validation failed');
    }
    
    return isValid;
  }

  // ============ ПОЛУЧЕНИЕ СОСТОЯНИЯ КОМПОНЕНТОВ ============
  
  async getGameFilterState(): Promise<GameFilterState> {
    return await this.gameFilter.getFilterState();
  }

  async getGameGridState(): Promise<GameGridState> {
    return await this.gameGrid.getGridState();
  }

  async setGameFilterState(state: Partial<GameFilterState>): Promise<void> {
    this.logStep('Setting game filter state');
    // TODO: Implement setFilterState functionality in GameFilterComponent
    await this.waitForGamesToLoad();
    this.logSuccess('Game filter state set');
  }

  // ============ УТИЛИТЫ ============
  
  async refreshPage(): Promise<void> {
    this.logStep('Refreshing page');
    await this.reload();
    await this.waitForPageComponentsLoad();
    this.logSuccess('Page refreshed');
  }

  async scrollToGames(): Promise<void> {
    this.logStep('Scrolling to games section');
    await this.gameGrid.scrollIntoView();
    this.logSuccess('Scrolled to games section');
  }

  async scrollToBanner(): Promise<void> {
    this.logStep('Scrolling to banner section');
    await this.bannerSlider.scrollIntoView();
    this.logSuccess('Scrolled to banner section');
  }

  // ============ ГЕТТЕРЫ ============
  
  get bannerSliderComponent(): BannerSliderComponent {
    return this.bannerSlider;
  }

  get gameFilterComponent(): GameCategoriesComponent {
    return this.gameFilter;
  }

  get gameGridComponent(): GameGridComponent {
    return this.gameGrid;
  }
}
