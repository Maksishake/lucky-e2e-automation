/**
 * Base Service - Единый базовый класс для всех сервисов
 * Применяет принцип SRP - общая функциональность для всех сервисов
 * Применяет принцип DIP - зависит от абстракций (ILogger)
 */

import { Page } from '@playwright/test';
import { ILogger } from '../interfaces/logger.interface';

export abstract class BaseService {
  protected readonly page: Page;
  protected readonly serviceName: string;
  protected readonly logger: ILogger;

  constructor(page: Page, serviceName: string, logger: ILogger) {
    this.page = page;
    this.serviceName = serviceName;
    this.logger = logger;
  }

  // ============ ЛОГИРОВАНИЕ ============
  protected logStep(message: string): void {
    this.logger.info(this.serviceName, message);
  }

  protected logSuccess(message: string): void {
    this.logger.info(this.serviceName, `✅ ${message}`);
  }

  protected logError(message: string, error?: unknown): void {
    this.logger.error(this.serviceName, `❌ ${message}`, error);
  }

  protected logInfo(message: string): void {
    this.logger.info(this.serviceName, message);
  }

  // ============ ОСНОВНЫЕ МЕТОДЫ ============
  protected async waitForElement(selector: string, timeout: number = 10000): Promise<void> {
    try {
      await this.page.waitForSelector(selector, { timeout });
      this.logStep(`Element appeared: ${selector}`);
    } catch (error) {
      this.logError(`Element did not appear: ${selector}`, error);
      throw error;
    }
  }

  protected async isElementVisible(selector: string): Promise<boolean> {
    try {
      const isVisible = await this.page.locator(selector).isVisible();
      this.logStep(`Element visibility check: ${selector} = ${isVisible}`);
      return isVisible;
    } catch (error) {
      this.logError(`Failed to check visibility: ${selector}`, error);
      return false;
    }
  }

  protected async isElementExists(selector: string): Promise<boolean> {
    try {
      const count = await this.page.locator(selector).count();
      const exists = count > 0;
      this.logStep(`Element exists check: ${selector} = ${exists}`);
      return exists;
    } catch (error) {
      this.logError(`Failed to check existence: ${selector}`, error);
      return false;
    }
  }

  protected async getElementText(selector: string): Promise<string> {
    try {
      const text = await this.page.locator(selector).textContent() || '';
      this.logStep(`Got text from ${selector}: "${text}"`);
      return text;
    } catch (error) {
      this.logError(`Failed to get text: ${selector}`, error);
      return '';
    }
  }

  protected async clickElement(selector: string): Promise<void> {
    try {
      await this.page.locator(selector).click();
      this.logSuccess(`Clicked element: ${selector}`);
    } catch (error) {
      this.logError(`Failed to click: ${selector}`, error);
      throw error;
    }
  }

  protected async fillField(selector: string, value: string): Promise<void> {
    try {
      await this.page.fill(selector, value);
      this.logSuccess(`Filled field ${selector} with: "${value}"`);
    } catch (error) {
      this.logError(`Failed to fill field: ${selector}`, error);
      throw error;
    }
  }

  protected async clearField(selector: string): Promise<void> {
    try {
      await this.page.fill(selector, '');
      this.logSuccess(`Cleared field: ${selector}`);
    } catch (error) {
      this.logError(`Failed to clear field: ${selector}`, error);
      throw error;
    }
  }

  protected async waitForElementToAppear(selector: string, timeout: number = 10000): Promise<void> {
    try {
      await this.page.waitForSelector(selector, { state: 'visible', timeout });
      this.logSuccess(`Element appeared: ${selector}`);
    } catch (error) {
      this.logError(`Element did not appear: ${selector}`, error);
      throw error;
    }
  }

  protected async waitForElementToDisappear(selector: string, timeout: number = 10000): Promise<void> {
    try {
      await this.page.waitForSelector(selector, { state: 'hidden', timeout });
      this.logSuccess(`Element disappeared: ${selector}`);
    } catch (error) {
      this.logError(`Element did not disappear: ${selector}`, error);
      throw error;
    }
  }

  protected async scrollToElement(selector: string): Promise<void> {
    try {
      await this.page.locator(selector).scrollIntoViewIfNeeded();
      this.logSuccess(`Scrolled to element: ${selector}`);
    } catch (error) {
      this.logError(`Failed to scroll to element: ${selector}`, error);
      throw error;
    }
  }

  protected async hoverElement(selector: string): Promise<void> {
    try {
      await this.page.locator(selector).hover();
      this.logSuccess(`Hovered over element: ${selector}`);
    } catch (error) {
      this.logError(`Failed to hover element: ${selector}`, error);
      throw error;
    }
  }

  protected async doubleClickElement(selector: string): Promise<void> {
    try {
      await this.page.locator(selector).dblclick();
      this.logSuccess(`Double clicked element: ${selector}`);
    } catch (error) {
      this.logError(`Failed to double click element: ${selector}`, error);
      throw error;
    }
  }

  protected async rightClickElement(selector: string): Promise<void> {
    try {
      await this.page.locator(selector).click({ button: 'right' });
      this.logSuccess(`Right clicked element: ${selector}`);
    } catch (error) {
      this.logError(`Failed to right click element: ${selector}`, error);
      throw error;
    }
  }

  // ============ PAGE NAVIGATION METHODS ============
  protected getCurrentUrl(): string {
    const url = this.page.url();
    this.logStep(`Current URL: ${url}`);
    return url;
  }

  protected async navigateTo(url: string): Promise<void> {
    try {
      await this.page.goto(url);
      this.logSuccess(`Navigated to: ${url}`);
    } catch (error) {
      this.logError(`Failed to navigate to: ${url}`, error);
      throw error;
    }
  }

  protected async refreshPage(): Promise<void> {
    try {
      await this.page.reload();
      this.logSuccess('Page refreshed');
    } catch (error) {
      this.logError('Failed to refresh page', error);
      throw error;
    }
  }

  protected async getPageTitle(): Promise<string> {
    try {
      const title = await this.page.title();
      this.logStep(`Page title: ${title}`);
      return title;
    } catch (error) {
      this.logError('Failed to get page title', error);
      return '';
    }
  }

  protected async waitForPageLoad(): Promise<void> {
    try {
      await this.page.waitForLoadState('domcontentloaded');
      this.logStep('Page loaded');
    } catch (error) {
      this.logError('Page load timeout', error);
      throw error;
    }
  }

  protected async waitForNetworkIdle(timeout: number = 5000): Promise<void> {
    try {
      await this.page.waitForLoadState('networkidle', { timeout });
      this.logStep('Network idle state reached');
    } catch (error) {
      this.logError('Network idle timeout', error);
      throw error;
    }
  }

  // ============ ADVANCED METHODS ============
  protected async executeScript<T>(script: string): Promise<T> {
    try {
      const result = await this.page.evaluate(script) as T;
      this.logStep('JavaScript executed successfully');
      return result;
    } catch (error) {
      this.logError('Failed to execute JavaScript', error);
      throw error;
    }
  }

  protected async waitForFunction(script: string, timeout: number = 10000): Promise<void> {
    try {
      await this.page.waitForFunction(script, { timeout });
      this.logSuccess('JavaScript function executed');
    } catch (error) {
      this.logError('JavaScript function timeout', error);
      throw error;
    }
  }

  protected async takeScreenshot(name: string): Promise<Buffer> {
    try {
      const screenshot = await this.page.screenshot({ 
        path: `screenshots/${name}-${Date.now()}.png`,
        fullPage: true 
      });
      this.logSuccess(`Screenshot taken: ${name}`);
      return screenshot;
    } catch (error) {
      this.logError(`Failed to take screenshot: ${name}`, error);
      throw error;
    }
  }

  // ============ UTILITY METHODS ============
  get pageInstance(): Page {
    return this.page;
  }

  get name(): string {
    return this.serviceName;
  }
}