/**
 * Header Component - Компонент шапки сайта
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@/core/abstract/base-component';
import { ILogger } from '@/core/interfaces/logger.interface';

export class HeaderComponent extends BaseComponent {
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'Header', '.header', loggerInstance);
  }

  // Селекторы для элементов шапки
  get loginButtonSelector(): Locator {
    return this.page.locator('[data-testid="login-button"]');
  }

  get registrationButtonSelector(): Locator {
    return this.page.locator('[data-testid="registration-button"]');
  }

  get logoutButtonSelector(): Locator {
    return this.page.locator('[data-testid="logout-button"]');
  }

  get userBalanceSelector(): Locator {
    return this.page.locator('[data-testid="user-balance"]');
  }

  get userInfoSelector(): Locator {
    return this.page.locator('[data-testid="user-info"]');
  }

  get depositButtonSelector(): Locator {
    return this.page.locator('[data-testid="deposit-button"]');
  }

  get withdrawButtonSelector(): Locator {
    return this.page.locator('[data-testid="withdraw-button"]');
  }

  // Методы для работы с шапкой
  async clickLoginButton(): Promise<void> {
    this.logStep('Clicking login button');
    await this.loginButtonSelector.click();
    this.logSuccess('Login button clicked');
  }

  async clickRegistrationButton(): Promise<void> {
    this.logStep('Clicking registration button');
    await this.registrationButtonSelector.click();
    this.logSuccess('Registration button clicked');
  }

  async clickLogoutButton(): Promise<void> {
    this.logStep('Clicking logout button');
    await this.logoutButtonSelector.click();
    this.logSuccess('Logout button clicked');
  }

  async isUserLoggedIn(): Promise<boolean> {
    this.logStep('Checking if user is logged in');
    const isLoggedIn = await this.logoutButtonSelector.isVisible();
    this.logStep(`User logged in status: ${isLoggedIn}`);
    return isLoggedIn;
  }

  async getUserInfo(): Promise<{ email?: string; phone?: string; balance?: string }> {
    this.logStep('Getting user information');
    
    try {
      const userInfoElement = this.userInfoSelector;
      const userInfo = await userInfoElement.textContent() || '';
      
      // Парсим информацию о пользователе (зависит от структуры HTML)
      const email = userInfo.match(/email[:\s]+([^\s]+)/i)?.[1];
      const phone = userInfo.match(/phone[:\s]+([^\s]+)/i)?.[1];
      const balance = await this.getUserBalance();
      
      return { email, phone, balance };
    } catch (error) {
      this.logError(`Failed to get user info: ${error}`);
      return {};
    }
  }

  async getUserBalance(): Promise<string> {
    this.logStep('Getting user balance');
    
    try {
      const balance = await this.userBalanceSelector.textContent() || '0';
      this.logStep(`Current balance: ${balance}`);
      return balance;
    } catch (error) {
      this.logError(`Failed to get balance: ${error}`);
      return '0';
    }
  }

  async clickDepositButton(): Promise<void> {
    this.logStep('Clicking deposit button');
    await this.depositButtonSelector.click();
    this.logSuccess('Deposit button clicked');
  }

  async clickWithdrawButton(): Promise<void> {
    this.logStep('Clicking withdraw button');
    await this.withdrawButtonSelector.click();
    this.logSuccess('Withdraw button clicked');
  }
}