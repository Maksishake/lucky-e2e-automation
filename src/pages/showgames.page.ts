/**
 * Show Games Page - Страница шоу игр
 */

import { Page } from '@playwright/test';
import { BaseGamePage } from './base-game.page';

export class ShowGamesPage extends BaseGamePage {
  constructor(page: Page) {
    super(page, 'ShowGames', '/show-games');
  }

  /**
   * Перейти на страницу шоу игр
   */
  async navigateToShowGames(): Promise<void> {
    await this.navigateTo('/showgames');
    await this.waitForPageComponentsLoad();
  }

  /**
   * Выбрать категорию "Шоу игры"
   */
  async selectShowGamesCategory(): Promise<void> {
    await this.selectGameCategory(25); // ID для шоу игр
  }

  /**
   * Проверить, что отображаются шоу игры
   */
  async verifyShowGamesDisplayed(): Promise<boolean> {
    const gamesCount = await this.getGamesCount();
    return gamesCount > 0;
  }

  /**
   * Получить количество шоу игр
   */
  async getShowGamesCount(): Promise<number> {
    return await this.getGamesCount();
  }
}
