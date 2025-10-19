/**
 * Page Header Component - Компонент заголовка страницы
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@/core/abstract/base-component';
import { ILogger } from '@/core/interfaces/logger.interface';

export class PageHeaderComponent extends BaseComponent {
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'PageHeader', 'h3.page-title', loggerInstance);
  }

  // Селекторы заголовка
  get pageTitleLocator(): Locator {
    return this.rootElement;
  }

  get breadcrumbs(): Locator {
    return this.page.locator('.breadcrumbs');
  }

  get backButton(): Locator {
    return this.page.locator('.back-button');
  }

  get refreshButton(): Locator {
    return this.page.locator('.refresh-button');
  }

  // Методы получения данных
  async getPageTitle(): Promise<string> {
    this.logStep('Getting page title from header');
    const title = await this.pageTitleLocator.textContent() || '';
    this.logSuccess(`Page title: "${title}"`);
    return title;
  }

  async getBreadcrumbs(): Promise<string[]> {
    const breadcrumbElements = await this.breadcrumbs.locator('a, span').all();
    const breadcrumbs: string[] = [];
    
    for (const element of breadcrumbElements) {
      const text = await element.textContent();
      if (text) {
        breadcrumbs.push(text.trim());
      }
    }
    
    return breadcrumbs;
  }

  // Методы проверки состояния
  async isPageTitleVisible(): Promise<boolean> {
    return await this.pageTitleLocator.isVisible();
  }

  async hasBreadcrumbs(): Promise<boolean> {
    return await this.breadcrumbs.isVisible();
  }

  async hasBackButton(): Promise<boolean> {
    return await this.backButton.isVisible();
  }

  async hasRefreshButton(): Promise<boolean> {
    return await this.refreshButton.isVisible();
  }

  // Методы взаимодействия
  async clickBackButton(): Promise<void> {
    this.logStep('Clicking back button');
    await this.backButton.click();
    this.logSuccess('Back button clicked');
  }

  async clickRefreshButton(): Promise<void> {
    this.logStep('Clicking refresh button');
    await this.refreshButton.click();
    this.logSuccess('Refresh button clicked');
  }

  // Методы ожидания
  async waitForVisible(): Promise<void> {
    await this.pageTitleLocator.waitFor({ state: 'visible' });
  }

  async waitForTitleToContain(expectedTitle: string): Promise<void> {
    await this.pageTitleLocator.waitFor({ 
      state: 'visible',
      timeout: 10000 
    });
    
    const title = await this.getPageTitle();
    if (!title.includes(expectedTitle)) {
      throw new Error(`Expected title to contain "${expectedTitle}", but got "${title}"`);
    }
  }

  // Методы валидации
  async validatePageTitle(expectedTitle: string): Promise<boolean> {
    const actualTitle = await this.getPageTitle();
    return actualTitle.includes(expectedTitle);
  }

  async validateHeaderElements(): Promise<boolean> {
    const hasTitle = await this.isPageTitleVisible();
    return hasTitle;
  }
}