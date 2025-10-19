/**
 * Page Content Component - Компонент основного контента страницы
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@/core/abstract/base-component';
import { ILogger } from '@/core/interfaces/logger.interface';

export class PageContentComponent extends BaseComponent {
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'PageContent', 'main, .main-content, .content, body', loggerInstance);
  }

  // Селекторы контента
  get contentArea(): Locator {
    return this.rootElement;
  }

  get loadingSpinner(): Locator {
    return this.rootElement.locator('.loading-spinner');
  }

  get errorMessage(): Locator {
    return this.rootElement.locator('.error-message');
  }

  get emptyState(): Locator {
    return this.rootElement.locator('.empty-state');
  }

  // Методы проверки состояния
  async isContentVisible(): Promise<boolean> {
    return await this.contentArea.isVisible();
  }

  async isContentLoaded(): Promise<boolean> {
    return await this.contentArea.isVisible() && !(await this.loadingSpinner.isVisible());
  }

  async hasError(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  async isEmpty(): Promise<boolean> {
    return await this.emptyState.isVisible();
  }

  // Методы получения данных
  async getContentText(): Promise<string> {
    return await this.contentArea.textContent() || '';
  }

  async getErrorMessage(): Promise<string> {
    if (await this.hasError()) {
      return await this.errorMessage.textContent() || '';
    }
    return '';
  }

  // Методы ожидания
  async waitForContentLoad(): Promise<void> {
    this.logStep('Waiting for content to load');
    
    // Ждем исчезновения спиннера
    if (await this.loadingSpinner.isVisible()) {
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
    }
    
    // Ждем появления контента
    await this.contentArea.waitFor({ state: 'visible', timeout: 15000 });
    
    this.logSuccess('Content loaded');
  }

  async waitForContentVisible(): Promise<void> {
    await this.contentArea.waitFor({ state: 'visible' });
  }

  // Методы прокрутки
  async scrollToTop(): Promise<void> {
    await this.contentArea.evaluate(element => element.scrollTo(0, 0));
  }

  async scrollToBottom(): Promise<void> {
    await this.contentArea.evaluate(element => element.scrollTo(0, element.scrollHeight));
  }

  async scrollIntoView(): Promise<void> {
    await this.contentArea.scrollIntoViewIfNeeded();
  }
}