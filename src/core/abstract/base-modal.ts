/**
 * Base Modal - Базовый класс для всех модальных окон
 * Применяет принципы SOLID и наследует от BaseComponent
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from './base-component';
import { ILogger } from '../interfaces/logger.interface';

export abstract class BaseModal extends BaseComponent {
  protected readonly modalSelector: string;

  constructor(page: Page, modalName: string, modalSelector: string, loggerInstance?: ILogger) {
    super(page, modalName, modalSelector, loggerInstance);
    this.modalSelector = modalSelector;
  }

  // ============ ОСНОВНЫЕ СЕЛЕКТОРЫ ============
  
  get modalContainer(): Locator {
    return this.page.locator(this.modalSelector);
  }

  get modalContent(): Locator {
    return this.page.locator(`${this.modalSelector} .modal-content`);
  }

  get modalHeader(): Locator {
    return this.page.locator(`${this.modalSelector} .modal-header`);
  }

  get modalTitle(): Locator {
    return this.page.locator(`${this.modalSelector} .modal-title`);
  }

  get modalBody(): Locator {
    return this.page.locator(`${this.modalSelector} .modal-body`);
  }

  get modalFooter(): Locator {
    return this.page.locator(`${this.modalSelector} .modal-footer`);
  }

  get closeButton(): Locator {
    return this.page.locator(`${this.modalSelector} .btn-close, ${this.modalSelector} .close`);
  }

  get backdrop(): Locator {
    return this.page.locator(`${this.modalSelector} .modal-backdrop`);
  }

  // ============ ОСНОВНЫЕ МЕТОДЫ ============
  
  async open(): Promise<void> {
    this.logStep('Opening modal');
    await this.waitForVisible();
    this.logSuccess('Modal opened');
  }

  async close(): Promise<void> {
    this.logStep('Closing modal');
    await this.closeButton.click();
    await this.waitForHidden();
    this.logSuccess('Modal closed');
  }

  async closeByBackdrop(): Promise<void> {
    this.logStep('Closing modal by backdrop click');
    await this.backdrop.click();
    await this.waitForHidden();
    this.logSuccess('Modal closed by backdrop');
  }

  async isOpen(): Promise<boolean> {
    return await this.isVisible();
  }

  async waitForOpen(): Promise<void> {
    await this.waitForVisible();
  }

  async waitForClose(): Promise<void> {
    await this.waitForHidden();
  }

  async getTitle(): Promise<string> {
    return await this.getChildText('.modal-title');
  }

  async getContent(): Promise<string> {
    return await this.getChildText('.modal-body');
  }

  // ============ ВАЛИДАЦИЯ ============
  
  async hasCloseButton(): Promise<boolean> {
    return await this.isChildVisible('.btn-close, .close');
  }

  async hasBackdrop(): Promise<boolean> {
    return await this.isChildVisible('.modal-backdrop');
  }

  async isModalCentered(): Promise<boolean> {
    const classes = await this.getAttribute('class') || '';
    return classes.includes('modal-centered');
  }

  async isModalScrollable(): Promise<boolean> {
    const classes = await this.getAttribute('class') || '';
    return classes.includes('modal-scrollable');
  }

  // ============ ВЗАИМОДЕЙСТВИЕ С КНОПКАМИ ============
  
  async clickButton(buttonText: string): Promise<void> {
    this.logStep(`Clicking button: ${buttonText}`);
    const button = this.modalContent.locator(`button:has-text("${buttonText}")`);
    await button.click();
    this.logSuccess(`Button clicked: ${buttonText}`);
  }

  async clickButtonBySelector(selector: string): Promise<void> {
    this.logStep(`Clicking button by selector: ${selector}`);
    await this.clickChild(selector);
    this.logSuccess(`Button clicked: ${selector}`);
  }

  // ============ РАБОТА С ФОРМАМИ ============
  
  async fillField(fieldSelector: string, value: string): Promise<void> {
    this.logStep(`Filling field ${fieldSelector} with: ${value}`);
    const field = this.modalContent.locator(fieldSelector);
    await field.fill(value);
    this.logSuccess(`Field filled: ${fieldSelector}`);
  }

  async selectOption(selectSelector: string, optionValue: string): Promise<void> {
    this.logStep(`Selecting option ${optionValue} in ${selectSelector}`);
    const select = this.modalContent.locator(selectSelector);
    await select.selectOption(optionValue);
    this.logSuccess(`Option selected: ${optionValue}`);
  }

  async checkCheckbox(checkboxSelector: string): Promise<void> {
    this.logStep(`Checking checkbox: ${checkboxSelector}`);
    const checkbox = this.modalContent.locator(checkboxSelector);
    await checkbox.check();
    this.logSuccess(`Checkbox checked: ${checkboxSelector}`);
  }

  async uncheckCheckbox(checkboxSelector: string): Promise<void> {
    this.logStep(`Unchecking checkbox: ${checkboxSelector}`);
    const checkbox = this.modalContent.locator(checkboxSelector);
    await checkbox.uncheck();
    this.logSuccess(`Checkbox unchecked: ${checkboxSelector}`);
  }

  // ============ ВАЛИДАЦИЯ ФОРМ ============
  
  async getFieldValue(fieldSelector: string): Promise<string> {
    const field = this.modalContent.locator(fieldSelector);
    return await field.inputValue();
  }

  async isFieldValid(fieldSelector: string): Promise<boolean> {
    const field = this.modalContent.locator(fieldSelector);
    const classes = await field.getAttribute('class') || '';
    return !classes.includes('is-invalid');
  }

  async getFieldError(fieldSelector: string): Promise<string> {
    const errorElement = this.modalContent.locator(`${fieldSelector} + .invalid-feedback`);
    return await errorElement.textContent() || '';
  }

  // ============ УТИЛИТЫ ============
  
  async getModalSize(): Promise<'sm' | 'md' | 'lg' | 'xl' | 'unknown'> {
    const classes = await this.getAttribute('class') || '';
    
    if (classes.includes('modal-sm')) return 'sm';
    if (classes.includes('modal-md')) return 'md';
    if (classes.includes('modal-lg')) return 'lg';
    if (classes.includes('modal-xl')) return 'xl';
    
    return 'unknown';
  }

  async isModalFullscreen(): Promise<boolean> {
    const classes = await this.getAttribute('class') || '';
    return classes.includes('modal-fullscreen');
  }

  async isModalStatic(): Promise<boolean> {
    const classes = await this.getAttribute('class') || '';
    return classes.includes('modal-static');
  }
}
