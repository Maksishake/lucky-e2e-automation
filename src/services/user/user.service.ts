/**
 * User Service - Сервис для работы с пользователями
 */

import { Page } from '@playwright/test';
import { BaseService } from '../../core/abstract/base-service';
import { AuthModalComponent } from '../../components/modals/auth-modal';
import { RegistrationModalComponent } from '../../components/modals/registration-modal';
// import { Routes } from '@config/routes';
import { HeaderComponent } from '@/components/header.component';
import { BitcapitalModalComponent } from '@/components/modals/bitcapital-modal';
import { ILogger } from '@/core/interfaces/logger.interface';
import { logger } from '@/core/logger';

export class UserService extends BaseService {
  private readonly authModal: AuthModalComponent;
  private readonly registrationModal: RegistrationModalComponent;
  private readonly headerComponent: HeaderComponent;
  private readonly bitcapitalModalComponent: BitcapitalModalComponent;
  
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'UserService', loggerInstance || logger);
    this.authModal = new AuthModalComponent(page, loggerInstance);
    this.registrationModal = new RegistrationModalComponent(page, loggerInstance);
    this.headerComponent = new HeaderComponent(page, loggerInstance);
    this.bitcapitalModalComponent = new BitcapitalModalComponent(page, loggerInstance);
  }

  // ============ АВТОРИЗАЦИЯ ============
  /**
   * Авторизация через email
   */
  async loginWithEmail(email: string, password: string): Promise<void> {
    this.logStep(`Logging in with email: ${email}`);
    
    try {
      await this.authModal.openLoginModal();
      await this.authModal.loginWithEmail(email, password);
      await this.authModal.waitForModalToClose();
      
      this.logSuccess('Login with email completed');
    } catch (error) {
      this.logError(`Failed to login with email: ${error}`);
      throw error;
    }
  }

  /**
   * Авторизация через телефон
   */
  async loginWithPhone(phone: string, password: string): Promise<void> {
    this.logStep(`Logging in with phone: ${phone}`);
    
    try {
      await this.authModal.openLoginModal();
      await this.authModal.loginWithPhone(phone, password);
      await this.authModal.waitForModalToClose();
      
      this.logSuccess('Login with phone completed');
    } catch (error) {
      this.logError(`Failed to login with phone: ${error}`);
      throw error;
    }
  }

  /**
   * Регистрация нового пользователя
   */
  async registerUser(email: string, phone: string, password: string, confirmPassword: string): Promise<void> {
    this.logStep(`Registering new user: ${email}`);
    
    try {
      await this.registrationModal.openRegistrationModal();
      await this.registrationModal.registerWithEmail(email, phone, password, confirmPassword);
      await this.registrationModal.waitForModalToClose();
      
      this.logSuccess('User registration completed');
    } catch (error) {
      this.logError(`Failed to register user: ${error}`);
      throw error;
    }
  }

  /**
   * Выход из системы
   */
  async logout(): Promise<void> {
    this.logStep('Logging out');
    
    try {
      await this.headerComponent.clickLogoutButton();
      this.logSuccess('Logout completed');
    } catch (error) {
      this.logError(`Failed to logout: ${error}`);
      throw error;
    }
  }

  /**
   * Проверка авторизации
   */
  async isLoggedIn(): Promise<boolean> {
    this.logStep('Checking if user is logged in');
    
    try {
      const isLoggedIn = await this.headerComponent.isUserLoggedIn();
      this.logStep(`User logged in status: ${isLoggedIn}`);
      return isLoggedIn;
    } catch (error) {
      this.logError(`Failed to check login status: ${error}`);
      return false;
    }
  }

  /**
   * Получение информации о пользователе
   */
  async getUserInfo(): Promise<{ email?: string; phone?: string; balance?: string }> {
    this.logStep('Getting user information');
    
    try {
      const userInfo = await this.headerComponent.getUserInfo();
      this.logSuccess('User information retrieved');
      return userInfo;
    } catch (error) {
      this.logError(`Failed to get user info: ${error}`);
      return {};
    }
  }

  /**
   * Пополнение счета
   */
  async deposit(amount: string): Promise<void> {
    this.logStep(`Depositing amount: ${amount}`);
    
    try {
      await this.bitcapitalModalComponent.openDepositModal();
      await this.bitcapitalModalComponent.enterAmount(amount);
      await this.bitcapitalModalComponent.confirmDeposit();
      
      this.logSuccess('Deposit completed');
    } catch (error) {
      this.logError(`Failed to deposit: ${error}`);
      throw error;
    }
  }

  /**
   * Вывод средств
   */
  async withdraw(amount: string): Promise<void> {
    this.logStep(`Withdrawing amount: ${amount}`);
    
    try {
      await this.bitcapitalModalComponent.openWithdrawModal();
      await this.bitcapitalModalComponent.enterAmount(amount);
      await this.bitcapitalModalComponent.confirmWithdraw();
      
      this.logSuccess('Withdrawal completed');
    } catch (error) {
      this.logError(`Failed to withdraw: ${error}`);
      throw error;
    }
  }

  /**
   * Проверка баланса
   */
  async getBalance(): Promise<string> {
    this.logStep('Getting user balance');
    
    try {
      const balance = await this.headerComponent.getUserBalance();
      this.logStep(`Current balance: ${balance}`);
      return balance;
    } catch (error) {
      this.logError(`Failed to get balance: ${error}`);
      return '0';
    }
  }
}