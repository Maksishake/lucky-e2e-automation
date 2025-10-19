/**
 * Popular Games Page - Страница популярных игр (рефакторированная)
 */

import { Page } from '@playwright/test';
import { BaseGamePage } from '@/core/abstract/base-game-page';
import { ILogger } from '@/core/interfaces/logger.interface';

export class PopularGamesPage extends BaseGamePage {
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'PopularGames', '/popular', loggerInstance);
  }

  /**
   * Перейти на страницу популярных игр
   */
  async navigateToPopularGames(): Promise<void> {
    await this.navigate();
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

  /**
   * Валидация страницы популярных игр
   */
  async validatePopularPage(): Promise<boolean> {
    return await this.validateGamePage();
  }
}
