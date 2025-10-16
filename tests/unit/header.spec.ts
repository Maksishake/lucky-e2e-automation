/**
 * Тесты хедера сайта
 */

import { test, expect } from '@playwright/test';
import { logger } from '@/core/logger';
import { HeaderComponent } from '@/components/header.component';

test.describe('Header Component', () => {
  let headerComponent: HeaderComponent;
  
  test.beforeEach(async ({ page }) => {
    logger.testStart('Header Tests', 'header.spec.ts');
    headerComponent = new HeaderComponent(page);
    await page.goto('/');
  });

  test('Проверка инициализации HeaderComponent', async () => {
    expect(headerComponent).toBeDefined();
    logger.assertion('HeaderComponent should be initialized', true, true, true);
  });

  test('Проверка методов HeaderComponent', async () => {
    expect(typeof headerComponent.isHeaderVisible).toBe('function');
    expect(typeof headerComponent.getLogo).toBe('function');
    expect(typeof headerComponent.clickLogo).toBe('function');
    expect(typeof headerComponent.openMobileMenu).toBe('function');
    expect(typeof headerComponent.openSearch).toBe('function');
    expect(typeof headerComponent.clickBonusButton).toBe('function');
    expect(typeof headerComponent.getBonusCount).toBe('function');
    expect(typeof headerComponent.isUserAuthenticated).toBe('function');
    expect(typeof headerComponent.openLoginModal).toBe('function');
    expect(typeof headerComponent.openRegisterModal).toBe('function');
    expect(typeof headerComponent.getWalletBalance).toBe('function');
    expect(typeof headerComponent.openWallet).toBe('function');
    expect(typeof headerComponent.openUserProfile).toBe('function');
    expect(typeof headerComponent.getUserName).toBe('function');
    expect(typeof headerComponent.getUserId).toBe('function');
    expect(typeof headerComponent.goToSettings).toBe('function');
    expect(typeof headerComponent.goToWalletFromMenu).toBe('function');
    expect(typeof headerComponent.goToStatistics).toBe('function');
    expect(typeof headerComponent.goToBonuses).toBe('function');
    expect(typeof headerComponent.goToTransactions).toBe('function');
    expect(typeof headerComponent.openSupport).toBe('function');
    expect(typeof headerComponent.getBonusBalance).toBe('function');
    expect(typeof headerComponent.getBonusProgress).toBe('function');
    expect(typeof headerComponent.changeLanguage).toBe('function');
    expect(typeof headerComponent.selectLanguage).toBe('function');
    expect(typeof headerComponent.getCurrentLanguage).toBe('function');
    expect(typeof headerComponent.hasNotifications).toBe('function');
    expect(typeof headerComponent.getNotificationCount).toBe('function');
    expect(typeof headerComponent.isUserMenuOpen).toBe('function');
    expect(typeof headerComponent.closeUserMenu).toBe('function');
    expect(typeof headerComponent.hasBonusInfo).toBe('function');
    expect(typeof headerComponent.getUserMenuItems).toBe('function');
    expect(typeof headerComponent.hasDepositButton).toBe('function');
    expect(typeof headerComponent.getDepositButtonText).toBe('function');
    expect(typeof headerComponent.hasUserAvatar).toBe('function');
    expect(typeof headerComponent.getUserAvatarUrl).toBe('function');
    expect(typeof headerComponent.logout).toBe('function');
    expect(typeof headerComponent.refresh).toBe('function');
    expect(typeof headerComponent.hasMobileMenu).toBe('function');
    expect(typeof headerComponent.getAvailableLanguages).toBe('function');
    expect(typeof headerComponent.hasSearch).toBe('function');
    expect(typeof headerComponent.hasBonusButton).toBe('function');
    expect(typeof headerComponent.getNavigationItems).toBe('function');
    logger.assertion('HeaderComponent methods should be available', true, true, true);
  });

  test('Проверка селекторов HeaderComponent', async () => {
    const navbarSelector = headerComponent.navbarSelector;
    const logoSelector = headerComponent.logoSelector;
    const menuToggleSelector = headerComponent.menuToggleSelector;
    const searchButtonSelector = headerComponent.searchButtonSelector;
    const bonusButtonSelector = headerComponent.bonusButtonSelector;
    const bonusBadgeSelector = headerComponent.bonusBadgeSelector;
    const loginButtonSelector = headerComponent.loginButtonSelector;
    const registerButtonSelector = headerComponent.registerButtonSelector;
    const userAvatarSelector = headerComponent.userAvatarSelector;
    const userProfileSelector = headerComponent.userProfileSelector;
    const walletBalanceSelector = headerComponent.walletBalanceSelector;
    const walletButtonSelector = headerComponent.walletButtonSelector;
    const languageSelector = headerComponent.languageSelector;
    const languageDropdownSelector = headerComponent.languageDropdownSelector;
    const bonusInfoSelector = headerComponent.bonusInfoSelector;
    const bonusBalanceSelector = headerComponent.bonusBalanceSelector;
    
    expect(navbarSelector).toBeDefined();
    expect(logoSelector).toBeDefined();
    expect(menuToggleSelector).toBeDefined();
    expect(searchButtonSelector).toBeDefined();
    expect(bonusButtonSelector).toBeDefined();
    expect(bonusBadgeSelector).toBeDefined();
    expect(loginButtonSelector).toBeDefined();
    expect(registerButtonSelector).toBeDefined();
    expect(userAvatarSelector).toBeDefined();
    expect(userProfileSelector).toBeDefined();
    expect(walletBalanceSelector).toBeDefined();
    expect(walletButtonSelector).toBeDefined();
    expect(languageSelector).toBeDefined();
    expect(languageDropdownSelector).toBeDefined();
    expect(bonusInfoSelector).toBeDefined();
    expect(bonusBalanceSelector).toBeDefined();
    logger.assertion('HeaderComponent selectors should be defined', true, true, true);
  });

  test('Проверка базовых методов HeaderComponent', async () => {
    const isHeaderVisible = await headerComponent.isHeaderVisible();
    const isUserAuthenticated = await headerComponent.isUserAuthenticated();
    const hasMobileMenu = await headerComponent.hasMobileMenu();
    const hasSearch = await headerComponent.hasSearch();
    const hasBonusButton = await headerComponent.hasBonusButton();
    
    expect(typeof isHeaderVisible).toBe('boolean');
    expect(typeof isUserAuthenticated).toBe('boolean');
    expect(typeof hasMobileMenu).toBe('boolean');
    expect(typeof hasSearch).toBe('boolean');
    expect(typeof hasBonusButton).toBe('boolean');
    logger.assertion('Basic HeaderComponent methods should work', true, true, true);
  });

  test.afterEach(async () => {
    await logger.saveLogsToFile(`test-${Date.now()}.json`);
  });
});
