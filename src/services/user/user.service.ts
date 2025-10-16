/**
 * User Service - Сервис для работы с пользователями
 */

import { Page } from '@playwright/test';
import { BaseService } from '../../core/base.service';
import { AuthModalComponent } from '../../components/modals/auth-modal';
import { RegistrationModalComponent } from '../../components/modals/registration-modal';
import { Routes } from '@config/routes';
import { HeaderComponent } from '@/components/header.component';
import { BitcapitalModalComponent } from '@/components/modals/bitcapital-modal';

export class UserService extends BaseService {
  private readonly authModal: AuthModalComponent;
  private readonly registrationModal: RegistrationModalComponent;
  private readonly headerComponent: HeaderComponent;
  private readonly bitcapitalModalComponent: BitcapitalModalComponent;
  constructor(page: Page) {
    super(page, 'UserService');
    this.authModal = new AuthModalComponent(this.page);
    this.registrationModal = new RegistrationModalComponent(this.page);
    this.headerComponent = new HeaderComponent(this.page);
    this.bitcapitalModalComponent = new BitcapitalModalComponent(this.page);
  }

  // ============ АВТОРИЗАЦИЯ ============
  /**
   * Авторизация через email
   */
  async authWithEmail(email: string, password: string): Promise<void> {
    this.logStep('Starting email authentication');
    await this.navigateTo(Routes.HOME);
    await this.headerComponent.openLoginModal();
    await this.authModal.switchToEmailMethod();
    await this.authModal.fillEmail(email);
    await this.authModal.fillPassword(password);
    await this.authModal.submitLogin();
    await this.bitcapitalModalComponent.close();
    await this.headerComponent.isUserAuthenticated(); 
    this.logSuccess('Email authentication completed');
  }

  /**
   * Авторизация через телефон
   */
  async authWithPhone(phone: string, password: string): Promise<void> {
    this.logStep('Starting phone authentication');
    await this.navigateTo(Routes.HOME);
    await this.headerComponent.openLoginModal();
    await this.authModal.switchToPhoneMethod();
    await this.authModal.fillPhone(phone);
    await this.authModal.fillPassword(password);
    await this.authModal.submitLogin();
    this.logSuccess('Phone authentication completed');
  }

  // ============ РЕГИСТРАЦИЯ ============
  /**
   * Регистрация через email
   */
  async registerWithEmail(email: string, password: string, currency: string = 'UAH'): Promise<void> {
    this.logStep('Starting email registration');
    await this.registrationModal.open();
    await this.registrationModal.switchToEmailMethod();
    await this.registrationModal.fillEmail(email);
    await this.registrationModal.fillPassword(password);
    await this.registrationModal.selectCurrency(currency);
    await this.registrationModal.acceptTerms();
    await this.registrationModal.submitRegistration();

    await this.bitcapitalModalComponent.close();
    await this.headerComponent.isUserAuthenticated(); 
    this.logSuccess('Email registration completed');
  }

  /**
   * Регистрация через телефон
   */
  async registerWithPhone(phone: string, password: string, currency: string = 'UAH'): Promise<void> {
    this.logStep('Starting phone registration');
    await this.registrationModal.open();
    await this.registrationModal.switchToPhoneMethod();
    await this.registrationModal.fillPhone(phone);
    await this.registrationModal.fillPassword(password);
    await this.registrationModal.selectCurrency(currency);
    await this.registrationModal.acceptTerms();
    await this.registrationModal.submitRegistration();
    await this.bitcapitalModalComponent.close();
    await this.headerComponent.isUserAuthenticated(); 
    this.logSuccess('Phone registration completed');
  }

  // ============ УТИЛИТЫ ============
  /**
   * Проверить, авторизован ли пользователь
   */
  async isAuthenticated(): Promise<boolean> {
    return await this.headerComponent.isUserAuthenticated();
  }

  /**
   * Закрыть модальное окно авторизации
   */
  async closeAuthModal(): Promise<void> {
    await this.authModal.close();
  }

  /**
   * Закрыть модальное окно регистрации
   */
  async closeRegistrationModal(): Promise<void> {
    await this.registrationModal.close();
  }

  /**
   * Получить текущий метод авторизации
   */
  async getCurrentAuthMethod(): Promise<'email' | 'phone'> {
    return await this.authModal.getCurrentMethod();
  }

  /**
   * Получить текущий метод регистрации
   */
  async getCurrentRegistrationMethod(): Promise<'email' | 'phone'> {
    return await this.registrationModal.getCurrentMethod();
  }

  /**
   * Проверить, открыто ли модальное окно авторизации
   */
  async isAuthModalOpen(): Promise<boolean> {
    return await this.authModal.isOpen();
  }

  /**
   * Проверить, открыто ли модальное окно регистрации
   */
  async isRegistrationModalOpen(): Promise<boolean> {
    return await this.registrationModal.isOpen();
  }
}