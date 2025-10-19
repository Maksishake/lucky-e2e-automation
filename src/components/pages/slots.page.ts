/**
 * Slots Games Page - Страница слотов
 */

import { Page } from '@playwright/test';
import { BaseGamePage } from './base-game.page';

export class SlotsGamesPage extends BaseGamePage {
  constructor(page: Page) {
    super(page, 'SlotsGames', '/slots');
  }

  /**
   * Перейти на страницу слотов
   */
  async navigateToSlotsGames(): Promise<void> {
    await this.navigateTo('/slots');
    await this.waitForPageComponentsLoad();
  }

  /**
   * Выбрать категорию "Слоты"
   */
  async selectSlotsCategory(): Promise<void> {
    await this.selectGameCategory(3); // ID для слотов
  }

  /**
   * Проверить, что отображаются слоты
   */
  async verifySlotsGamesDisplayed(): Promise<boolean> {
    const gamesCount = await this.getGamesCount();
    return gamesCount > 0;
  }

  /**
   * Получить количество слотов
   */
  async getSlotsGamesCount(): Promise<number> {
    return await this.getGamesCount();
  }
}
