/**
 * Bitcapital Modal Component - Компонент модального окна для работы с платежами
 */

import { Page, Locator } from '@playwright/test';
import { BaseComponent } from '@/core/abstract/base-component';
import { ILogger } from '@/core/interfaces/logger.interface';

export class BitcapitalModalComponent extends BaseComponent {
  constructor(page: Page, loggerInstance?: ILogger) {
    super(page, 'BitcapitalModal', '.modal-bitcapital', loggerInstance);
  }

  // Селекторы для элементов модального окна
  get depositButtonSelector(): Locator {
    return this.page.locator('[data-testid="deposit-button"]');
  }

  get withdrawButtonSelector(): Locator {
    return this.page.locator('[data-testid="withdraw-button"]');
  }

  get amountInputSelector(): Locator {
    return this.page.locator('#amount');
  }

  get confirmDepositButtonSelector(): Locator {
    return this.page.locator('[data-testid="confirm-deposit"]');
  }

  get confirmWithdrawButtonSelector(): Locator {
    return this.page.locator('[data-testid="confirm-withdraw"]');
  }

  get closeButtonSelector(): Locator {
    return this.page.locator('.modal-close');
  }

  // Методы для работы с модальным окном
  async openDepositModal(): Promise<void> {
    this.logStep('Opening deposit modal');
    await this.depositButtonSelector.click();
    await this.waitForVisible();
    this.logSuccess('Deposit modal opened');
  }

  async openWithdrawModal(): Promise<void> {
    this.logStep('Opening withdraw modal');
    await this.withdrawButtonSelector.click();
    await this.waitForVisible();
    this.logSuccess('Withdraw modal opened');
  }

  async enterAmount(amount: string): Promise<void> {
    this.logStep(`Entering amount: ${amount}`);
    await this.amountInputSelector.fill(amount);
    this.logSuccess('Amount entered');
  }

  async confirmDeposit(): Promise<void> {
    this.logStep('Confirming deposit');
    await this.confirmDepositButtonSelector.click();
    this.logSuccess('Deposit confirmed');
  }

  async confirmWithdraw(): Promise<void> {
    this.logStep('Confirming withdraw');
    await this.confirmWithdrawButtonSelector.click();
    this.logSuccess('Withdraw confirmed');
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