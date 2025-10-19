/**
 * All Games Page - Страница всех игр (рефакторированная)
 */

import { Page } from '@playwright/test';
import { BaseGamePage } from '@/core/abstract/base-game-page';
import { ILogger } from '@/core/interfaces/logger.interface';

export class AllGamesPage extends BaseGamePage {
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'AllGames', '/', loggerInstance);
  }

  /**
   * Перейти на страницу всех игр
   */
  async navigateToAllGames(): Promise<void> {
    await this.navigate();
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

  /**
   * Валидация страницы всех игр
   */
  async validateAllGamesPage(): Promise<boolean> {
    return await this.validateGamePage();
  }
}
