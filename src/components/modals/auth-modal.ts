/**
 * Auth Modal Component - Компонент модального окна авторизации
 */

import { Page, Locator } from '@playwright/test';
import { BaseAuthModal } from '../../core/base-auth-modal';
import { HeaderComponent } from '@/components/header.component';

export class AuthModalComponent extends BaseAuthModal {
  private readonly headerComponent: HeaderComponent;

  constructor(page: Page) {
    super(page, 'AuthModal');
    this.headerComponent = new HeaderComponent(page);
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
    return this.page.locator('#password-login');
  }

  get loginButtonSelector(): Locator {
    return this.page.locator('#tab-login .btn-default');
  }

  get forgotPasswordSelector(): Locator {
    return this.page.locator('a[wire\\:click="forgotPassword"]');
  }

  /**
   * Открыть модальное окно авторизации
   */
  async open(): Promise<void> {
    this.logStep('Opening auth modal');
    await this.headerComponent.openLoginModal();
    await this.waitForModalOpen();
    this.logSuccess('Auth modal opened');
  }

  /**
   * Закрыть модальное окно авторизации
   */
  async close(): Promise<void> {
    this.logStep('Closing auth modal');
    await this.closeByButton();
    await this.waitForModalClose();
    this.logSuccess('Auth modal closed');
  }

  /**
   * Переключиться на таб входа
   */
  async switchToLoginTab(): Promise<void> {
    this.logStep('Switching to login tab');
    await this.headerComponent.openLoginModal();
    await this.page.waitForSelector('#tab-login.active');
    this.logSuccess('Switched to login tab');
  }


  /**
   * Отправить форму входа
   */
  async submitLogin(): Promise<void> {
    this.logStep('Submitting login form');
    await this.loginButtonSelector.click();
    await this.page.waitForTimeout(2000);
    this.logSuccess('Login form submitted');
  }

  /**
   * Восстановить пароль
   */
  async forgotPassword(): Promise<void> {
    this.logStep('Initiating password recovery');
    await this.forgotPasswordSelector.click();
    this.logSuccess('Password recovery initiated');
  }

  /**
   * Проверить, заблокирована ли кнопка входа
   */
  async isLoginButtonDisabled(): Promise<boolean> {
    return await this.loginButtonSelector.isDisabled();
  }

  /**
   * Очистить форму входа
   */
  async clearLoginForm(): Promise<void> {
    this.logStep('Clearing login form');
    await this.clearForm();
    this.logSuccess('Login form cleared');
  }

  /**
   * Получить доступные социальные провайдеры
   */
  async getSocialProviders(): Promise<Array<{name: string, url: string, icon: string}>> {
    const providers: Array<{name: string, url: string, icon: string}> = [];
    const socialLinks = await this.page.locator('.social-link').all();
    
    for (const link of socialLinks) {
      const href = await link.getAttribute('href');
      const icon = await link.locator('img').getAttribute('src');
      
      if (href && icon) {
        const providerName = href.includes('google') ? 'google' : 
          href.includes('telegram') ? 'telegram' : 'unknown';
        
        providers.push({
          name: providerName,
          url: href,
          icon: icon
        });
      }
    }
    
    return providers;
  }
}