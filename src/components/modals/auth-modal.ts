/**
 * Auth Modal Component - Компонент модального окна авторизации
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@/core/abstract/base-component';
import { HeaderComponent } from '@/components/header.component';
import { ILogger } from '@/core/interfaces/logger.interface';
// import { logger } from '@/core/logger';

export class AuthModalComponent extends BaseComponent {
  private readonly headerComponent: HeaderComponent;

  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'AuthModal', '.modal-auth', loggerInstance);
    this.headerComponent = new HeaderComponent(page, loggerInstance);
  }

  // Специфичные селекторы для авторизации
  get loginTabSelector(): Locator {
    return this.page.locator('[data-tab="tab-login"]');
  }

  get emailInputSelector(): Locator {
    return this.page.locator('#email_login');
  }

  get phoneInputSelector(): Locator {
    return this.page.locator('#login-phone');
  }

  get passwordInputSelector(): Locator {
    return this.page.locator('#password_login');
  }

  get loginButtonSelector(): Locator {
    return this.page.locator('button[type="submit"]');
  }

  get registrationTabSelector(): Locator {
    return this.page.locator('[data-tab="tab-registration"]');
  }

  get emailRegistrationInputSelector(): Locator {
    return this.page.locator('#email_registration');
  }

  get phoneRegistrationInputSelector(): Locator {
    return this.page.locator('#registration-phone');
  }

  get passwordRegistrationInputSelector(): Locator {
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

  // Методы для работы с авторизацией
  async openLoginModal(): Promise<void> {
    this.logStep('Opening login modal');
    await this.headerComponent.clickLoginButton();
    await this.waitForVisible();
    this.logSuccess('Login modal opened');
  }

  async openRegistrationModal(): Promise<void> {
    this.logStep('Opening registration modal');
    await this.headerComponent.clickRegistrationButton();
    await this.waitForVisible();
    this.logSuccess('Registration modal opened');
  }

  async loginWithEmail(email: string, password: string): Promise<void> {
    this.logStep('Logging in with email');
    await this.loginTabSelector.click();
    await this.emailInputSelector.fill(email);
    await this.passwordInputSelector.fill(password);
    await this.loginButtonSelector.click();
    this.logSuccess('Login with email completed');
  }

  async loginWithPhone(phone: string, password: string): Promise<void> {
    this.logStep('Logging in with phone');
    await this.loginTabSelector.click();
    await this.phoneInputSelector.fill(phone);
    await this.passwordInputSelector.fill(password);
    await this.loginButtonSelector.click();
    this.logSuccess('Login with phone completed');
  }

  async registerWithEmail(email: string, phone: string, password: string, confirmPassword: string): Promise<void> {
    this.logStep('Registering with email');
    await this.registrationTabSelector.click();
    await this.emailRegistrationInputSelector.fill(email);
    await this.phoneRegistrationInputSelector.fill(phone);
    await this.passwordRegistrationInputSelector.fill(password);
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