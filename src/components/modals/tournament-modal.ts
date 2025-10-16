/**
 * Tournament Modal Component - Компонент модального окна турнира
 */

import { Locator, Page } from '@playwright/test';
import { BaseModal } from '../../core/base.modal';

export class TournamentModalComponent extends BaseModal {
  
  // Селекторы модального окна
  get modalContainer(): Locator {
    return this.page.locator('#modal-tournament');
  }
  
  get modalContent(): Locator {
    return this.page.locator('#modal-tournament .modal-content');
  }
  
  get modalHeader(): Locator {
    return this.page.locator('#modal-tournament .modal-header');
  }
  
  get modalTitle(): Locator {
    return this.page.locator('#modal-tournament .modal-title');
  }
  
  get modalBody(): Locator {
    return this.page.locator('#modal-tournament .modal-body');
  }
  
  get modalFooter(): Locator {
    return this.page.locator('#modal-tournament .modal-footer');
  }
  
  get closeButton(): Locator {
    return this.page.locator('#modal-tournament .btn-close, #modal-tournament .close');
  }
  
  // Селекторы для информации о турнире
  get tournamentImage(): Locator {
    return this.page.locator('#modal-tournament .tournament-image');
  }
  
  get tournamentTitle(): Locator {
    return this.page.locator('#modal-tournament .tournament-title');
  }
  
  get tournamentDescription(): Locator {
    return this.page.locator('#modal-tournament .tournament-description');
  }
  
  get prizeFundInfo(): Locator {
    return this.page.locator('#modal-tournament .prize-fund');
  }
  
  get tournamentRules(): Locator {
    return this.page.locator('#modal-tournament .tournament-rules');
  }
  
  get participationInfo(): Locator {
    return this.page.locator('#modal-tournament .participation-info');
  }
  
  // Селекторы для кнопок
  get participateButton(): Locator {
    return this.page.locator('#modal-tournament button:has-text("Прийняти участь")');
  }
  
  get cancelButton(): Locator {
    return this.page.locator('#modal-tournament button:has-text("Скасувати")');
  }
  
  get backButton(): Locator {
    return this.page.locator('#modal-tournament button:has-text("Назад")');
  }
  
  // Селекторы для таймера
  get tournamentTimer(): Locator {
    return this.page.locator('#modal-tournament .tournament-timer');
  }
  
  get timerDisplay(): Locator {
    return this.page.locator('#modal-tournament .timer-display');
  }
  
  // Селекторы для таблицы призов
  get prizesTable(): Locator {
    return this.page.locator('#modal-tournament .prizes-table');
  }
  
  get prizeRows(): Locator {
    return this.page.locator('#modal-tournament .prize-row');
  }
  
  constructor(page: Page) {
    super(page, 'TournamentModal');
  }

  /**
   * Селектор модального окна
   */
  get modalSelector(): Locator {
    return this.modalContainer;
  }

  /**
   * Открыть модальное окно турнира
   */
  async open(): Promise<void> {
    this.logStep('Opening tournament modal');
    // Модальное окно открывается автоматически при клике на кнопку "Деталі"
    await this.waitForModalOpen();
    this.logSuccess('Tournament modal opened');
  }

  /**
   * Закрыть модальное окно турнира
   */
  async close(): Promise<void> {
    await this.closeModal();
  }

  /**
   * Дождаться открытия модального окна турнира
   */
  async waitForModalOpen(): Promise<void> {
    this.logStep('Waiting for tournament modal to open');
    
    try {
      await this.modalContainer.waitFor({ state: 'visible', timeout: 10000 });
      await this.modalContent.waitFor({ state: 'visible', timeout: 5000 });
      
      this.logSuccess('Tournament modal opened');
    } catch (error) {
      this.logError(`Failed to open tournament modal: ${error}`);
      throw error;
    }
  }

  /**
   * Дождаться закрытия модального окна турнира
   */
  async waitForModalClose(): Promise<void> {
    this.logStep('Waiting for tournament modal to close');
    
    try {
      await this.modalContainer.waitFor({ state: 'hidden', timeout: 10000 });
      
      this.logSuccess('Tournament modal closed');
    } catch (error) {
      this.logError(`Failed to close tournament modal: ${error}`);
      throw error;
    }
  }

  /**
   * Проверить, открыто ли модальное окно
   */
  async isModalOpen(): Promise<boolean> {
    this.logStep('Checking if tournament modal is open');
    
    try {
      const isVisible = await this.modalContainer.isVisible();
      this.logStep(`Tournament modal is open: ${isVisible}`);
      return isVisible;
    } catch (error) {
      this.logError(`Failed to check tournament modal state: ${error}`);
      return false;
    }
  }

  /**
   * Закрыть модальное окно турнира
   */
  async closeModal(): Promise<void> {
    this.logStep('Closing tournament modal');
    
    try {
      if (await this.closeButton.count() > 0) {
        await this.closeButton.click();
        await this.waitForModalClose();
        this.logSuccess('Tournament modal closed');
      } else {
        // Попробуем закрыть через клавишу Escape
        await this.page.keyboard.press('Escape');
        await this.waitForModalClose();
        this.logSuccess('Tournament modal closed with Escape key');
      }
    } catch (error) {
      this.logError(`Failed to close tournament modal: ${error}`);
      throw error;
    }
  }

  /**
   * Получить информацию о турнире из модального окна
   */
  async getTournamentInfo(): Promise<{
    title: string;
    description: string;
    prizeFund: string;
    rules: string;
    participationInfo: string;
  } | null> {
    this.logStep('Getting tournament info from modal');
    
    try {
      const title = await this.tournamentTitle.textContent() || '';
      const description = await this.tournamentDescription.textContent() || '';
      const prizeFund = await this.prizeFundInfo.textContent() || '';
      const rules = await this.tournamentRules.textContent() || '';
      const participationInfo = await this.participationInfo.textContent() || '';
      
      this.logSuccess('Tournament info retrieved from modal');
      
      return {
        title: title.trim(),
        description: description.trim(),
        prizeFund: prizeFund.trim(),
        rules: rules.trim(),
        participationInfo: participationInfo.trim()
      };
    } catch (error) {
      this.logError(`Failed to get tournament info from modal: ${error}`);
      return null;
    }
  }

  /**
   * Кликнуть по кнопке "Прийняти участь"
   */
  async clickParticipateButton(): Promise<boolean> {
    this.logStep('Clicking participate button in tournament modal');
    
    try {
      if (await this.participateButton.count() > 0) {
        await this.participateButton.click();
        this.logSuccess('Participate button clicked');
        return true;
      } else {
        this.logError('Participate button not found in tournament modal');
        return false;
      }
    } catch (error) {
      this.logError(`Failed to click participate button: ${error}`);
      return false;
    }
  }

  /**
   * Кликнуть по кнопке "Скасувати"
   */
  async clickCancelButton(): Promise<boolean> {
    this.logStep('Clicking cancel button in tournament modal');
    
    try {
      if (await this.cancelButton.count() > 0) {
        await this.cancelButton.click();
        this.logSuccess('Cancel button clicked');
        return true;
      } else {
        this.logError('Cancel button not found in tournament modal');
        return false;
      }
    } catch (error) {
      this.logError(`Failed to click cancel button: ${error}`);
      return false;
    }
  }

  /**
   * Получить информацию о таймере турнира
   */
  async getTimerInfo(): Promise<{
    timeRemaining: string;
    isActive: boolean;
  } | null> {
    this.logStep('Getting tournament timer info');
    
    try {
      if (await this.tournamentTimer.count() > 0) {
        const timeRemaining = await this.timerDisplay.textContent() || '';
        const isActive = await this.tournamentTimer.isVisible();
        
        this.logSuccess('Tournament timer info retrieved');
        
        return {
          timeRemaining: timeRemaining.trim(),
          isActive
        };
      } else {
        this.logStep('Tournament timer not found');
        return null;
      }
    } catch (error) {
      this.logError(`Failed to get tournament timer info: ${error}`);
      return null;
    }
  }

  /**
   * Получить таблицу призов
   */
  async getPrizesTable(): Promise<Array<{
    position: string;
    prize: string;
  }>> {
    this.logStep('Getting prizes table from tournament modal');
    
    try {
      const prizes = [];
      const prizeRows = await this.prizeRows.all();
      
      for (const row of prizeRows) {
        const position = await row.locator('.position').textContent() || '';
        const prize = await row.locator('.prize').textContent() || '';
        
        if (position && prize) {
          prizes.push({
            position: position.trim(),
            prize: prize.trim()
          });
        }
      }
      
      this.logSuccess(`Retrieved ${prizes.length} prizes from table`);
      return prizes;
    } catch (error) {
      this.logError(`Failed to get prizes table: ${error}`);
      return [];
    }
  }

  /**
   * Проверить, есть ли кнопка "Прийняти участь"
   */
  async hasParticipateButton(): Promise<boolean> {
    this.logStep('Checking if participate button is available');
    
    try {
      const isVisible = await this.participateButton.isVisible();
      this.logStep(`Participate button available: ${isVisible}`);
      return isVisible;
    } catch (error) {
      this.logError(`Failed to check participate button: ${error}`);
      return false;
    }
  }

  /**
   * Проверить, есть ли кнопка "Скасувати"
   */
  async hasCancelButton(): Promise<boolean> {
    this.logStep('Checking if cancel button is available');
    
    try {
      const isVisible = await this.cancelButton.isVisible();
      this.logStep(`Cancel button available: ${isVisible}`);
      return isVisible;
    } catch (error) {
      this.logError(`Failed to check cancel button: ${error}`);
      return false;
    }
  }

  /**
   * Получить полную информацию о модальном окне турнира
   */
  async getModalInfo(): Promise<{
    isOpen: boolean;
    tournamentInfo: any;
    timerInfo: any;
    prizesTable: Array<any>;
    hasParticipateButton: boolean;
    hasCancelButton: boolean;
  }> {
    this.logStep('Getting full tournament modal info');
    
    try {
      const isOpen = await this.isModalOpen();
      const tournamentInfo = await this.getTournamentInfo();
      const timerInfo = await this.getTimerInfo();
      const prizesTable = await this.getPrizesTable();
      const hasParticipateButton = await this.hasParticipateButton();
      const hasCancelButton = await this.hasCancelButton();
      
      this.logSuccess('Full tournament modal info retrieved');
      
      return {
        isOpen,
        tournamentInfo,
        timerInfo,
        prizesTable,
        hasParticipateButton,
        hasCancelButton
      };
    } catch (error) {
      this.logError(`Failed to get full tournament modal info: ${error}`);
      return {
        isOpen: false,
        tournamentInfo: null,
        timerInfo: null,
        prizesTable: [],
        hasParticipateButton: false,
        hasCancelButton: false
      };
    }
  }
}
