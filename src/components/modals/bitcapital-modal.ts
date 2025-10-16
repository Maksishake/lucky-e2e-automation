import { Page, Locator } from '@playwright/test';
import { BaseModal } from '../../core/base.modal';

export class BitcapitalModalComponent extends BaseModal {
  constructor(page: Page) {
    super(page, 'BitcapitalModal');
  }

  get modalSelector(): Locator {
    return this.page.locator('#modal-bitcapital-offer');
  }

  get closeButtonSelector(): Locator {
    return this.page.locator('.modal-close');
  }

  get bitcapitalImageSelector(): Locator {
    return this.page.locator('img[alt="Bitcapital"]');
  }

  get titleSelector(): Locator {
    return this.page.locator('.text-white.text-center.body-bold');
  }

  get descriptionSelector(): Locator {
    return this.page.locator('.text-white.text-center.body-sm');
  }

  get loanButtonSelector(): Locator {
    return this.page.locator('a[href*="bitcapital.top"]');
  }

  get modalDialogSelector(): Locator {
    return this.page.locator('.modal-dialog');
  }

  get modalContentSelector(): Locator {
    return this.page.locator('.modal-content');
  }

  get qrToggleSelector(): Locator {
    return this.page.locator('#qrToggle');
  }
  /**
   * Открыть модальное окно Bitcapital
   */
  async open(): Promise<void> {
    this.logStep('Opening Bitcapital modal');
    await this.waitForModalOpen();
    this.logSuccess('Bitcapital modal opened');
  }
  
  /**
   * Закрыть модальное окно Bitcapital
   */
  async close(): Promise<void> {
    this.logStep('Closing Bitcapital modal');
    try {
      if (await this.closeButtonSelector.first().isVisible() && await this.qrToggleSelector.isVisible()) {
        await this.closeButtonSelector.first().click();
        await this.closeQrCode();
      }
      else {
        await this.closeByBackdrop();
      }
      await this.waitForModalClose();
      this.logSuccess('Bitcapital modal closed');
    } catch (error) {
      this.logError('Error closing Bitcapital modal', error);
    }
  }

  /**
   * Закрыть QR код
   */
  async closeQrCode(): Promise<void> {
    this.logStep('Closing QR code');
    await this.qrToggleSelector.click();
    this.logSuccess('QR code closed');
  }
}