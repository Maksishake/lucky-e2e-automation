/**
 * Base Service - Базовый класс для всех сервисов
 */

import { Page } from '@playwright/test';
import { logger } from './logger';

export abstract class BaseService {
  protected page: Page;
  protected componentName: string;

  constructor(page: Page, componentName: string) {
    this.page = page;
    this.componentName = componentName;
  }

  /**
   * Логирование шага
   */
  protected logStep(message: string): void {
    logger.info(this.componentName, message);
  }

  /**
   * Логирование успеха
   */
  protected logSuccess(message: string): void {
    logger.info(this.componentName, `✅ ${message}`);
  }

  /**
   * Логирование ошибки
   */
  protected logError(message: string, error?: unknown): void {
    logger.error(this.componentName, `❌ ${message}`, error);
  }

  /**
   * Ожидание элемента
   */
  protected async waitForElement(selector: string, timeout: number = 10000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Ожидание завершения сетевых запросов
   */
  protected async waitForNetworkIdle(timeout: number = 5000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Ожидание загрузки страницы
   */
  protected async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Проверка видимости элемента
   */
  protected async isElementVisible(selector: string): Promise<boolean> {
    try {
      return await this.page.locator(selector).isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Проверка существования элемента
   */
  protected async isElementExists(selector: string): Promise<boolean> {
    try {
      return await this.page.locator(selector).count() > 0;
    } catch {
      return false;
    }
  }

  /**
   * Получение текста элемента
   */
  protected async getElementText(selector: string): Promise<string> {
    try {
      return await this.page.locator(selector).textContent() || '';
    } catch {
      return '';
    }
  }

  /**
   * Клик по элементу
   */
  protected async clickElement(selector: string): Promise<void> {
    await this.page.locator(selector).click();
  }

  /**
   * Заполнение поля
   */
  protected async fillField(selector: string, value: string): Promise<void> {
    await this.page.fill(selector, value);
  }

  /**
   * Очистка поля
   */
  protected async clearField(selector: string): Promise<void> {
    await this.page.fill(selector, '');
  }

  /**
   * Проверка чекбокса
   */
  protected async checkCheckbox(selector: string): Promise<void> {
    await this.page.check(selector);
  }

  /**
   * Снятие галочки с чекбокса
   */
  protected async uncheckCheckbox(selector: string): Promise<void> {
    await this.page.uncheck(selector);
  }

  /**
   * Выбор опции из селекта
   */
  protected async selectOption(selector: string, value: string): Promise<void> {
    await this.page.selectOption(selector, value);
  }

  /**
   * Ожидание появления элемента
   */
  protected async waitForElementToAppear(selector: string, timeout: number = 10000): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Ожидание исчезновения элемента
   */
  protected async waitForElementToDisappear(selector: string, timeout: number = 10000): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'hidden', timeout });
  }

  /**
   * Скролл к элементу
   */
  protected async scrollToElement(selector: string): Promise<void> {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Наведение мыши на элемент
   */
  protected async hoverElement(selector: string): Promise<void> {
    await this.page.locator(selector).hover();
  }

  /**
   * Двойной клик по элементу
   */
  protected async doubleClickElement(selector: string): Promise<void> {
    await this.page.locator(selector).dblclick();
  }

  /**
   * Правый клик по элементу
   */
  protected async rightClickElement(selector: string): Promise<void> {
    await this.page.locator(selector).click({ button: 'right' });
  }

  /**
   * Нажатие клавиши
   */
  protected async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * Ввод текста с клавиатуры
   */
  protected async typeText(text: string): Promise<void> {
    await this.page.keyboard.type(text);
  }

  /**
   * Сделать скриншот
   */
  protected async takeScreenshot(name: string): Promise<Buffer> {
    return await this.page.screenshot({ 
      path: `screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }

  /**
   * Получить текущий URL
   */
  protected getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Перейти на страницу
   */
  protected async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Обновить страницу
   */
  protected async refreshPage(): Promise<void> {
    await this.page.reload();
  }

  /**
   * Назад в браузере
   */
  protected async goBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * Вперед в браузере
   */
  protected async goForward(): Promise<void> {
    await this.page.goForward();
  }

  /**
   * Получить заголовок страницы
   */
  protected async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Выполнить JavaScript
   */
  protected async executeScript<T>(script: string): Promise<T> {
    return await this.page.evaluate(script);
  }

  /**
   * Ожидание выполнения JavaScript
   */
  protected async waitForFunction(script: string, timeout: number = 10000): Promise<void> {
    await this.page.waitForFunction(script, { timeout });
  }
}
