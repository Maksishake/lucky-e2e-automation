/**
 * Buy Bonus Page - Страница покупки бонусов
 */

import { Page } from '@playwright/test';
import { BaseGamePage } from './base-game.page';

export class BuyBonusPage extends BaseGamePage {
  constructor(page: Page) {
    super(page, 'BuyBonus', '/buy-bonus');
  }

  /**
   * Перейти на страницу покупки бонусов
   */
  async navigateToBuyBonus(): Promise<void> {
    await this.navigateTo('/buybonus');
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
}
