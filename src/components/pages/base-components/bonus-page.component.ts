/**
 * Bonus Page Component - Компонент страницы бонусов
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@/core/abstract/base-component';
import { ILogger } from '@/core/interfaces/logger.interface';

export interface BonusCard {
  index: number;
  title: string;
  description: string;
  image: string;
  hasSubscribeButton: boolean;
  hasDetailsButton: boolean;
}

export interface BonusPageStats {
  totalBonuses: number;
  depositBonuses: number;
  cashbackBonuses: number;
  giftBonuses: number;
  activeTab: string;
  hasBonuses: boolean;
}

export class BonusPageComponent extends BaseComponent {
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'BonusPage', '.bonus-page', loggerInstance);
  }

  // Селекторы для табов
  get depositTab(): Locator {
    return this.page.locator('.tab-item').filter({ hasText: 'Депозит' });
  }

  get cashbackTab(): Locator {
    return this.page.locator('.tab-item').filter({ hasText: 'Кешбек' });
  }

  get giftTab(): Locator {
    return this.page.locator('.tab-item').filter({ hasText: 'Подарунковий' });
  }

  get activeTab(): Locator {
    return this.page.locator('.tab-item.active');
  }

  // Селекторы для бонусных карточек
  get bonusCards(): Locator {
    return this.page.locator('.card-promotion');
  }

  get bonusCardTitles(): Locator {
    return this.page.locator('.card-promotion .title');
  }

  get bonusCardDescriptions(): Locator {
    return this.page.locator('.card-promotion .excerpt');
  }

  get bonusCardImages(): Locator {
    return this.page.locator('.card-promotion .card-image');
  }

  // Селекторы для кнопок
  get subscribeButtons(): Locator {
    return this.page.locator('.card-promotion .btn-default');
  }

  get detailsButtons(): Locator {
    return this.page.locator('.card-promotion .btn-outline');
  }

  // Методы для работы с табами
  async clickDepositTab(): Promise<void> {
    this.logStep('Clicking deposit tab');
    await this.depositTab.click();
    await this.waitForTabContent();
    this.logSuccess('Deposit tab clicked');
  }

  async clickCashbackTab(): Promise<void> {
    this.logStep('Clicking cashback tab');
    await this.cashbackTab.click();
    await this.waitForTabContent();
    this.logSuccess('Cashback tab clicked');
  }

  async clickGiftTab(): Promise<void> {
    this.logStep('Clicking gift tab');
    await this.giftTab.click();
    await this.waitForTabContent();
    this.logSuccess('Gift tab clicked');
  }

  async getActiveTab(): Promise<string> {
    this.logStep('Getting active tab');
    const activeTabText = await this.activeTab.textContent() || '';
    this.logStep(`Active tab: ${activeTabText}`);
    return activeTabText;
  }

  async waitForTabContent(): Promise<void> {
    this.logStep('Waiting for tab content to load');
    await this.bonusCards.first().waitFor({ state: 'visible' });
    this.logSuccess('Tab content loaded');
  }

  // Методы для работы с бонусными карточками
  async getAllBonusCards(): Promise<BonusCard[]> {
    this.logStep('Getting all bonus cards');
    
    try {
      const bonusCardElements = await this.bonusCards.all();
      const bonusCards: BonusCard[] = [];
      
      for (let i = 0; i < bonusCardElements.length; i++) {
        const card = bonusCardElements[i];
        const bonusCard = await this.extractBonusCardInfo(card, i);
        bonusCards.push(bonusCard);
      }
      
      this.logSuccess(`Found ${bonusCards.length} bonus cards`);
      return bonusCards;
    } catch (error) {
      this.logError(`Failed to get bonus cards: ${error}`);
      return [];
    }
  }

  async getBonusCardByIndex(index: number): Promise<BonusCard | null> {
    this.logStep(`Getting bonus card by index: ${index}`);
    
    try {
      const bonusCardElements = await this.bonusCards.all();
      
      if (index >= 0 && index < bonusCardElements.length) {
        const card = bonusCardElements[index];
        const bonusCard = await this.extractBonusCardInfo(card, index);
        this.logSuccess(`Bonus card found at index ${index}: ${bonusCard.title}`);
        return bonusCard;
      }
      
      this.logError(`Bonus card not found at index: ${index}`);
      return null;
    } catch (error) {
      this.logError(`Failed to get bonus card by index ${index}: ${error}`);
      return null;
    }
  }

  async clickSubscribeButton(index: number): Promise<void> {
    this.logStep(`Clicking subscribe button for bonus card ${index}`);
    
    try {
      const bonusCard = this.bonusCards.nth(index);
      const subscribeButton = bonusCard.locator('.btn-default');
      
      await subscribeButton.click();
      this.logSuccess(`Subscribe button clicked for bonus card ${index}`);
    } catch (error) {
      this.logError(`Failed to click subscribe button: ${error}`);
      throw error;
    }
  }

  async clickDetailsButton(index: number): Promise<void> {
    this.logStep(`Clicking details button for bonus card ${index}`);
    
    try {
      const bonusCard = this.bonusCards.nth(index);
      const detailsButton = bonusCard.locator('.btn-outline');
      
      await detailsButton.click();
      this.logSuccess(`Details button clicked for bonus card ${index}`);
    } catch (error) {
      this.logError(`Failed to click details button: ${error}`);
      throw error;
    }
  }

  async getPageStats(): Promise<BonusPageStats> {
    this.logStep('Getting bonus page statistics');
    
    try {
      const allBonusCards = await this.getAllBonusCards();
      const activeTab = await this.getActiveTab();
      
      // Подсчет бонусов по типам (упрощенная логика)
      const depositBonuses = allBonusCards.filter(card => 
        card.title.toLowerCase().includes('депозит') || 
        card.title.toLowerCase().includes('deposit')
      ).length;
      
      const cashbackBonuses = allBonusCards.filter(card => 
        card.title.toLowerCase().includes('кешбек') || 
        card.title.toLowerCase().includes('cashback')
      ).length;
      
      const giftBonuses = allBonusCards.filter(card => 
        card.title.toLowerCase().includes('подарунковий') || 
        card.title.toLowerCase().includes('gift')
      ).length;
      
      const stats: BonusPageStats = {
        totalBonuses: allBonusCards.length,
        depositBonuses,
        cashbackBonuses,
        giftBonuses,
        activeTab,
        hasBonuses: allBonusCards.length > 0
      };
      
      this.logSuccess('Bonus page statistics retrieved');
      return stats;
    } catch (error) {
      this.logError(`Failed to get page stats: ${error}`);
      return {
        totalBonuses: 0,
        depositBonuses: 0,
        cashbackBonuses: 0,
        giftBonuses: 0,
        activeTab: '',
        hasBonuses: false
      };
    }
  }

  async waitForBonusesLoad(): Promise<void> {
    this.logStep('Waiting for bonuses to load');
    await this.bonusCards.first().waitFor({ state: 'visible' });
    this.logSuccess('Bonuses loaded');
  }

  async isBonusesLoaded(): Promise<boolean> {
    const count = await this.bonusCards.count();
    return count > 0;
  }

  // Приватные методы
  private async extractBonusCardInfo(card: any, index: number): Promise<BonusCard> {
    const title = await card.locator('.title').textContent() || '';
    const description = await card.locator('.excerpt').textContent() || '';
    const image = await card.locator('.card-image img').getAttribute('src') || '';
    const hasSubscribeButton = await card.locator('.btn-default').isVisible();
    const hasDetailsButton = await card.locator('.btn-outline').isVisible();
    
    return {
      index,
      title,
      description,
      image,
      hasSubscribeButton,
      hasDetailsButton
    };
  }
}
