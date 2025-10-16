/**
 * Bonus Page - Страница бонусов
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../core/base.page';
import { Routes } from '@config/routes';

export class BonusPage extends BasePage {
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

  // Селекторы для активного таба
  get activeTab(): Locator {
    return this.page.locator('.tab-item.active');
  }

  // Селекторы для табов
  get allTabs(): Locator {
    return this.page.locator('.tab-item');
  }

  constructor(page: Page) {
    super(page, 'BonusPage', Routes.BONUSES, 'Бонус');
  }

  /**
   * Переключиться на таб "Депозит"
   */
  async switchToDepositTab(): Promise<void> {
    this.logStep('Switching to Deposit tab');
    await this.depositTab.click();
    await this.waitForTabToBeActive('Депозит');
    this.logSuccess('Switched to Deposit tab');
  }

  /**
   * Переключиться на таб "Кешбек"
   */
  async switchToCashbackTab(): Promise<void> {
    this.logStep('Switching to Cashback tab');
    await this.cashbackTab.click();
    await this.waitForTabToBeActive('Кешбек');
    this.logSuccess('Switched to Cashback tab');
  }

  /**
   * Переключиться на таб "Подарунковий"
   */
  async switchToGiftTab(): Promise<void> {
    this.logStep('Switching to Gift tab');
    await this.giftTab.click();
    await this.waitForTabToBeActive('Подарунковий');
    this.logSuccess('Switched to Gift tab');
  }

  /**
   * Дождаться активации таба
   */
  async waitForTabToBeActive(tabName: string): Promise<void> {
    const tab = this.page.locator('.tab-item').filter({ hasText: tabName });
    await tab.waitFor({ state: 'visible' });
    await expect(tab).toHaveClass(/active/);
  }

  /**
   * Получить количество бонусных карточек
   */
  async getBonusCardsCount(): Promise<number> {
    return await this.bonusCards.count();
  }

  /**
   * Получить все бонусные карточки
   */
  async getAllBonusCards(): Promise<Array<{
    title: string;
    description: string;
    imageSrc: string;
    subscribeButtonVisible: boolean;
    detailsButtonVisible: boolean;
  }>> {
    const cards = [];
    const count = await this.getBonusCardsCount();

    for (let i = 0; i < count; i++) {
      const card = this.bonusCards.nth(i);
      
      const title = await card.locator('.title').textContent() || '';
      const description = await card.locator('.excerpt').textContent() || '';
      const imageSrc = await card.locator('.card-image').getAttribute('src') || '';
      const subscribeButtonVisible = await card.locator('.btn-default').isVisible();
      const detailsButtonVisible = await card.locator('.btn-outline').isVisible();

      cards.push({
        title,
        description,
        imageSrc,
        subscribeButtonVisible,
        detailsButtonVisible
      });
    }

    return cards;
  }

  /**
   * Найти бонусную карточку по названию
   */
  async findBonusCardByTitle(title: string): Promise<Locator | null> {
    const cards = this.bonusCards;
    const count = await cards.count();

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const cardTitle = await card.locator('.title').textContent();
      if (cardTitle?.includes(title)) {
        return card;
      }
    }

    return null;
  }

  /**
   * Кликнуть по кнопке "Підписатися" на карточке
   */
  async clickSubscribeOnCard(cardTitle: string): Promise<void> {
    this.logStep(`Clicking subscribe button on card: ${cardTitle}`);
    const card = await this.findBonusCardByTitle(cardTitle);
    
    if (!card) {
      throw new Error(`Bonus card with title "${cardTitle}" not found`);
    }

    const subscribeButton = card.locator('.btn-default');
    await subscribeButton.click();
    this.logSuccess(`Clicked subscribe button on card: ${cardTitle}`);
  }

  /**
   * Кликнуть по кнопке "Детальна інформація" на карточке
   */
  async clickDetailsOnCard(cardTitle: string): Promise<void> {
    this.logStep(`Clicking details button on card: ${cardTitle}`);
    const card = await this.findBonusCardByTitle(cardTitle);
    
    if (!card) {
      throw new Error(`Bonus card with title "${cardTitle}" not found`);
    }

    const detailsButton = card.locator('.btn-outline');
    await detailsButton.click();
    this.logSuccess(`Clicked details button on card: ${cardTitle}`);
  }

  /**
   * Проверить, что карточка видима
   */
  async isCardVisible(cardTitle: string): Promise<boolean> {
    const card = await this.findBonusCardByTitle(cardTitle);
    return card ? await card.isVisible() : false;
  }

  /**
   * Проверить, что кнопка "Підписатися" видима на карточке
   */
  async isSubscribeButtonVisible(cardTitle: string): Promise<boolean> {
    const card = await this.findBonusCardByTitle(cardTitle);
    if (!card) return false;
    
    return await card.locator('.btn-default').isVisible();
  }

  /**
   * Проверить, что кнопка "Детальна інформація" видима на карточке
   */
  async isDetailsButtonVisible(cardTitle: string): Promise<boolean> {
    const card = await this.findBonusCardByTitle(cardTitle);
    if (!card) return false;
    
    return await card.locator('.btn-outline').isVisible();
  }

  /**
   * Получить название активного таба
   */
  async getActiveTabName(): Promise<string> {
    const activeTab = this.activeTab;
    return await activeTab.textContent() || '';
  }

  /**
   * Проверить, что таб активен
   */
  async isTabActive(tabName: string): Promise<boolean> {
    const tab = this.page.locator('.tab-item').filter({ hasText: tabName });
    const hasActiveClass = await tab.getAttribute('class');
    return hasActiveClass?.includes('active') || false;
  }

  /**
   * Получить все названия табов
   */
  async getAllTabNames(): Promise<string[]> {
    const tabs = this.allTabs;
    const count = await tabs.count();
    const tabNames: string[] = [];

    for (let i = 0; i < count; i++) {
      const tabText = await tabs.nth(i).textContent();
      if (tabText) {
        tabNames.push(tabText.trim());
      }
    }

    return tabNames;
  }

  /**
   * Проверить наличие изображения на карточке
   */
  async hasCardImage(cardTitle: string): Promise<boolean> {
    const card = await this.findBonusCardByTitle(cardTitle);
    if (!card) return false;
    
    const image = card.locator('.card-image');
    return await image.isVisible();
  }

  /**
   * Получить URL изображения карточки
   */
  async getCardImageUrl(cardTitle: string): Promise<string> {
    const card = await this.findBonusCardByTitle(cardTitle);
    if (!card) return '';
    
    const image = card.locator('.card-image');
    return await image.getAttribute('src') || '';
  }

  /**
   * Проверить, что все карточки загружены
   */
  async waitForAllCardsToLoad(): Promise<void> {
    this.logStep('Waiting for all bonus cards to load');
    await this.bonusCards.first().waitFor({ state: 'visible' });
    await this.page.waitForTimeout(1000); // Дополнительная пауза для загрузки
    this.logSuccess('All bonus cards loaded');
  }

  /**
   * Проверить, что страница бонусов загружена корректно
   */
  async isBonusPageLoaded(): Promise<boolean> {
    try {
      // Проверяем наличие основных элементов
      const hasTitle = await this.hasHeading('Бонус');
      const hasTabs = await this.allTabs.count() > 0;
      const hasCards = await this.getBonusCardsCount() > 0;
      
      return hasTitle && hasTabs && hasCards;
    } catch (error) {
      this.logError('Error checking if bonus page is loaded', error);
      return false;
    }
  }

  /**
   * Получить статистику бонусов
   */
  async getBonusStatistics(): Promise<{
    totalCards: number;
    activeTab: string;
    availableTabs: string[];
    cardsWithImages: number;
    cardsWithSubscribeButtons: number;
    cardsWithDetailsButtons: number;
  }> {
    const totalCards = await this.getBonusCardsCount();
    const activeTab = await this.getActiveTabName();
    const availableTabs = await this.getAllTabNames();
    
    const cards = await this.getAllBonusCards();
    const cardsWithImages = cards.filter(card => card.imageSrc).length;
    const cardsWithSubscribeButtons = cards.filter(card => card.subscribeButtonVisible).length;
    const cardsWithDetailsButtons = cards.filter(card => card.detailsButtonVisible).length;

    return {
      totalCards,
      activeTab,
      availableTabs,
      cardsWithImages,
      cardsWithSubscribeButtons,
      cardsWithDetailsButtons
    };
  }

  /**
   * Проверить, что модальное окно бонуса открылось
   */
  async waitForBonusModal(): Promise<void> {
    this.logStep('Waiting for bonus modal to open');
    await this.page.waitForSelector('.modal-bonus, [data-modal="bonus"]', { timeout: 5000 });
    this.logSuccess('Bonus modal opened');
  }

  /**
   * Проверить, что модальное окно авторизации открылось
   */
  async waitForAuthModal(): Promise<void> {
    this.logStep('Waiting for auth modal to open');
    await this.page.waitForSelector('.modal-auth, [data-modal="auth"]', { timeout: 5000 });
    this.logSuccess('Auth modal opened');
  }
}
