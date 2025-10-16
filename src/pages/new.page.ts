/**
 * New Games Page - Страница новых игр
 */

import { Page } from '@playwright/test';
import { BaseGamePage } from './base-game.page';

export class NewGamesPage extends BaseGamePage {
  constructor(page: Page) {
    super(page, 'NewGames', '/new');
  }

  /**
   * Перейти на страницу новых игр
   */
  async navigateToNewGames(): Promise<void> {
    await this.navigateTo('/new');
    await this.waitForPageComponentsLoad();
  }

  /**
   * Выбрать категорию "Новые"
   */
  async selectNewCategory(): Promise<void> {
    await this.selectGameCategory(2); // ID для новых игр
  }

  /**
   * Проверить, что отображаются новые игры
   */
  async verifyNewGamesDisplayed(): Promise<boolean> {
    const gamesCount = await this.getGamesCount();
    return gamesCount > 0;
  }

  /**
   * Получить количество новых игр
   */
  async getNewGamesCount(): Promise<number> {
    return await this.getGamesCount();
  }
}
