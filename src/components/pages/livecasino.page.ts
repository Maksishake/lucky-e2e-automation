/**
 * Live Casino Page - Страница живого казино
 */

import { Page } from '@playwright/test';
import { BaseGamePage } from './base-game.page';

export class LiveCasinoPage extends BaseGamePage {
  constructor(page: Page) {
    super(page, 'LiveCasino', '/live-casino');
  }

  /**
   * Перейти на страницу живого казино
   */
  async navigateToLiveCasino(): Promise<void> {
    await this.navigateTo('/livecasino');
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
}
