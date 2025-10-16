/**
 * Base Modal - Базовый класс для всех модальных окон
 */

import { Locator, Page } from '@playwright/test';
import { BaseService } from './base.service';

export abstract class BaseModal extends BaseService {
  constructor(page: Page, componentName: string) {
    super(page, componentName);
  }

  /**
   * Селектор модального окна
   */
  abstract get modalSelector(): Locator;

  /**
   * Открыть модальное окно
   */
  abstract open(): Promise<void>;

  /**
   * Закрыть модальное окно
   */
  abstract close(): Promise<void>;

  /**
   * Проверить, открыто ли модальное окно
   */
  async isOpen(): Promise<boolean> {
    return await this.modalSelector.isVisible();
  }

  /**
   * Дождаться открытия модального окна
   */
  protected async waitForModalOpen(): Promise<void> {
    await this.modalSelector.waitFor({ state: 'visible' });
  }

  /**
   * Дождаться закрытия модального окна
   */
  protected async waitForModalClose(): Promise<void> {
    await this.modalSelector.waitFor({ state: 'hidden' });
  }

  /**
   * Закрыть модальное окно по кнопке закрытия
   */
  protected async closeByButton(): Promise<void> {
    const closeButton = this.page.locator('.modal-close, .close, [data-dismiss="modal"]');
    if (await closeButton.isVisible()) {
      await closeButton.click();
    }
  }

  /**
   * Закрыть модальное окно по клавише Escape
   */
  protected async closeByEscape(): Promise<void> {
    await this.page.keyboard.press('Escape');
  }

  /**
   * Закрыть модальное окно по клику вне области
   */
  protected async closeByBackdrop(): Promise<void> {
    await this.page.click('body', { position: { x: 10, y: 10 } });
  }

  /**
   * Проверить наличие ошибки в модальном окне
   */
  async hasError(): Promise<boolean> {
    const errorSelectors = ['.error', '.alert-error', '.form-error', '.error-message'];
    
    for (const selector of errorSelectors) {
      if (await this.page.locator(selector).isVisible()) {
        return true;
      }
    }
    return false;
  }

  /**
   * Получить текст ошибки
   */
  async getErrorMessage(): Promise<string> {
    const errorSelectors = ['.error', '.alert-error', '.form-error', '.error-message'];
    
    for (const selector of errorSelectors) {
      const element = this.page.locator(selector);
      if (await element.isVisible()) {
        return await element.textContent() || '';
      }
    }
    return '';
  }

  /**
   * Проверить наличие успешного сообщения
   */
  async hasSuccessMessage(): Promise<boolean> {
    const successSelectors = ['.success', '.alert-success', '.success-message'];
    
    for (const selector of successSelectors) {
      if (await this.page.locator(selector).isVisible()) {
        return true;
      }
    }
    return false;
  }

  /**
   * Получить текст успешного сообщения
   */
  async getSuccessMessage(): Promise<string> {
    const successSelectors = ['.success', '.alert-success', '.success-message'];
    
    for (const selector of successSelectors) {
      const element = this.page.locator(selector);
      if (await element.isVisible()) {
        return await element.textContent() || '';
      }
    }
    return '';
  }

  /**
   * Дождаться загрузки модального окна
   */
  async waitForLoad(): Promise<void> {
    await this.waitForModalOpen();
    await this.page.waitForLoadState('networkidle');
  }
}