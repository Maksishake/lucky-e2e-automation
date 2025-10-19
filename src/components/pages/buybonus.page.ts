/**
 * Buy Bonus Page - Страница покупки бонусов (рефакторированная)
 */

import { Page } from '@playwright/test';
import { BaseGamePage } from '@/core/abstract/base-game-page';
import { ILogger } from '@/core/interfaces/logger.interface';

export class BuyBonusPage extends BaseGamePage {
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'BuyBonus', '/buy-bonus', loggerInstance);
  }

  /**
   * Перейти на страницу покупки бонусов
   */
  async navigateToBuyBonus(): Promise<void> {
    await this.navigate();
    await this.waitForPageComponentsLoad();
  }

  /**
   * Выбрать категорию "Купить бонус"
   */
  async selectBuyBonusCategory(): Promise<void> {
    await this.selectGameCategory(5); // ID для покупки бонусов
  }

  /**
   * Проверить, что отображаются игры покупки бонусов
   */
  async verifyBuyBonusGamesDisplayed(): Promise<boolean> {
    const gamesCount = await this.getGamesCount();
    return gamesCount > 0;
  }

  /**
   * Получить количество игр покупки бонусов
   */
  async getBuyBonusGamesCount(): Promise<number> {
    return await this.getGamesCount();
  }

  /**
   * Валидация страницы покупки бонусов
   */
  async validateBuyBonusPage(): Promise<boolean> {
    return await this.validateGamePage();
  }
}
