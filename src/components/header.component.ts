/**
 * Header Component - Компонент хедера сайта
 */

import { Page } from '@playwright/test';
import { BaseComponent } from '../core/base.component';

export class HeaderComponent extends BaseComponent {

  constructor(page: Page) {
    super(page, 'Header', '.navbar');
  }

  // ============ ОСНОВНЫЕ ЭЛЕМЕНТЫ ============
  get navbarSelector() {
    return this.page.locator('.navbar');
  }

  get logoSelector() {
    return this.page.locator('.navbar-brand a');
  }

  get menuToggleSelector() {
    return this.page.locator('.navbar-toggle').first();
  }

  get searchButtonSelector() {
    return this.page.locator('.search-toggle').first();
  }

  // ============ АВТОРИЗАЦИЯ ============
  get loginButtonSelector() {
    return this.page.getByRole('button', { name: 'Увійти' });
  }

  get registerButtonSelector() {
    return this.page.getByRole('button', { name: 'Реєстрація' });
  }

  // ============ ПОЛЬЗОВАТЕЛЬ ============
  get userAvatarSelector() {
    return this.page.locator('.avatar-drop-toggle');
  }

  get userProfileSelector() {
    return this.page.locator('.avatar-user-profile');
  }

  // ============ КОШЕЛЕК ============
  get walletBalanceSelector() {
    return this.page.locator('.wallet-block .price span');
  }

  get walletButtonSelector() {
    return this.page.locator('.wallet-block .btn-default');
  }

  // ============ БОНУСЫ ============
  get bonusButtonSelector() {
    return this.page.locator('.btn-bonus');
  }

  get bonusBadgeSelector() {
    return this.page.locator('.btn-bonus .badge');
  }

  get bonusInfoSelector() {
    return this.page.locator('.bonus-info');
  }

  get bonusBalanceSelector() {
    return this.page.locator('.bonus-info .title');
  }

  // ============ ЯЗЫКИ ============
  get languageSelector() {
    return this.page.locator('.btn-lang');
  }

  get languageDropdownSelector() {
    return this.page.locator('.lang-dropdown');
  }

  // ============ ОСНОВНЫЕ МЕТОДЫ ============
  /**
   * Проверить, видим ли хедер
   */
  async isHeaderVisible(): Promise<boolean> {
    return await this.isVisible();
  }

  /**
   * Получить логотип
   */
  async getLogo(): Promise<string> {
    const href = await this.logoSelector.getAttribute('href');
    return href || '';
  }

  /**
   * Кликнуть по логотипу
   */
  async clickLogo(): Promise<void> {
    this.logStep('Clicking logo');
    await this.logoSelector.click();
    this.logSuccess('Logo clicked');
  }

  /**
   * Открыть мобильное меню
   */
  async openMobileMenu(): Promise<void> {
    this.logStep('Opening mobile menu');
    await this.menuToggleSelector.click();
    this.logSuccess('Mobile menu opened');
  }

  /**
   * Открыть поиск
   */
  async openSearch(): Promise<void> {
    this.logStep('Opening search');
    await this.searchButtonSelector.click();
    this.logSuccess('Search opened');
  }

  // ============ АВТОРИЗАЦИЯ ============
  /**
   * Проверить, видима ли кнопка входа
   */
  async isLoginButtonVisible(): Promise<boolean> {
    return await this.loginButtonSelector.isVisible();
  }

  /**
   * Открыть модальное окно входа
   */
  async openLoginModal(): Promise<void> {
    this.logStep('Opening login modal');
    await this.loginButtonSelector.click();
    this.logSuccess('Login modal opened');
  }

  /**
   * Открыть модальное окно регистрации
   */
  async openRegisterModal(): Promise<void> {
    this.logStep('Opening register modal');
    await this.registerButtonSelector.click();
    this.logSuccess('Register modal opened');
  }

  /**
   * Проверить, авторизован ли пользователь
   */
  async isUserAuthenticated(): Promise<boolean> {
    try {
      const userMenu = this.page.locator('.user-menu, .profile-menu, [data-user]');
      const userBalance = this.page.locator('.balance, .user-balance');
      
      const isUserMenuVisible = await userMenu.isVisible();
      const isBalanceVisible = await userBalance.isVisible();
      
      const isLoggedIn = isUserMenuVisible || isBalanceVisible;
      
      this.logStep(`Login success check: ${isLoggedIn}`);
      return isLoggedIn;
    } catch (error) {
      this.logError('Error checking login success', error);
      return false;
    }
  }

  // ============ ПОЛЬЗОВАТЕЛЬ ============
  /**
   * Открыть профиль пользователя
   */
  async openUserProfile(): Promise<void> {
    this.logStep('Opening user profile');
    await this.userAvatarSelector.click();
    await this.userProfileSelector.waitFor({ state: 'visible' });
    this.logSuccess('User profile opened');
  }

  /**
   * Получить имя пользователя
   */
  async getUserName(): Promise<string> {
    const nameElement = this.page.locator('.avatar-user-profile__title');
    return await nameElement.textContent() || '';
  }

  /**
   * Получить ID пользователя
   */
  async getUserId(): Promise<string> {
    const idElement = this.page.locator('.user-id span');
    return await idElement.textContent() || '';
  }

  /**
   * Проверить, есть ли аватар пользователя
   */
  async hasUserAvatar(): Promise<boolean> {
    return await this.userAvatarSelector.isVisible();
  }

  /**
   * Получить URL аватара пользователя
   */
  async getUserAvatarUrl(): Promise<string> {
    const avatar = this.page.locator('.avatar-drop-image');
    const src = await avatar.getAttribute('src');
    return src || '';
  }

  // ============ КОШЕЛЕК ============
  /**
   * Получить баланс кошелька
   */
  async getWalletBalance(): Promise<string> {
    return await this.walletBalanceSelector.textContent() || '0.00';
  }

  /**
   * Открыть кошелек
   */
  async openWallet(): Promise<void> {
    this.logStep('Opening wallet');
    await this.walletButtonSelector.click();
    this.logSuccess('Wallet opened');
  }

  /**
   * Проверить, есть ли кнопка пополнения
   */
  async hasDepositButton(): Promise<boolean> {
    return await this.walletButtonSelector.isVisible();
  }

  /**
   * Получить текст кнопки пополнения
   */
  async getDepositButtonText(): Promise<string> {
    return await this.walletButtonSelector.textContent() || '';
  }

  // ============ БОНУСЫ ============
  /**
   * Кликнуть по кнопке бонусов
   */
  async clickBonusButton(): Promise<void> {
    this.logStep('Clicking bonus button');
    await this.bonusButtonSelector.click();
    this.logSuccess('Bonus button clicked');
  }

  /**
   * Получить количество бонусов
   */
  async getBonusCount(): Promise<string> {
    return await this.bonusBadgeSelector.textContent() || '0';
  }

  /**
   * Получить бонусный баланс
   */
  async getBonusBalance(): Promise<string> {
    return await this.bonusBalanceSelector.textContent() || '0.00';
  }

  /**
   * Получить прогресс бонуса
   */
  async getBonusProgress(): Promise<number> {
    const progressBar = this.page.locator('.bonus-progress .progress-bar');
    const style = await progressBar.getAttribute('style');
    const widthMatch = style?.match(/width:\s*([\d.]+)%/);
    return widthMatch ? parseFloat(widthMatch[1] || '0') : 0;
  }

  /**
   * Проверить, есть ли бонусная информация
   */
  async hasBonusInfo(): Promise<boolean> {
    return await this.bonusInfoSelector.isVisible();
  }

  /**
   * Проверить, есть ли кнопка бонусов
   */
  async hasBonusButton(): Promise<boolean> {
    return await this.bonusButtonSelector.isVisible();
  }

  // ============ НАВИГАЦИЯ ПОЛЬЗОВАТЕЛЯ ============
  /**
   * Перейти в настройки
   */
  async goToSettings(): Promise<void> {
    this.logStep('Going to settings');
    await this.openUserProfile();
    const settingsLink = this.page.locator('.avatar-user-profile a[href*="settings"]');
    await settingsLink.click();
    this.logSuccess('Navigated to settings');
  }

  /**
   * Перейти в кошелек из меню пользователя
   */
  async goToWalletFromMenu(): Promise<void> {
    this.logStep('Going to wallet from user menu');
    await this.openUserProfile();
    const walletLink = this.page.locator('.user-info-nav li:has-text("Гаманець")');
    await walletLink.click();
    this.logSuccess('Navigated to wallet from menu');
  }

  /**
   * Перейти к статистике
   */
  async goToStatistics(): Promise<void> {
    this.logStep('Going to statistics');
    await this.openUserProfile();
    const statsLink = this.page.locator('.user-info-nav li:has-text("Статистика")');
    await statsLink.click();
    this.logSuccess('Navigated to statistics');
  }

  /**
   * Перейти к бонусам
   */
  async goToBonuses(): Promise<void> {
    this.logStep('Going to bonuses');
    await this.openUserProfile();
    const bonusLink = this.page.locator('.user-info-nav li:has-text("Бонус")');
    await bonusLink.click();
    this.logSuccess('Navigated to bonuses');
  }

  /**
   * Перейти к транзакциям
   */
  async goToTransactions(): Promise<void> {
    this.logStep('Going to transactions');
    await this.openUserProfile();
    const transactionsLink = this.page.locator('.user-info-nav li:has-text("Транзакції")');
    await transactionsLink.click();
    this.logSuccess('Navigated to transactions');
  }

  /**
   * Открыть поддержку
   */
  async openSupport(): Promise<void> {
    this.logStep('Opening support');
    await this.openUserProfile();
    const supportLink = this.page.locator('.btn-live-support');
    await supportLink.click();
    this.logSuccess('Support opened');
  }

  // ============ ЯЗЫКИ ============
  /**
   * Переключить язык
   */
  async changeLanguage(): Promise<void> {
    this.logStep('Changing language');
    await this.languageSelector.click();
    await this.languageDropdownSelector.waitFor({ state: 'visible' });
    this.logSuccess('Language dropdown opened');
  }

  /**
   * Выбрать язык из выпадающего списка
   */
  async selectLanguage(language: string): Promise<void> {
    this.logStep(`Selecting language: ${language}`);
    await this.changeLanguage();
    const languageOption = this.page.locator(`.lang-dropdown-list li:has-text("${language}")`);
    await languageOption.click();
    this.logSuccess(`Language ${language} selected`);
  }

  /**
   * Получить текущий язык
   */
  async getCurrentLanguage(): Promise<string> {
    const languageIcon = this.page.locator('.btn-lang .icon-lang');
    const src = await languageIcon.getAttribute('src');
    if (src?.includes('uk.svg')) return 'Український';
    if (src?.includes('en.svg')) return 'English';
    if (src?.includes('ru.svg')) return 'Русский';
    return 'Unknown';
  }

  /**
   * Получить все доступные языки
   */
  async getAvailableLanguages(): Promise<string[]> {
    await this.changeLanguage();
    const languageItems = this.page.locator('.lang-dropdown-list li');
    const count = await languageItems.count();
    const languages: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const item = languageItems.nth(i);
      const text = await item.textContent();
      if (text) {
        languages.push(text.trim());
      }
    }
    
    return languages;
  }

  // ============ УВЕДОМЛЕНИЯ ============
  /**
   * Проверить наличие уведомлений
   */
  async hasNotifications(): Promise<boolean> {
    const count = await this.getBonusCount();
    return count !== '0' && count !== '';
  }

  /**
   * Получить количество уведомлений
   */
  async getNotificationCount(): Promise<number> {
    const count = await this.getBonusCount();
    return parseInt(count) || 0;
  }

  // ============ МЕНЮ ПОЛЬЗОВАТЕЛЯ ============
  /**
   * Проверить, открыто ли меню пользователя
   */
  async isUserMenuOpen(): Promise<boolean> {
    return await this.userProfileSelector.isVisible();
  }

  /**
   * Закрыть меню пользователя
   */
  async closeUserMenu(): Promise<void> {
    this.logStep('Closing user menu');
    await this.page.click('body', { position: { x: 10, y: 10 } });
    this.logSuccess('User menu closed');
  }

  /**
   * Получить все доступные пункты меню пользователя
   */
  async getUserMenuItems(): Promise<string[]> {
    await this.openUserProfile();
    const menuItems = this.page.locator('.user-info-nav li');
    const count = await menuItems.count();
    const items: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const item = menuItems.nth(i);
      const text = await item.textContent();
      if (text) {
        items.push(text.trim());
      }
    }
    
    return items;
  }

  // ============ УТИЛИТЫ ============
  /**
   * Выполнить выход
   */
  async logout(): Promise<void> {
    this.logStep('Logging out');
    this.logSuccess('Logged out');
  }

  /**
   * Обновить страницу
   */
  async refresh(): Promise<void> {
    this.logStep('Refreshing page');
    await this.page.reload();
    await this.navbarSelector.waitFor({ state: 'visible' });
    this.logSuccess('Page refreshed');
  }

  /**
   * Проверить, есть ли мобильное меню
   */
  async hasMobileMenu(): Promise<boolean> {
    return await this.menuToggleSelector.isVisible();
  }

  /**
   * Проверить, есть ли поиск
   */
  async hasSearch(): Promise<boolean> {
    return await this.searchButtonSelector.isVisible();
  }

  /**
   * Получить все элементы навигации
   */
  async getNavigationItems(): Promise<string[]> {
    const navItems = this.page.locator('.navbar-nav a, .navbar-nav button');
    const count = await navItems.count();
    const items: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const item = navItems.nth(i);
      const text = await item.textContent();
      if (text) {
        items.push(text.trim());
      }
    }
    
    return items;
  }
}