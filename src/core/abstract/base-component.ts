/**
 * Base Component - Единый базовый класс для всех UI компонентов
 * Применяет принципы SOLID:
 * - SRP: Общая функциональность для всех компонентов
 * - DIP: Зависит от абстракций (ILogger)
 * - OCP: Легко расширяется без изменения
 */

import { Page, Locator } from '@playwright/test';
import { ILogger } from '../interfaces/logger.interface';
import { logger } from '../logger';

export abstract class BaseComponent {
  protected readonly page: Page;
  protected readonly componentName: string;
  protected readonly baseSelector: string;
  protected readonly logger: ILogger;

  constructor(page: Page, componentName: string, baseSelector: string, loggerInstance?: ILogger) {
    this.page = page;
    this.componentName = componentName;
    this.baseSelector = baseSelector;
    this.logger = loggerInstance || logger;
  }

  // ============ ЛОГИРОВАНИЕ ============
  
  protected logStep(message: string): void {
    this.logger.info(this.componentName, message);
  }

  protected logSuccess(message: string): void {
    this.logger.info(this.componentName, `✅ ${message}`);
  }

  protected logError(message: string, error?: unknown): void {
    this.logger.error(this.componentName, `❌ ${message}`, error);
  }

  protected logInfo(message: string): void {
    this.logger.info(this.componentName, message);
  }

  // ============ ОСНОВНЫЕ СЕЛЕКТОРЫ ============
  
  get rootElement(): Locator {
    return this.page.locator(this.baseSelector);
  }

  get allElements(): Locator {
    return this.page.locator(this.baseSelector);
  }

  // ============ ПРОВЕРКИ ВИДИМОСТИ ============
  
  async isVisible(): Promise<boolean> {
    try {
      const isVisible = await this.rootElement.isVisible();
      this.logStep(`Component visibility check: ${isVisible}`);
      return isVisible;
    } catch (error) {
      this.logError('Failed to check component visibility', error);
      return false;
    }
  }

  async isHidden(): Promise<boolean> {
    try {
      const isHidden = await this.rootElement.isHidden();
      this.logStep(`Component hidden check: ${isHidden}`);
      return isHidden;
    } catch (error) {
      this.logError('Failed to check if component is hidden', error);
      return false;
    }
  }

  async exists(): Promise<boolean> {
    try {
      const count = await this.rootElement.count();
      const exists = count > 0;
      this.logStep(`Component exists check: ${exists}`);
      return exists;
    } catch (error) {
      this.logError('Failed to check component existence', error);
      return false;
    }
  }

  // ============ ОЖИДАНИЕ ============
  
  async waitForVisible(timeout: number = 10000): Promise<void> {
    try {
      await this.rootElement.waitFor({ state: 'visible', timeout });
      this.logSuccess(`Component became visible: ${this.componentName}`);
    } catch (error) {
      this.logError(`Component did not become visible: ${this.componentName}`, error);
      throw error;
    }
  }

  async waitForHidden(timeout: number = 10000): Promise<void> {
    try {
      await this.rootElement.waitFor({ state: 'hidden', timeout });
      this.logSuccess(`Component became hidden: ${this.componentName}`);
    } catch (error) {
      this.logError(`Component did not become hidden: ${this.componentName}`, error);
      throw error;
    }
  }

  async waitForAttached(timeout: number = 10000): Promise<void> {
    try {
      await this.rootElement.waitFor({ state: 'attached', timeout });
      this.logSuccess(`Component attached: ${this.componentName}`);
    } catch (error) {
      this.logError(`Component not attached: ${this.componentName}`, error);
      throw error;
    }
  }

  // ============ ВЗАИМОДЕЙСТВИЕ ============
  
  async click(): Promise<void> {
    try {
      await this.rootElement.click();
      this.logSuccess(`Clicked component: ${this.componentName}`);
    } catch (error) {
      this.logError(`Failed to click component: ${this.componentName}`, error);
      throw error;
    }
  }

  async hover(): Promise<void> {
    try {
      await this.rootElement.hover();
      this.logSuccess(`Hovered component: ${this.componentName}`);
    } catch (error) {
      this.logError(`Failed to hover component: ${this.componentName}`, error);
      throw error;
    }
  }

  async doubleClick(): Promise<void> {
    try {
      await this.rootElement.dblclick();
      this.logSuccess(`Double clicked component: ${this.componentName}`);
    } catch (error) {
      this.logError(`Failed to double click component: ${this.componentName}`, error);
      throw error;
    }
  }

  async rightClick(): Promise<void> {
    try {
      await this.rootElement.click({ button: 'right' });
      this.logSuccess(`Right clicked component: ${this.componentName}`);
    } catch (error) {
      this.logError(`Failed to right click component: ${this.componentName}`, error);
      throw error;
    }
  }

  // ============ ПОЛУЧЕНИЕ ДАННЫХ ============
  
  async getText(): Promise<string> {
    try {
      const text = await this.rootElement.textContent() || '';
      this.logStep(`Got text from component: "${text}"`);
      return text;
    } catch (error) {
      this.logError('Failed to get text from component', error);
      return '';
    }
  }

  async getAttribute(attributeName: string): Promise<string | null> {
    try {
      const value = await this.rootElement.getAttribute(attributeName);
      this.logStep(`Got attribute ${attributeName}: "${value}"`);
      return value;
    } catch (error) {
      this.logError(`Failed to get attribute ${attributeName}`, error);
      return null;
    }
  }

  async getInnerHTML(): Promise<string> {
    try {
      const html = await this.rootElement.innerHTML();
      this.logStep('Got inner HTML from component');
      return html;
    } catch (error) {
      this.logError('Failed to get inner HTML from component', error);
      return '';
    }
  }

  async getOuterHTML(): Promise<string> {
    try {
      const html = await this.rootElement.evaluate(el => el.outerHTML);
      this.logStep('Got outer HTML from component');
      return html;
    } catch (error) {
      this.logError('Failed to get outer HTML from component', error);
      return '';
    }
  }

  // ============ ПОДСЧЕТ ЭЛЕМЕНТОВ ============
  
  async getCount(): Promise<number> {
    try {
      const count = await this.allElements.count();
      this.logStep(`Component count: ${count}`);
      return count;
    } catch (error) {
      this.logError('Failed to get component count', error);
      return 0;
    }
  }

  // ============ СКРОЛЛ ============
  
  async scrollIntoView(): Promise<void> {
    try {
      await this.rootElement.scrollIntoViewIfNeeded();
      this.logSuccess(`Scrolled to component: ${this.componentName}`);
    } catch (error) {
      this.logError(`Failed to scroll to component: ${this.componentName}`, error);
      throw error;
    }
  }

  // ============ СКРИНШОТ ============
  
  async takeScreenshot(name?: string): Promise<Buffer> {
    try {
      const screenshotName = name || `${this.componentName}-${Date.now()}`;
      const screenshot = await this.rootElement.screenshot({ 
        path: `screenshots/${screenshotName}.png`
      });
      this.logSuccess(`Screenshot taken: ${screenshotName}`);
      return screenshot;
    } catch (error) {
      this.logError('Failed to take screenshot of component', error);
      throw error;
    }
  }

  // ============ РАБОТА С ДОЧЕРНИМИ ЭЛЕМЕНТАМИ ============
  
  async findChild(selector: string): Promise<Locator> {
    return this.rootElement.locator(selector);
  }

  async getChildText(selector: string): Promise<string> {
    try {
      const child = await this.findChild(selector);
      const text = await child.textContent() || '';
      this.logStep(`Got child text from ${selector}: "${text}"`);
      return text;
    } catch (error) {
      this.logError(`Failed to get child text from ${selector}`, error);
      return '';
    }
  }

  async clickChild(selector: string): Promise<void> {
    try {
      const child = await this.findChild(selector);
      await child.click();
      this.logSuccess(`Clicked child element: ${selector}`);
    } catch (error) {
      this.logError(`Failed to click child element: ${selector}`, error);
      throw error;
    }
  }

  async isChildVisible(selector: string): Promise<boolean> {
    try {
      const child = await this.findChild(selector);
      const isVisible = await child.isVisible();
      this.logStep(`Child visibility check ${selector}: ${isVisible}`);
      return isVisible;
    } catch (error) {
      this.logError(`Failed to check child visibility: ${selector}`, error);
      return false;
    }
  }

  async getChildrenCount(selector: string): Promise<number> {
    try {
      const children = this.rootElement.locator(selector);
      const count = await children.count();
      this.logStep(`Children count for ${selector}: ${count}`);
      return count;
    } catch (error) {
      this.logError(`Failed to get children count: ${selector}`, error);
      return 0;
    }
  }

  // ============ ПРОВЕРКИ СОСТОЯНИЯ ============
  
  async isDisabled(): Promise<boolean> {
    try {
      const isDisabled = await this.rootElement.isDisabled();
      this.logStep(`Component disabled check: ${isDisabled}`);
      return isDisabled;
    } catch (error) {
      this.logError('Failed to check if component is disabled', error);
      return false;
    }
  }

  async isChecked(): Promise<boolean> {
    try {
      const isChecked = await this.rootElement.isChecked();
      this.logStep(`Component checked check: ${isChecked}`);
      return isChecked;
    } catch (error) {
      this.logError('Failed to check if component is checked', error);
      return false;
    }
  }

  async hasClass(className: string): Promise<boolean> {
    try {
      const classes = await this.getAttribute('class');
      const hasClass = classes?.includes(className) || false;
      this.logStep(`Component has class ${className}: ${hasClass}`);
      return hasClass;
    } catch (error) {
      this.logError(`Failed to check if component has class: ${className}`, error);
      return false;
    }
  }

  async hasDataAttribute(attributeName: string): Promise<boolean> {
    try {
      const value = await this.getAttribute(`data-${attributeName}`);
      const hasAttribute = value !== null;
      this.logStep(`Component has data attribute ${attributeName}: ${hasAttribute}`);
      return hasAttribute;
    } catch (error) {
      this.logError(`Failed to check if component has data attribute: ${attributeName}`, error);
      return false;
    }
  }

  async getDataAttribute(attributeName: string): Promise<string | null> {
    return await this.getAttribute(`data-${attributeName}`);
  }

  // ============ РАБОТА СО ЗНАЧЕНИЯМИ ============
  
  async getValue(): Promise<string> {
    try {
      const value = await this.rootElement.inputValue();
      this.logStep(`Got component value: "${value}"`);
      return value;
    } catch (error) {
      this.logError('Failed to get component value', error);
      return '';
    }
  }

  async setValue(value: string): Promise<void> {
    try {
      await this.rootElement.fill(value);
      this.logSuccess(`Set component value: "${value}"`);
    } catch (error) {
      this.logError(`Failed to set component value: "${value}"`, error);
      throw error;
    }
  }

  async clearValue(): Promise<void> {
    try {
      await this.rootElement.clear();
      this.logSuccess('Cleared component value');
    } catch (error) {
      this.logError('Failed to clear component value', error);
      throw error;
    }
  }

  // ============ ПОЗИЦИЯ И РАЗМЕР ============
  
  async getPosition(): Promise<{ x: number; y: number }> {
    try {
      const box = await this.rootElement.boundingBox();
      const position = {
        x: box?.x || 0,
        y: box?.y || 0
      };
      this.logStep(`Component position: x=${position.x}, y=${position.y}`);
      return position;
    } catch (error) {
      this.logError('Failed to get component position', error);
      return { x: 0, y: 0 };
    }
  }

  async getSize(): Promise<{ width: number; height: number }> {
    try {
      const box = await this.rootElement.boundingBox();
      const size = {
        width: box?.width || 0,
        height: box?.height || 0
      };
      this.logStep(`Component size: width=${size.width}, height=${size.height}`);
      return size;
    } catch (error) {
      this.logError('Failed to get component size', error);
      return { width: 0, height: 0 };
    }
  }

  async isInViewport(): Promise<boolean> {
    try {
      const isInViewport = await this.rootElement.isVisible();
      this.logStep(`Component in viewport: ${isInViewport}`);
      return isInViewport;
    } catch (error) {
      this.logError('Failed to check if component is in viewport', error);
      return false;
    }
  }

  // ============ УТИЛИТЫ ============
  
  get name(): string {
    return this.componentName;
  }

  get selector(): string {
    return this.baseSelector;
  }

  get pageInstance(): Page {
    return this.page;
  }

  // ============ ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ============
  
  protected async waitForElement(selector: string, timeout: number = 10000): Promise<void> {
    try {
      await this.page.waitForSelector(selector, { timeout });
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
}