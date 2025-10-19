/**
 * Show Games Page - Страница шоу игр (рефакторированная)
 */

import { Page } from '@playwright/test';
import { BaseGamePage } from '@/core/abstract/base-game-page';
import { ILogger } from '@/core/interfaces/logger.interface';

export class ShowGamesPage extends BaseGamePage {
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'ShowGames', '/show-games', loggerInstance);
  }

  /**
   * Перейти на страницу шоу игр
   */
  async navigateToShowGames(): Promise<void> {
    await this.navigate();
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

  /**
   * Валидация страницы шоу игр
   */
  async validateShowGamesPage(): Promise<boolean> {
    return await this.validateGamePage();
  }
}
