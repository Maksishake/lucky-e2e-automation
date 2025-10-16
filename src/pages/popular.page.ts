/**
 * Popular Games Page - Страница популярных игр
 */

import { Page } from '@playwright/test';
import { BaseGamePage } from './base-game.page';

export class PopularGamesPage extends BaseGamePage {
  constructor(page: Page) {
    super(page, 'PopularGames', '/popular');
  }

  /**
   * Перейти на страницу популярных игр
   */
  async navigateToPopularGames(): Promise<void> {
    await this.navigateTo('/popular');
    await this.waitForPageComponentsLoad();
  }

  /**
   * Выбрать категорию "Популярные"
   */
  async selectPopularCategory(): Promise<void> {
    await this.selectGameCategory(1); // ID для популярных игр
  }

  /**
   * Проверить, что отображаются популярные игры
   */
  async verifyPopularGamesDisplayed(): Promise<boolean> {
    const gamesCount = await this.getGamesCount();
    return gamesCount > 0;
  }

  /**
   * Получить количество популярных игр
   */
  async getPopularGamesCount(): Promise<number> {
    return await this.getGamesCount();
  }
}
