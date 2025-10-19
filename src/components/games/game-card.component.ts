/**
 * Game Card Component - Упрощенный компонент карточки игры
 * Применяет принцип SRP - только работа с карточкой игры
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@/core/abstract/base-component';
import { ILogger } from '@/core/interfaces/logger.interface';
import { GameInfo, GameType, GameStatus } from '@/types/game.types';
import { GameSelectors } from '@/core/selectors/GameSelectors';
import { logger } from '@/core/logger';

export class GameCardComponent extends BaseComponent {
  constructor(page: Page, rootElement: Locator, loggerInstance?: ILogger) {
    super(page, 'GameCard', rootElement, loggerInstance || logger);
  }

  // ============ СЕЛЕКТОРЫ ============
  
  get titleLocator(): Locator {
    return this.rootElement.locator(GameSelectors.GAME_TITLE);
  }

  get providerLocator(): Locator {
    return this.rootElement.locator(GameSelectors.GAME_PROVIDER);
  }

  get imageLocator(): Locator {
    return this.rootElement.locator(GameSelectors.GAME_IMAGE);
  }

  get playButton(): Locator {
    return this.rootElement.locator(GameSelectors.PLAY_BUTTON);
  }

  get demoButton(): Locator {
    return this.rootElement.locator(GameSelectors.DEMO_BUTTON);
  }

  get favoriteButton(): Locator {
    return this.rootElement.locator(GameSelectors.FAVORITE_BUTTON);
  }

  // ============ ОСНОВНЫЕ МЕТОДЫ ============

  async getGameInfo(): Promise<GameInfo> {
    this.logStep('Getting game info from card');
    
    const title = await this.titleLocator.textContent() || '';
    const provider = await this.providerLocator.textContent() || '';
    const image = await this.imageLocator.getAttribute('src') || '';
    const hasPlayButton = await this.playButton.isVisible();
    const hasDemoButton = await this.demoButton.isVisible();

    this.logSuccess(`Game info retrieved: ${title}`);
    return {
      index: -1, // Index будет установлен извне
      title: title.trim(),
      provider: provider.trim(),
      image,
      hasPlayButton,
      hasDemoButton,
      locator: this.rootElement,
      type: GameType.SLOT,
      status: GameStatus.LOADED
    };
  }

  async clickCard(): Promise<void> {
    this.logStep(`Clicking game card: ${await this.titleLocator.textContent()}`);
    await this.rootElement.click();
    this.logSuccess('Game card clicked');
  }

  async clickPlayButton(): Promise<void> {
    this.logStep(`Clicking play button for game: ${await this.titleLocator.textContent()}`);
    await this.playButton.click();
    this.logSuccess('Play button clicked');
  }

  async clickDemoButton(): Promise<void> {
    this.logStep(`Clicking demo button for game: ${await this.titleLocator.textContent()}`);
    await this.demoButton.click();
    this.logSuccess('Demo button clicked');
  }

  async clickFavoriteButton(): Promise<void> {
    this.logStep(`Toggling favorite for game: ${await this.titleLocator.textContent()}`);
    await this.favoriteButton.click();
    this.logSuccess('Favorite button toggled');
  }

  // ============ ПРОВЕРКИ СОСТОЯНИЯ ============

  async isPlayButtonVisible(): Promise<boolean> {
    return await this.playButton.isVisible();
  }

  async isDemoButtonVisible(): Promise<boolean> {
    return await this.demoButton.isVisible();
  }

  async isFavoriteButtonActive(): Promise<boolean> {
    try {
      const element = await this.favoriteButton.elementHandle();
      if (element) {
        const classList = await element.evaluate(el => Array.from(el.classList));
        return classList.includes('active') || classList.includes('favorited');
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async isCardVisible(): Promise<boolean> {
    return await this.rootElement.isVisible();
  }

  // ============ ДОПОЛНИТЕЛЬНЫЕ МЕТОДЫ ============

  async hoverCard(): Promise<void> {
    this.logStep('Hovering over game card');
    await this.rootElement.hover();
    this.logSuccess('Game card hovered');
  }

  async getCardTitle(): Promise<string> {
    return await this.titleLocator.textContent() || '';
  }

  async getCardProvider(): Promise<string> {
    return await this.providerLocator.textContent() || '';
  }

  async getCardImage(): Promise<string> {
    return await this.imageLocator.getAttribute('src') || '';
  }

  async waitForCardToLoad(): Promise<void> {
    this.logStep('Waiting for game card to load');
    await this.rootElement.waitFor({ state: 'visible' });
    await this.titleLocator.waitFor({ state: 'visible' });
    this.logSuccess('Game card loaded');
  }
}