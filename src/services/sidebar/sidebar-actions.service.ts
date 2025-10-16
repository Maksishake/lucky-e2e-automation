/**
 * Sidebar Actions Service - Сервис для действий в сайдбаре
 * Отвечает за различные действия: промо-код, получение денег, Telegram, поддержка
 */

import { Page } from '@playwright/test';
import { BaseService } from '../../core/base.service';

export class SidebarActionsService extends BaseService {
  constructor(page: Page) {
    super(page, 'SidebarActionsService');
  }

  /**
   * Открыть промо-код
   */
  async openPromocode(): Promise<boolean> {
    this.logStep('Opening promocode modal');
    
    try {
      const sidebar = this.page.locator('sidebar.menu');
      const promocodeLink = sidebar.locator('a[onclick*="modal-promocode"]');
      
      await promocodeLink.click();
      
      // Ждем появления модального окна промо-кода
      await this.page.waitForSelector('[wire\\:id*="modal-promocode"]', { 
        state: 'visible', 
        timeout: 5000 
      });
      
      this.logSuccess('Promocode modal opened successfully');
      return true;
    } catch (error) {
      this.logError(`Failed to open promocode: ${error}`);
      return false;
    }
  }

  /**
   * Получить деньги (переход на внешний сайт)
   */
  async getMoney(): Promise<boolean> {
    this.logStep('Opening get money page');
    
    try {
      const sidebar = this.page.locator('sidebar.menu');
      const getMoneyLink = sidebar.locator('a[href*="bitcapital.top"]');
      
      // Проверяем, что ссылка открывается в новой вкладке
      const target = await getMoneyLink.getAttribute('target');
      if (target === '_blank') {
        // Для внешних ссылок просто проверяем, что ссылка существует
        const href = await getMoneyLink.getAttribute('href');
        if (href) {
          this.logSuccess(`Get money link found: ${href}`);
          return true;
        }
      }
      
      this.logError('Get money link not found or invalid');
      return false;
    } catch (error) {
      this.logError(`Failed to get money: ${error}`);
      return false;
    }
  }

  /**
   * Открыть Telegram
   */
  async openTelegram(): Promise<boolean> {
    this.logStep('Opening Telegram');
    
    try {
      const sidebar = this.page.locator('sidebar.menu');
      const telegramButton = sidebar.locator('button[onclick*="t.me/lucky_coin_gold"]');
      
      // Проверяем, что кнопка существует
      if (await telegramButton.count() > 0) {
        this.logSuccess('Telegram button found');
        return true;
      }
      
      this.logError('Telegram button not found');
      return false;
    } catch (error) {
      this.logError(`Failed to open Telegram: ${error}`);
      return false;
    }
  }

  /**
   * Открыть поддержку
   */
  async openSupport(): Promise<boolean> {
    this.logStep('Opening support');
    
    try {
      const sidebar = this.page.locator('sidebar.menu');
      const supportButton = sidebar.locator('.btn-live-support');
      
      if (await supportButton.count() > 0) {
        await supportButton.click();
        
        // Ждем появления окна поддержки или чата
        await this.page.waitForTimeout(2000);
        
        this.logSuccess('Support opened successfully');
        return true;
      }
      
      this.logError('Support button not found');
      return false;
    } catch (error) {
      this.logError(`Failed to open support: ${error}`);
      return false;
    }
  }

  /**
   * Проверить, открыт ли промо-код
   */
  async isPromocodeOpen(): Promise<boolean> {
    this.logStep('Checking if promocode is open');
    
    try {
      const promocodeModal = this.page.locator('[wire\\:id*="modal-promocode"]');
      const isVisible = await promocodeModal.isVisible();
      
      this.logStep(`Promocode modal visibility: ${isVisible}`);
      return isVisible;
    } catch (error) {
      this.logError(`Failed to check promocode status: ${error}`);
      return false;
    }
  }

  /**
   * Закрыть промо-код
   */
  async closePromocode(): Promise<boolean> {
    this.logStep('Closing promocode modal');
    
    try {
      const promocodeModal = this.page.locator('[wire\\:id*="modal-promocode"]');
      
      if (await promocodeModal.isVisible()) {
        // Ищем кнопку закрытия
        const closeButton = promocodeModal.locator('.close, .modal-close, [data-dismiss="modal"]');
        
        if (await closeButton.count() > 0) {
          await closeButton.click();
        } else {
          // Если нет кнопки закрытия, нажимаем Escape
          await this.page.keyboard.press('Escape');
        }
        
        // Ждем скрытия модального окна
        await promocodeModal.waitFor({ state: 'hidden', timeout: 3000 });
      }
      
      this.logSuccess('Promocode modal closed successfully');
      return true;
    } catch (error) {
      this.logError(`Failed to close promocode: ${error}`);
      return false;
    }
  }

  /**
   * Ввести промо-код
   */
  async enterPromocode(code: string): Promise<boolean> {
    this.logStep(`Entering promocode: ${code}`);
    
    try {
      // Сначала открываем промо-код
      if (!await this.openPromocode()) {
        return false;
      }
      
      const promocodeModal = this.page.locator('[wire\\:id*="modal-promocode"]');
      const input = promocodeModal.locator('input[type="text"], input[placeholder*="промо"], input[placeholder*="код"]');
      
      if (await input.count() > 0) {
        await input.fill(code);
        
        // Ищем кнопку активации
        const activateButton = promocodeModal.locator('button:has-text("Активировать"), button:has-text("Применить"), button[type="submit"]');
        
        if (await activateButton.count() > 0) {
          await activateButton.click();
          
          // Ждем обработки промо-кода
          await this.page.waitForTimeout(2000);
          
          this.logSuccess(`Promocode entered: ${code}`);
          return true;
        } else {
          this.logError('Activate button not found');
          return false;
        }
      } else {
        this.logError('Promocode input not found');
        return false;
      }
    } catch (error) {
      this.logError(`Failed to enter promocode: ${error}`);
      return false;
    }
  }

  /**
   * Проверить статус промо-кода
   */
  async getPromocodeStatus(): Promise<{ success: boolean; message: string }> {
    this.logStep('Getting promocode status');
    
    try {
      const promocodeModal = this.page.locator('[wire\\:id*="modal-promocode"]');
      
      // Ищем сообщения об успехе или ошибке
      const successMessage = promocodeModal.locator('.success, .alert-success, .text-green');
      const errorMessage = promocodeModal.locator('.error, .alert-error, .text-red');
      
      if (await successMessage.count() > 0) {
        const message = await successMessage.textContent();
        return { success: true, message: message || 'Promocode activated successfully' };
      } else if (await errorMessage.count() > 0) {
        const message = await errorMessage.textContent();
        return { success: false, message: message || 'Promocode activation failed' };
      }
      
      return { success: false, message: 'Status unknown' };
    } catch (error) {
      this.logError(`Failed to get promocode status: ${error}`);
      return { success: false, message: 'Error checking status' };
    }
  }

  /**
   * Получить все доступные действия
   */
  async getAvailableActions(): Promise<Array<{ name: string; type: string; isEnabled: boolean }>> {
    this.logStep('Getting available actions');
    
    try {
      const sidebar = this.page.locator('sidebar.menu');
      const actions: Array<{ name: string; type: string; isEnabled: boolean }> = [];
      
      // Проверяем промо-код
      const promocodeLink = sidebar.locator('a[onclick*="modal-promocode"]');
      if (await promocodeLink.count() > 0) {
        actions.push({ name: 'Promocode', type: 'modal', isEnabled: true });
      }
      
      // Проверяем получение денег
      const getMoneyLink = sidebar.locator('a[href*="bitcapital.top"]');
      if (await getMoneyLink.count() > 0) {
        actions.push({ name: 'Get Money', type: 'external', isEnabled: true });
      }
      
      // Проверяем Telegram
      const telegramButton = sidebar.locator('button[onclick*="t.me"]');
      if (await telegramButton.count() > 0) {
        actions.push({ name: 'Telegram', type: 'external', isEnabled: true });
      }
      
      // Проверяем поддержку
      const supportButton = sidebar.locator('.btn-live-support');
      if (await supportButton.count() > 0) {
        actions.push({ name: 'Support', type: 'chat', isEnabled: true });
      }
      
      this.logSuccess(`Found ${actions.length} available actions`);
      return actions;
    } catch (error) {
      this.logError(`Failed to get available actions: ${error}`);
      return [];
    }
  }
}
