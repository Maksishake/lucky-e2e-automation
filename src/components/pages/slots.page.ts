/**
 * Slots Games Page - Страница слотов (рефакторированная)
 */

import { Page } from '@playwright/test';
import { BaseGamePage } from '@/core/abstract/base-game-page';
import { ILogger } from '@/core/interfaces/logger.interface';

export class SlotsGamesPage extends BaseGamePage {
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'SlotsGames', '/slots', loggerInstance);
  }

  /**
   * Перейти на страницу слотов
   */
  async navigateToSlotsGames(): Promise<void> {
    await this.navigate();
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

  /**
   * Валидация страницы слотов
   */
  async validateSlotsPage(): Promise<boolean> {
    return await this.validateGamePage();
  }
}
