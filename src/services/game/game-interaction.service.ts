/**
 * Game Interaction Service - Сервис для взаимодействия с играми
 */

import { Locator, Page } from '@playwright/test';
import { BaseService } from '../../core/base.service';
import { GameFilterComponent } from '@/components/games/game-filter.component';

export class GameInteractionService extends BaseService {
  constructor(page: Page) {
    super(page, 'GameInteractionService');
  }

  /**
   * Кликнуть по игре на странице
   */
  async clickGameOnPage(title: string): Promise<boolean> {
    this.logStep(`Clicking game on page: ${title}`);
    
    try {
      const gameCard = this.page.locator('.game-card').filter({ hasText: title }).first();
      
      if (await gameCard.count() > 0) {
        await gameCard.click();
        this.logSuccess(`Game clicked: ${title}`);
        return true;
      }
      
      this.logError(`Game not found for clicking: ${title}`);
      return false;
    } catch (error) {
      this.logError(`Failed to click game: ${error}`);
      return false;
    }
  }

  /**
   * Кликнуть по игре по индексу
   */
  async clickGameByIndex(index: number): Promise<boolean> {
    this.logStep(`Clicking game by index: ${index}`);
    
    try {
      const gameCard = this.page.locator('.game-card').nth(index);
      await gameCard.click();
      this.logSuccess(`Game clicked by index ${index}`);
      return true;
    } catch (error) {
      this.logError(`Failed to click game by index ${index}: ${error}`);
      return false;
    }
  }

  /**
   * Запустить игру в демо режиме
   */
  async playGameDemo(title: string): Promise<boolean> {
    this.logStep(`Playing game demo: ${title}`);
    
    try {
      const gameCard = this.page.locator('.game-card').filter({ hasText: title }).first();
      const demoBtn = gameCard.locator('.demo-btn');
      
      if (await demoBtn.count() > 0) {
        await demoBtn.click();
        this.logSuccess(`Demo game started: ${title}`);
        return true;
      }
      
      this.logError(`Demo button not found for game: ${title}`);
      return false;
    } catch (error) {
      this.logError(`Failed to play demo: ${error}`);
      return false;
    }
  }

  /**
   * Запустить игру в реальном режиме
   */
  async playGameReal(title: string): Promise<boolean> {
    this.logStep(`Playing real game: ${title}`);
    
    try {
      const gameCard = this.page.locator('.game-card').filter({ hasText: title }).first();
      const playBtn = gameCard.locator('.play-btn');
      
      if (await playBtn.count() > 0) {
        await playBtn.click();
        this.logSuccess(`Real game started: ${title}`);
        return true;
      }
      
      this.logError(`Play button not found for game: ${title}`);
      return false;
    } catch (error) {
      this.logError(`Failed to play real game: ${error}`);
      return false;
    }
  }

  /**
   * Запустить игру в реальном режиме по индексу
   */
  async playGameRealByIndex(index: number): Promise<boolean> {
    this.logStep(`Playing real game by index: ${index}`);
    
    try {
      const gameCard = this.page.locator('.game-card').nth(index);
      
      // Наводим курсор на игру для появления кнопок
      await gameCard.hover();
      
      // Ждем появления кнопки "Реальний"
      const realButton = gameCard.locator('.btn-default').filter({ hasText: 'Реальний' });
      await realButton.waitFor({ state: 'visible', timeout: 3000 });
      
      // Кликаем на кнопку "Реальний"
      await realButton.click();
      
      // Ждем загрузки iframe
      await this.page.waitForTimeout(5000);
      
      this.logSuccess(`Real game started by index ${index}`);
      return true;
    } catch (error) {
      this.logError(`Failed to play real game by index ${index}: ${error}`);
      return false;
    }
  }

  /**
   * Запустить игру в демо режиме по индексу
   */
  async playGameDemoByIndex(index: number): Promise<boolean> {
    this.logStep(`Playing demo game by index: ${index}`);
    
    try {
      const gameCard = this.page.locator('.game-card').nth(index);
      
      // Наводим курсор на игру для появления кнопок
      await gameCard.hover();
      
      // Ждем появления кнопки "Демо"
      const demoButton = gameCard.locator('.btn-secondary').filter({ hasText: 'Демо' });
      await demoButton.waitFor({ state: 'visible', timeout: 3000 });
      
      // Кликаем на кнопку "Демо"
      await demoButton.click();
      
      this.logSuccess(`Demo game started by index ${index}`);
      return true;
    } catch (error) {
      this.logError(`Failed to play demo game by index ${index}: ${error}`);
      return false;
    }
  }

  /**
   * Добавить игру в избранное
   */
  async addToFavorites(title: string): Promise<boolean> {
    this.logStep(`Adding game to favorites: ${title}`);
    
    try {
      const gameCard = this.page.locator('.game-card').filter({ hasText: title }).first();
      const favoriteBtn = gameCard.locator('.favorite-btn');
      
      if (await favoriteBtn.count() > 0) {
        await favoriteBtn.click();
        this.logSuccess(`Game added to favorites: ${title}`);
        return true;
      }
      
      this.logError(`Favorite button not found for game: ${title}`);
      return false;
    } catch (error) {
      this.logError(`Failed to add to favorites: ${error}`);
      return false;
    }
  }

  /**
   * Удалить игру из избранного
   */
  async removeFromFavorites(title: string): Promise<boolean> {
    this.logStep(`Removing game from favorites: ${title}`);
    
    try {
      const gameCard = this.page.locator('.game-card').filter({ hasText: title }).first();
      const favoriteBtn = gameCard.locator('.favorite-btn.active');
      
      if (await favoriteBtn.count() > 0) {
        await favoriteBtn.click();
        this.logSuccess(`Game removed from favorites: ${title}`);
        return true;
      }
      
      this.logError(`Game not in favorites: ${title}`);
      return false;
    } catch (error) {
      this.logError(`Failed to remove from favorites: ${error}`);
      return false;
    }
  }

  /**
   * Добавить игру в избранное по индексу
   */
  async addToFavoritesByIndex(index: number): Promise<boolean> {
    this.logStep(`Adding game to favorites by index: ${index}`);
    
    try {
      const gameCard = this.page.locator('.game-card').nth(index);
      
      // Наводим курсор на игру для появления кнопок
      await gameCard.hover();
      
      // Ждем появления кнопки избранного
      const favoriteBtn = gameCard.locator('.favorite-btn');
      await favoriteBtn.waitFor({ state: 'visible', timeout: 3000 });
      
      // Кликаем на кнопку избранного
      await favoriteBtn.click();
      
      this.logSuccess(`Game added to favorites by index ${index}`);
      return true;
    } catch (error) {
      this.logError(`Failed to add game to favorites by index ${index}: ${error}`);
      return false;
    }
  }

  /**
   * Удалить игру из избранного по индексу
   */
  async removeFromFavoritesByIndex(index: number): Promise<boolean> {
    this.logStep(`Removing game from favorites by index: ${index}`);
    
    try {
      const gameCard = this.page.locator('.game-card').nth(index);
      
      // Наводим курсор на игру для появления кнопок
      await gameCard.hover();
      
      // Ждем появления активной кнопки избранного
      const favoriteBtn = gameCard.locator('.favorite-btn.active');
      await favoriteBtn.waitFor({ state: 'visible', timeout: 3000 });
      
      // Кликаем на кнопку избранного
      await favoriteBtn.click();
      
      this.logSuccess(`Game removed from favorites by index ${index}`);
      return true;
    } catch (error) {
      this.logError(`Failed to remove game from favorites by index ${index}: ${error}`);
      return false;
    }
  }

  /**
   * Проверить, является ли игра избранной
   */
  async isGameFavorite(title: string): Promise<boolean> {
    this.logStep(`Checking if game is favorite: ${title}`);
    
    try {
      const gameCard = this.page.locator('.game-card').filter({ hasText: title }).first();
      const favoriteBtn = gameCard.locator('.favorite-btn.active');
      
      const isFavorite = await favoriteBtn.count() > 0;
      this.logStep(`Game favorite status: ${isFavorite}`);
      return isFavorite;
    } catch (error) {
      this.logError(`Failed to check favorite status: ${error}`);
      return false;
    }
  }

  /**
   * Проверить, является ли игра избранной по индексу
   */
  async isGameFavoriteByIndex(index: number): Promise<boolean> {
    this.logStep(`Checking if game is favorite by index: ${index}`);
    
    try {
      const gameCard = this.page.locator('.game-card').nth(index);
      
      // Наводим курсор на игру для появления кнопок
      await gameCard.hover();
      
      // Проверяем наличие активной кнопки избранного
      const favoriteBtn = gameCard.locator('.favorite-btn.active');
      const isFavorite = await favoriteBtn.count() > 0;
      
      this.logStep(`Game favorite status by index ${index}: ${isFavorite}`);
      return isFavorite;
    } catch (error) {
      this.logError(`Failed to check favorite status by index ${index}: ${error}`);
      return false;
    }
  }

  /**
   * Универсальная функция для клика по кнопке игры
   */
  async clickGameButton(gameTitle: string, buttonType: 'real' | 'demo'): Promise<void> {
    this.logStep(`Clicking ${buttonType} button for game: ${gameTitle}`);
    
    try {
      // Находим игру по названию
      const gameCard = this.page.locator('.game-card').filter({ hasText: gameTitle });
      await gameCard.waitFor({ state: 'visible', timeout: 5000 });
      
      // Наводим курсор на игру
      await gameCard.hover();
      
      if (buttonType === 'real') {
        // Клик по кнопке "Реальний"
        const realButton = gameCard.locator('.btn-default').filter({ hasText: 'Реальний' });
        await realButton.waitFor({ state: 'visible', timeout: 3000 });
        await realButton.click();
        
        // Ждем модального окна авторизации
        await this.page.waitForSelector('#modal-auth', { state: 'visible', timeout: 5000 });
        
      } else {
        // Клик по кнопке "Демо"
        const demoButton = gameCard.locator('.btn-secondary').filter({ hasText: 'Демо' });
        await demoButton.waitFor({ state: 'visible', timeout: 3000 });
        await demoButton.click();
        
        // Ждем загрузки iframe
        await this.page.waitForSelector('iframe[src*="game"], iframe[src*="demo"]', { 
          state: 'visible', 
          timeout: 10000 
        });
      }
      
      this.logSuccess(`${buttonType} button clicked for game: ${gameTitle}`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logError(`Failed to click ${buttonType} button for game ${gameTitle}: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Универсальная функция для клика по кнопке игры по индексу
   */
  async clickGameButtonByIndex(index: number, buttonType: 'real' | 'demo' | 'favorite'): Promise<boolean> {
    this.logStep(`Clicking ${buttonType} button for game by index: ${index}`);
    
    try {
      const gameCard = this.page.locator('.game-card').nth(index);
      
      // Наводим курсор на игру
      await gameCard.hover();
      
      let button: Locator;
      let buttonText: string;
      
      switch (buttonType) {
        case 'real':
          button = gameCard.locator('.btn-default').filter({ hasText: 'Реальний' });
          buttonText = 'Реальний';
          break;
        case 'demo':
          button = gameCard.locator('.btn-secondary').filter({ hasText: 'Демо' });
          buttonText = 'Демо';
          break;
        case 'favorite':
          button = gameCard.locator('.favorite-btn');
          buttonText = 'Favorite';
          break;
        default:
          throw new Error(`Unknown button type: ${buttonType}`);
      }
      
      // Ждем появления кнопки
      await button.waitFor({ state: 'visible', timeout: 3000 });
      
      // Кликаем на кнопку
      await button.click();
      
      this.logSuccess(`${buttonText} button clicked for game by index ${index}`);
      return true;
    } catch (error) {
      this.logError(`Failed to click ${buttonType} button for game by index ${index}: ${error}`);
      return false;
    }
  }

  /**
   * Проверить доступность кнопки по индексу
   */
  async isButtonAvailableByIndex(index: number, buttonType: 'real' | 'demo' | 'favorite'): Promise<boolean> {
    this.logStep(`Checking ${buttonType} button availability for game by index: ${index}`);
    
    try {
      const gameCard = this.page.locator('.game-card').nth(index);
      
      // Наводим курсор на игру
      await gameCard.hover();
      
      let button: Locator;
      
      switch (buttonType) {
        case 'real':
          button = gameCard.locator('.btn-default').filter({ hasText: 'Реальний' });
          break;
        case 'demo':
          button = gameCard.locator('.btn-secondary').filter({ hasText: 'Демо' });
          break;
        case 'favorite':
          button = gameCard.locator('.favorite-btn');
          break;
        default:
          throw new Error(`Unknown button type: ${buttonType}`);
      }
      
      // Проверяем, что кнопка видима
      const isVisible = await button.isVisible({ timeout: 1000 }).catch(() => false);
      
      this.logStep(`${buttonType} button availability for game by index ${index}: ${isVisible}`);
      return isVisible;
    } catch (error) {
      this.logError(`Failed to check ${buttonType} button availability for game by index ${index}: ${error}`);
      return false;
    }
  }

  /**
   * Клик по кнопке "Реальний" для конкретной игры
   */
  async clickRealButton(gameTitle: string, providerName?: string): Promise<void> {  
    this.logStep(`Clicking real button for game: ${gameTitle}`);
    
    try {
      // Если указан провайдер, применяем фильтр
      if (providerName) {
        this.logStep(`Applying provider filter: ${providerName}`);
        const gameFilter = new GameFilterComponent(this.page);
        await gameFilter.selectProviderByName(providerName);
        await this.page.waitForTimeout(2000); 
      }
      
      // Находим игру по названию
      const gameCard = this.page.locator('.game-card').filter({ hasText: gameTitle }).first();
      await gameCard.waitFor({ state: 'visible', timeout: 5000 });
      
      // Наводим курсор на игру для появления кнопок
      await gameCard.hover();
      
      // Ждем появления кнопок
      const realButton = gameCard.locator('.btn-default').filter({ hasText: 'Реальний' });
      await realButton.waitFor({ state: 'visible', timeout: 3000 });
      
      // Кликаем на кнопку "Реальний"
      await realButton.click();
      
      // Ждем возможного модального окна авторизации
      try {
        await this.page.waitForSelector('#modal-auth', { state: 'visible', timeout: 5000 });
        this.logStep('Authorization modal appeared, waiting for it to close');
        await this.page.waitForSelector('#modal-auth', { state: 'hidden', timeout: 10000 });
        this.logStep('Authorization modal closed');
      } catch (error) {
        this.logStep('No authorization modal appeared');
      }
      
      this.logSuccess(`Real button clicked for game: ${gameTitle}`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logError(`Failed to click real button for game ${gameTitle}: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Клик по кнопке "Демо" для конкретной игры
   */
  async clickDemoButton(gameTitle: string): Promise<void> {
    this.logStep(`Clicking demo button for game: ${gameTitle}`);
    
    try {
      // Находим игру по названию
      const gameCard = this.page.locator('.game-card').filter({ hasText: gameTitle });
      await gameCard.waitFor({ state: 'visible', timeout: 5000 });
      
      // Наводим курсор на игру для появления кнопок
      await gameCard.hover();
      
      // Ждем появления кнопок
      const demoButton = gameCard.locator('.btn-secondary').filter({ hasText: 'Демо' });
      await demoButton.waitFor({ state: 'visible', timeout: 3000 });
      
      // Кликаем на кнопку "Демо"
      await demoButton.click();
      
      // Ждем загрузки iframe с игрой
      await this.page.waitForSelector('iframe[src*="game"], iframe[src*="demo"]', { 
        state: 'visible', 
        timeout: 20000 
      });
      
      this.logSuccess(`Demo button clicked for game: ${gameTitle}`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logError(`Failed to click demo button for game ${gameTitle}: ${errorMessage}`);
      throw error;
    }
  }
}
