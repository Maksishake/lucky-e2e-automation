/**
 * Bonus Page - Страница бонусов (рефакторированная)
 */

import { Page } from '@playwright/test';
import { BasePage } from '@/core/abstract/base-page';
import { BonusPageComponent } from '@/components/pages/base-components/bonus-page.component';
import { PageHeaderComponent } from '@/components/pages/base-components/page-header.component';
import { PageContentComponent } from '@/components/pages/base-components/page-content.component';
import { ILogger } from '@/core/interfaces/logger.interface';
import { BonusCard, BonusPageStats } from '@/components/pages/base-components/bonus-page.component';

export class BonusPage extends BasePage {
  private readonly bonusComponent: BonusPageComponent;
  private readonly pageHeader: PageHeaderComponent;
  private readonly pageContent: PageContentComponent;

  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'BonusPage', '/bonus', 'Бонуси', loggerInstance);
    
    this.bonusComponent = new BonusPageComponent(page, loggerInstance);
    this.pageHeader = new PageHeaderComponent(page, loggerInstance);
    this.pageContent = new PageContentComponent(page, loggerInstance);
  }

  // ============ НАВИГАЦИЯ ============
  
  async navigateToBonuses(): Promise<void> {
    await this.navigate();
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    this.logStep('Waiting for bonus page to load');
    await this.pageContent.waitForContentLoad();
    await this.bonusComponent.waitForBonusesLoad();
    this.logSuccess('Bonus page loaded');
  }

  // ============ РАБОТА С ТАБАМИ ============
  
  async clickDepositTab(): Promise<void> {
    await this.bonusComponent.clickDepositTab();
  }

  async clickCashbackTab(): Promise<void> {
    await this.bonusComponent.clickCashbackTab();
  }

  async clickGiftTab(): Promise<void> {
    await this.bonusComponent.clickGiftTab();
  }

  async getActiveTab(): Promise<string> {
    return await this.bonusComponent.getActiveTab();
  }

  // ============ РАБОТА С БОНУСНЫМИ КАРТОЧКАМИ ============
  
  async getAllBonusCards(): Promise<BonusCard[]> {
    return await this.bonusComponent.getAllBonusCards();
  }

  async getBonusCardByIndex(index: number): Promise<BonusCard | null> {
    return await this.bonusComponent.getBonusCardByIndex(index);
  }

  async clickSubscribeButton(index: number): Promise<void> {
    await this.bonusComponent.clickSubscribeButton(index);
  }

  async clickDetailsButton(index: number): Promise<void> {
    await this.bonusComponent.clickDetailsButton(index);
  }

  // ============ СТАТИСТИКА ============
  
  async getPageStats(): Promise<BonusPageStats> {
    return await this.bonusComponent.getPageStats();
  }

  async isBonusesLoaded(): Promise<boolean> {
    return await this.bonusComponent.isBonusesLoaded();
  }

  // ============ ВАЛИДАЦИЯ ============
  
  async validateBonusPage(): Promise<boolean> {
    this.logStep('Validating bonus page');
    
    const isOnCorrectPage = await this.isOnPage();
    const hasCorrectTitle = await this.hasCorrectTitle();
    const isContentLoaded = await this.pageContent.isContentLoaded();
    const hasBonuses = await this.isBonusesLoaded();
    
    const isValid = isOnCorrectPage && hasCorrectTitle && isContentLoaded && hasBonuses;
    
    if (isValid) {
      this.logSuccess('Bonus page validation passed');
    } else {
      this.logError('Bonus page validation failed');
    }
    
    return isValid;
  }

  // ============ ГЕТТЕРЫ ============
  
  get bonusPageComponent(): BonusPageComponent {
    return this.bonusComponent;
  }

  get pageHeaderComponent(): PageHeaderComponent {
    return this.pageHeader;
  }

  get pageContentComponent(): PageContentComponent {
    return this.pageContent;
  }
}
