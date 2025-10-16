/**
 * All Games Page - Страница всех игр
 */

import { Page } from '@playwright/test';
import { BaseGamePage } from './base-game.page';

export class AllGamesPage extends BaseGamePage {
  constructor(page: Page) {
    super(page, 'AllGames', '/');
  }

  /**
   * Перейти на страницу всех игр
   */
  async navigateToAllGames(): Promise<void> {
    await this.navigateTo('/all');
    await this.waitForPageComponentsLoad();
  }

  /**
   * Проверить, что отображаются все игры
   */
  async verifyAllGamesDisplayed(): Promise<boolean> {
    const gamesCount = await this.getGamesCount();
    return gamesCount > 0;
  }

  /**
   * Получить общее количество игр
   */
  async getTotalGamesCount(): Promise<number> {
    return await this.getGamesCount();
  }
}

