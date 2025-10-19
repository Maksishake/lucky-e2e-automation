/**
 * Live Casino Page - Страница живого казино (рефакторированная)
 */

import { Page } from '@playwright/test';
import { BaseGamePage } from '@/core/abstract/base-game-page';
import { ILogger } from '@/core/interfaces/logger.interface';

export class LiveCasinoPage extends BaseGamePage {
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'LiveCasino', '/live-casino', loggerInstance);
  }

  /**
   * Перейти на страницу живого казино
   */
  async navigateToLiveCasino(): Promise<void> {
    await this.navigate();
    await this.waitForPageComponentsLoad();
  }

  /**
   * Выбрать категорию "Живое казино"
   */
  async selectLiveCasinoCategory(): Promise<void> {
    await this.selectGameCategory(4); // ID для живого казино
  }

  /**
   * Проверить, что отображаются игры живого казино
   */
  async verifyLiveCasinoGamesDisplayed(): Promise<boolean> {
    const gamesCount = await this.getGamesCount();
    return gamesCount > 0;
  }

  /**
   * Получить количество игр живого казино
   */
  async getLiveCasinoGamesCount(): Promise<number> {
    return await this.getGamesCount();
  }

  /**
   * Валидация страницы живого казино
   */
  async validateLiveCasinoPage(): Promise<boolean> {
    return await this.validateGamePage();
  }
}
