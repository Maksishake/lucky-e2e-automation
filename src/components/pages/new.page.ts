/**
 * New Games Page - Страница новых игр (рефакторированная)
 */

import { Page } from '@playwright/test';
import { BaseGamePage } from '@/core/abstract/base-game-page';
import { ILogger } from '@/core/interfaces/logger.interface';

export class NewGamesPage extends BaseGamePage {
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'NewGames', '/new', loggerInstance);
  }

  /**
   * Перейти на страницу новых игр
   */
  async navigateToNewGames(): Promise<void> {
    await this.navigate();
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

  /**
   * Валидация страницы новых игр
   */
  async validateNewPage(): Promise<boolean> {
    return await this.validateGamePage();
  }
}
