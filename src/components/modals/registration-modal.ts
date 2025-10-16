/**
 * Registration Modal Component - Компонент модального окна регистрации
 */

import { Page, Locator } from '@playwright/test';
import { BaseAuthModal } from '../../core/base-auth-modal';

export class RegistrationModalComponent extends BaseAuthModal {
  constructor(page: Page) {
    super(page, 'RegistrationModal');
  }

  // Специфичные селекторы для регистрации
  get registrationTabSelector(): Locator {
    return this.page.locator('[data-tab="tab-signup"]');
  }

  get emailInputSelector(): Locator {
    return this.page.locator('#email');
  }

  get phoneInputSelector(): Locator {
    return this.page.locator('#phone-signup');
  }

  get passwordInputSelector(): Locator {
    return this.page.locator('#password-signup');
  }

  get promocodeInputSelector(): Locator {
    return this.page.locator('#promocode');
  }

  get submitButtonSelector(): Locator {
    return this.page.locator('#submit-btn');
  }

  /**
   * Открыть модальное окно регистрации
   */
  async open(): Promise<void> {
    this.logStep('Opening registration modal');
    
    const registerButton = this.page.locator('button:has-text("Реєстрація")').first();
    await registerButton.click();
    await this.waitForModalOpen();
    this.logSuccess('Registration modal opened');
  }

  /**
   * Закрыть модальное окно регистрации
   */
  async close(): Promise<void> {
    this.logStep('Closing registration modal');
    await this.closeByButton();
    await this.waitForModalClose();
    this.logSuccess('Registration modal closed');
  }

  /**
   * Переключиться на таб регистрации
   */
  async switchToRegistrationTab(): Promise<void> {
    this.logStep('Switching to registration tab');
    await this.registrationTabSelector.click();
    await this.page.waitForSelector('#tab-signup.active');
    this.logSuccess('Switched to registration tab');
  }


  /**
   * Заполнить промокод
   */
  async fillPromocode(promocode: string): Promise<void> {
    this.logStep(`Filling promocode: ${promocode}`);
    await this.promocodeInputSelector.fill(promocode);
    this.logSuccess('Promocode filled');
  }


  /**
   * Отправить форму регистрации
   */
  async submitRegistration(): Promise<void> {
    this.logStep('Submitting registration form');
    await this.submitButtonSelector.click();
    await this.page.waitForSelector('#tab-inner-2', { timeout: 10000 });
    this.logSuccess('Registration form submitted, SMS confirmation required');
  }

  /**
   * Очистить форму регистрации
   */
  async clearRegistrationForm(): Promise<void> {
    this.logStep('Clearing registration form');
    await this.clearForm();
    await this.promocodeInputSelector.fill('');
    this.logSuccess('Registration form cleared');
  }
}