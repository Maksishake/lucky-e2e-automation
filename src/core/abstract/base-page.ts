/**
 * Base Page - Базовый класс для всех страниц
 * Применяет принципы SOLID и наследует от BaseService
 */

import { Page, Locator } from '@playwright/test';
import { BaseService } from './base-service';
import { ILogger } from '../interfaces/logger.interface';
import { logger } from '../logger';

export abstract class BasePage extends BaseService {
  protected readonly url: string;
  protected readonly pageTitle: string;

  constructor(page: Page, pageName: string, url?: string, pageTitle?: string, loggerInstance?: ILogger) {
    super(page, pageName, loggerInstance || logger);
    this.url = url || '';
    this.pageTitle = pageTitle || '';
  }

  // ============ НАВИГАЦИЯ ============
  
  async navigate(): Promise<void> {
    if (this.url) {
      this.logStep(`Navigating to ${this.url}`);
      await this.page.goto(this.url);
      await this.waitForPageToLoad();
      this.logSuccess(`Navigated to ${this.url}`);
    }
  }

  async navigateTo(url: string): Promise<void> {
    this.logStep(`Navigating to ${url}`);
    await this.page.goto(url);
    await this.waitForPageToLoad();
    this.logSuccess(`Navigated to ${url}`);
  }

  async waitForPageToLoad(): Promise<void> {
    this.logStep('Waiting for page to load');
    await this.page.waitForLoadState('domcontentloaded');
    // Убираем networkidle для ускорения тестов
    await this.page.waitForTimeout(1000); // Небольшая задержка для стабильности
    this.logSuccess('Page loaded');
  }

  // ============ ПРОВЕРКИ СТРАНИЦЫ ============
  
  async isOnPage(): Promise<boolean> {
    if (this.url) {
      const currentUrl = await this.getCurrentUrlAsync();
      return currentUrl.includes(this.url) || currentUrl.includes(this.url.replace('/', ''));
    }
    return true;
  }

  async hasCorrectTitle(): Promise<boolean> {
    if (this.pageTitle) {
      const title = await this.getPageTitle();
      return title.includes(this.pageTitle);
    }
    return true;
  }

  async getCurrentUrlAsync(): Promise<string> {
    return this.page.url();
  }

  getCurrentUrlSync(): string {
    return this.page.url();
  }

  // Переопределяем метод из BaseService для совместимости
  getCurrentUrl(): string {
    return this.page.url();
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  // ============ ОЖИДАНИЕ ЭЛЕМЕНТОВ ============
  
  async waitForElement(selector: string, timeout: number = 10000): Promise<void> {
    this.logStep(`Waiting for element: ${selector}`);
    await this.page.waitForSelector(selector, { timeout });
    this.logSuccess(`Element found: ${selector}`);
  }

  async waitForElements(selector: string, count: number, timeout: number = 10000): Promise<void> {
    this.logStep(`Waiting for ${count} elements: ${selector}`);
    await this.page.waitForFunction(
      ({ selector, count }) => {
        const elements = document.querySelectorAll(selector);
        return elements.length >= count;
      },
      { selector, count },
      { timeout }
    );
    this.logSuccess(`Found ${count} elements: ${selector}`);
  }

  // ============ ПОИСК ЭЛЕМЕНТОВ ============
  
  getElement(selector: string): Locator {
    return this.page.locator(selector);
  }

  getElements(selector: string): Locator {
    return this.page.locator(selector);
  }

  async getElementCount(selector: string): Promise<number> {
    return await this.page.locator(selector).count();
  }

  async isElementVisible(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isVisible();
  }

  async isElementHidden(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isHidden();
  }

  // ============ ВЗАИМОДЕЙСТВИЕ С ЭЛЕМЕНТАМИ ============
  
  async clickElement(selector: string): Promise<void> {
    this.logStep(`Clicking element: ${selector}`);
    await this.page.locator(selector).click();
    this.logSuccess(`Element clicked: ${selector}`);
  }

  async fillElement(selector: string, value: string): Promise<void> {
    this.logStep(`Filling element ${selector} with: ${value}`);
    await this.page.locator(selector).fill(value);
    this.logSuccess(`Element filled: ${selector}`);
  }

  async getElementText(selector: string): Promise<string> {
    return await this.page.locator(selector).textContent() || '';
  }

  async getElementAttribute(selector: string, attribute: string): Promise<string | null> {
    return await this.page.locator(selector).getAttribute(attribute);
  }

  // ============ СКРОЛЛ ============
  
  async scrollToElement(selector: string): Promise<void> {
    this.logStep(`Scrolling to element: ${selector}`);
    await this.page.locator(selector).scrollIntoViewIfNeeded();
    this.logSuccess(`Scrolled to element: ${selector}`);
  }

  async scrollToTop(): Promise<void> {
    this.logStep('Scrolling to top');
    await this.page.evaluate(() => window.scrollTo(0, 0));
    this.logSuccess('Scrolled to top');
  }

  async scrollToBottom(): Promise<void> {
    this.logStep('Scrolling to bottom');
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    this.logSuccess('Scrolled to bottom');
  }

  // ============ ВАЛИДАЦИЯ ============
  
  async validatePage(): Promise<boolean> {
    this.logStep('Validating page');
    
    const isOnCorrectPage = await this.isOnPage();
    const hasCorrectTitle = await this.hasCorrectTitle();
    
    const isValid = isOnCorrectPage && hasCorrectTitle;
    
    if (isValid) {
      this.logSuccess('Page validation passed');
    } else {
      this.logError('Page validation failed');
    }
    
    return isValid;
  }

  // ============ УТИЛИТЫ ============
  
  async waitForTimeout(ms: number): Promise<void> {
    this.logStep(`Waiting for ${ms}ms`);
    await this.page.waitForTimeout(ms);
    this.logSuccess(`Waited for ${ms}ms`);
  }

  async reload(): Promise<void> {
    this.logStep('Reloading page');
    await this.page.reload();
    await this.waitForPageToLoad();
    this.logSuccess('Page reloaded');
  }

  async goBack(): Promise<void> {
    this.logStep('Going back');
    await this.page.goBack();
    await this.waitForPageToLoad();
    this.logSuccess('Went back');
  }

  async goForward(): Promise<void> {
    this.logStep('Going forward');
    await this.page.goForward();
    await this.waitForPageToLoad();
    this.logSuccess('Went forward');
  }

  // ============ ГЕТТЕРЫ ============
  
  get pageUrl(): string {
    return this.url;
  }

  get pageTitleText(): string {
    return this.pageTitle;
  }

  get pageInstance(): Page {
    return this.page;
  }
}
