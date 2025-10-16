/**
 * Base Auth Modal - Базовый класс для модальных окон авторизации и регистрации
 */

import { Page, Locator } from '@playwright/test';
import { BaseModal } from './base.modal';

export abstract class BaseAuthModal extends BaseModal {
  
  constructor(page: Page, componentName: string) {
    super(page, componentName);
  }

  // Общие селекторы
  get modalSelector(): Locator {
    return this.page.locator('#modal-auth');
  }

  get emailInputSelector(): Locator {
    return this.page.locator('#email_login, #email');
  }

  get phoneInputSelector(): Locator {
    return this.page.locator('#login-phone, #phone-signup');
  }

  get passwordInputSelector(): Locator {
    return this.page.locator('#password-login, #password-signup');
  }

  get emailToggleSelector(): Locator {
    return this.page.getByRole('button', { name: 'з email' }).first();
  }

  get phoneToggleSelector(): Locator {
    return this.page.getByRole('button', { name: 'з телефоном' }).first();
  }

  get conditionCheckboxSelector(): Locator {
    return this.page.locator('#condition');
  }

  get currencySelector(): Locator {
    return this.page.locator('.form-select input');
  }

  get submitButtonSelector(): Locator {
    return this.page.locator('#submit-btn, #tab-login .btn-default');
  }

  get smsCodeInputSelector(): Locator {
    return this.page.locator('#sms-code');
  }

  get smsConfirmButtonSelector(): Locator {
    return this.page.locator('#tab-inner-2 .btn-default');
  }

  // Общие методы
  /**
   * Переключить метод на email
   */
  async switchToEmailMethod(): Promise<void> {
    this.logStep('Switching to email method');
    await this.emailToggleSelector.click();
    await this.page.waitForSelector('.toggle-email:not(.hidden)');
    this.logSuccess('Switched to email method');
  }

  /**
   * Переключить метод на телефон
   */
  async switchToPhoneMethod(): Promise<void> {
    this.logStep('Switching to phone method');
    await this.phoneToggleSelector.click();
    await this.page.waitForSelector('.toggle-phone:not(.hidden)');
    this.logSuccess('Switched to phone method');
  }

  /**
   * Заполнить email
   */
  async fillEmail(email: string): Promise<void> {
    this.logStep(`Filling email: ${email}`);
    await this.emailInputSelector.fill(email);
    this.logSuccess('Email filled');
  }

  /**
   * Заполнить телефон
   */
  async fillPhone(phone: string): Promise<void> {
    this.logStep(`Filling phone: ${phone}`);
    await this.phoneInputSelector.fill(phone);
    this.logSuccess('Phone filled');
  }

  /**
   * Заполнить пароль
   */
  async fillPassword(password: string): Promise<void> {
    this.logStep('Filling password');
    await this.passwordInputSelector.fill(password);
    this.logSuccess('Password filled');
  }

  /**
   * Принять условия использования
   */
  async acceptTerms(): Promise<void> {
    this.logStep('Accepting terms and conditions');
    await this.conditionCheckboxSelector.check();
    this.logSuccess('Terms and conditions accepted');
  }

  /**
   * Выбрать валюту
   */
  async selectCurrency(currency: string): Promise<void> {
    this.logStep(`Selecting currency: ${currency}`);
    
    const currencyButton = this.page.locator('.form-select button');
    await currencyButton.click();
    
    const currencyOption = this.page.locator(`[wire\\:click="setCurrency('${currency}')"]`);
    await currencyOption.click();
    
    this.logSuccess(`Currency ${currency} selected`);
  }

  /**
   * Заполнить SMS код
   */
  async fillSmsCode(code: string): Promise<void> {
    this.logStep(`Filling SMS code: ${code}`);
    await this.smsCodeInputSelector.fill(code);
    this.logSuccess('SMS code filled');
  }

  /**
   * Подтвердить SMS код
   */
  async confirmSmsCode(code: string): Promise<void> {
    this.logStep('Confirming SMS code');
    await this.fillSmsCode(code);
    await this.smsConfirmButtonSelector.click();
    await this.page.waitForTimeout(2000);
    this.logSuccess('SMS code confirmed');
  }

  /**
   * Получить текущий метод
   */
  async getCurrentMethod(): Promise<'email' | 'phone'> {
    const emailVisible = await this.page.locator('.toggle-email:not(.hidden)').isVisible();
    return emailVisible ? 'email' : 'phone';
  }

  /**
   * Проверить, заблокирована ли кнопка отправки
   */
  async isSubmitButtonDisabled(): Promise<boolean> {
    return await this.submitButtonSelector.isDisabled();
  }

  /**
   * Проверить, приняты ли условия использования
   */
  async isTermsAccepted(): Promise<boolean> {
    return await this.conditionCheckboxSelector.isChecked();
  }

  /**
   * Дождаться загрузки формы
   */
  async waitForFormLoad(): Promise<void> {
    await this.passwordInputSelector.waitFor({ state: 'visible' });
  }

  /**
   * Дождаться появления формы подтверждения SMS
   */
  async waitForSmsForm(): Promise<void> {
    await this.page.locator('#tab-inner-2').waitFor({ state: 'visible' });
  }

  /**
   * Очистить форму
   */
  async clearForm(): Promise<void> {
    this.logStep('Clearing form');
    await this.emailInputSelector.fill('');
    await this.phoneInputSelector.fill('');
    await this.passwordInputSelector.fill('');
    await this.conditionCheckboxSelector.uncheck();
    this.logSuccess('Form cleared');
  }

  /**
   * Получить доступные валюты
   */
  async getAvailableCurrencies(): Promise<string[]> {
    const currencies: string[] = [];
    const currencyOptions = await this.page.locator('.form-select-options li').all();
    
    for (const option of currencyOptions) {
      const currencyText = await option.textContent();
      if (currencyText) {
        currencies.push(currencyText.trim());
      }
    }
    
    return currencies;
  }

  /**
   * Получить состояние таймера SMS
   */
  async getSmsTimer(): Promise<string> {
    const timerElement = this.page.locator('#timer');
    return await timerElement.textContent() || '0';
  }
}
