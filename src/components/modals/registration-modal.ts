/**
 * Registration Modal Component - Компонент модального окна регистрации
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@/core/abstract/base-component';
import { ILogger } from '@/core/interfaces/logger.interface';

export class RegistrationModalComponent extends BaseComponent {
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'RegistrationModal', '.modal-registration', loggerInstance);
  }

  // Специфичные селекторы для регистрации
  get emailInputSelector(): Locator {
    return this.page.locator('#email_registration');
  }

  get phoneInputSelector(): Locator {
    return this.page.locator('#registration-phone');
  }

  get passwordInputSelector(): Locator {
    return this.page.locator('#password_registration');
  }

  get confirmPasswordInputSelector(): Locator {
    return this.page.locator('#confirm_password_registration');
  }

  get registrationButtonSelector(): Locator {
    return this.page.locator('button[type="submit"]');
  }

  get closeButtonSelector(): Locator {
    return this.page.locator('.modal-close');
  }

  // Методы для работы с регистрацией
  async openRegistrationModal(): Promise<void> {
    this.logStep('Opening registration modal');
    await this.waitForVisible();
    this.logSuccess('Registration modal opened');
  }

  async registerWithEmail(email: string, phone: string, password: string, confirmPassword: string): Promise<void> {
    this.logStep('Registering with email');
    await this.emailInputSelector.fill(email);
    await this.phoneInputSelector.fill(phone);
    await this.passwordInputSelector.fill(password);
    await this.confirmPasswordInputSelector.fill(confirmPassword);
    await this.registrationButtonSelector.click();
    this.logSuccess('Registration with email completed');
  }

  async closeModal(): Promise<void> {
    this.logStep('Closing modal');
    await this.closeButtonSelector.click();
    this.logSuccess('Modal closed');
  }

  async isModalVisible(): Promise<boolean> {
    return await this.isVisible();
  }

  async waitForModalToClose(): Promise<void> {
    await this.waitForHidden();
  }
}