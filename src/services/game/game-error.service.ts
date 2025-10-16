/**
 * Game Error Service - Сервис для обработки ошибок игр
 */

import { Page } from '@playwright/test';
import { BaseService } from '../../core/base.service';

export class GameErrorService extends BaseService {
  constructor(page: Page) {
    super(page, 'GameErrorService');
  }

  /**
   * Проверка на ошибку блокировки браузером (ERR_BLOCKED_BY_RESPONSE)
   * @param gameTitle - название игры
   * @returns Promise<{ hasError: boolean; errorDetails?: string }> - информация об ошибке
   */
  async checkForBrowserBlocking(gameTitle: string): Promise<{ hasError: boolean; errorDetails?: string }> {
    this.logStep(`Checking for browser blocking error for game: ${gameTitle}`);
    
    try {
      const iframe = this.page.locator('#fullscreen-container iframe');
      
      // Проверяем, что iframe существует
      if (await iframe.count() === 0) {
        this.logStep('No iframe found, browser blocking check skipped');
        return { hasError: false };
      }

      const iframeContent = iframe.contentFrame();
      if (!iframeContent) {
        this.logStep('Iframe content not accessible, browser blocking check skipped');
        return { hasError: false };
      }

      // Ждем загрузки содержимого iframe
      await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });

      // Проверяем на наличие ошибки блокировки браузером
      const blockingIndicators = [
        'ERR_BLOCKED_BY_RESPONSE',
        'Сайт заблокирован',
        'не позволяет установить соединение',
        'interstitial-wrapper',
        'main-frame-error',
        'sub-frame-error',
        'neterror',
        'error-code'
      ];
      
      const blockingSelectors = [
        '#main-frame-error',
        '#sub-frame-error',
        '.interstitial-wrapper',
        '.neterror',
        '#main-content',
        '#main-message',
        '.error-code',
        '#sub-frame-error-details'
      ];

      // Проверяем по тексту
      const textContent = await iframeContent.locator('body').textContent().catch(() => '');
      let errorFound = false;
      let errorDetails = '';

      for (const indicator of blockingIndicators) {
        if (textContent && textContent.includes(indicator)) {
          errorFound = true;
          errorDetails += `${indicator}; `;
        }
      }
      
      // Проверяем по селекторам для получения детальной информации
      if (errorFound) {
        for (const selector of blockingSelectors) {
          const elements = await iframeContent.locator(selector).all();
          for (const element of elements) {
            const elementText = await element.textContent().catch(() => '');
            if (elementText && (
              elementText.includes('ERR_BLOCKED_BY_RESPONSE') ||
              elementText.includes('заблокирован') ||
              elementText.includes('не позволяет установить соединение')
            )) {
              errorDetails += `[${selector}]: ${elementText.trim()}; `;
            }
          }
        }
      }
      
      if (errorFound) {
        this.logError(`Browser blocking error detected for game "${gameTitle}": ${errorDetails}`);
        return { hasError: true, errorDetails: errorDetails.trim() };
      }
      
      this.logStep(`No browser blocking error detected for game: ${gameTitle}`);
      return { hasError: false };

    } catch (error) {
      this.logError(`Error checking browser blocking for game "${gameTitle}": ${error}`);
      return { hasError: false };
    }
  }

  /**
   * Проверка на 500 ошибку сервера при открытии игры
   * @param gameTitle - название игры
   * @returns Promise<{ hasError: boolean; errorDetails?: string }> - информация об ошибке
   */
  async checkForServerError(gameTitle: string): Promise<{ hasError: boolean; errorDetails?: string }> {
    this.logStep(`Checking for server error for game: ${gameTitle}`);
    
    try {
      const iframe = this.page.locator('#fullscreen-container iframe');
      
      // Проверяем, что iframe существует
      if (await iframe.count() === 0) {
        this.logStep('No iframe found, server error check skipped');
        return { hasError: false };
      }

      const iframeContent = iframe.contentFrame();
      if (!iframeContent) {
        this.logStep('Iframe content not accessible, server error check skipped');
        return { hasError: false };
      }

      // Ждем загрузки содержимого iframe
      await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });

      // Проверяем на наличие 500 ошибки сервера
      const errorIndicators = [
        'HTTP Status 500',
        'Internal Server Error',
        'Request processing failed',
        'Launch game error',
        'Game not found',
        'Exception Report',
        'Root Cause'
      ];
      
      const errorSelectors = [
        'h1',
        'h2', 
        'h3',
        'pre',
        'p'
      ];

      // Проверяем по тексту
      const textContent = await iframeContent.locator('body').textContent().catch(() => '');
      let errorFound = false;
      let errorDetails = '';

      for (const indicator of errorIndicators) {
        if (textContent && textContent.includes(indicator)) {
          errorFound = true;
          errorDetails += `${indicator}; `;
        }
      }
      
      // Проверяем по селекторам для получения детальной информации
      if (errorFound) {
        for (const selector of errorSelectors) {
          const elements = await iframeContent.locator(selector).all();
          for (const element of elements) {
            const elementText = await element.textContent().catch(() => '');
            if (elementText && (
              elementText.includes('HTTP Status 500') ||
              elementText.includes('Internal Server Error') ||
              elementText.includes('Launch game error') ||
              elementText.includes('Game not found')
            )) {
              errorDetails += `[${selector}]: ${elementText.trim()}; `;
            }
          }
        }
      }
      
      if (errorFound) {
        this.logError(`Server error detected for game "${gameTitle}": ${errorDetails}`);
        return { hasError: true, errorDetails: errorDetails.trim() };
      }
      
      this.logStep(`No server error detected for game: ${gameTitle}`);
      return { hasError: false };

    } catch (error) {
      this.logError(`Error checking server error for game "${gameTitle}": ${error}`);
      return { hasError: false };
    }
  }

  /**
   * Проверка на блокировку по IP от поставщика игр (403 Forbidden)
   * @param gameTitle - название игры
   * @returns Promise<boolean> - true если игра заблокирована по IP, false если нет
   */
  async checkForIpBlocking(gameTitle: string): Promise<boolean> {
    this.logStep(`Checking for IP blocking for game: ${gameTitle}`);
    
    try {
      const iframe = this.page.locator('#fullscreen-container iframe');
      
      // Проверяем, что iframe существует
      if (await iframe.count() === 0) {
        this.logStep('No iframe found, IP blocking check skipped');
        return false;
      }

      const iframeContent = iframe.contentFrame();
      if (!iframeContent) {
        this.logStep('Iframe content not accessible, IP blocking check skipped');
        return false;
      }

      // Ждем загрузки содержимого iframe
      await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });

      // Проверяем на наличие сообщения о блокировке по IP
      const textIndicators = [
        'Your IP location is not allowed',
        'Sorry, Your IP location is not allowed',
        'IP location is not allowed',
        'Access denied',
        'Forbidden',
        '403'
      ];
      
      const selectorIndicators = [
        '#text',
        '.back',
        'span.back'
      ];

      // Проверяем по тексту
      const textContent = await iframeContent.locator('body').textContent().catch(() => '');
      for (const indicator of textIndicators) {
        if (textContent && textContent.toLowerCase().includes(indicator.toLowerCase())) {
          this.logSuccess(`IP blocking detected for game "${gameTitle}": ${indicator}`);
          return true;
        }
      }
      
      // Проверяем по селекторам
      for (const selector of selectorIndicators) {
        const element = iframeContent.locator(selector);
        if (await element.count() > 0) {
          const elementText = await element.textContent().catch(() => '');
          if (elementText && (elementText.toLowerCase().includes('ip location is not allowed') || 
              elementText.toLowerCase().includes('sorry'))) {
            this.logSuccess(`IP blocking detected for game "${gameTitle}" via selector: ${selector}`);
            return true;
          }
        }
      }
      
      this.logStep(`No IP blocking detected for game: ${gameTitle}`);
      return false;

    } catch (error) {
      this.logError(`Error checking IP blocking for game "${gameTitle}": ${error}`);
      return false;
    }
  }

  /**
   * Проверка на валютные ограничения (Currency restriction)
   * @param gameTitle - название игры
   * @returns Promise<{ hasError: boolean; errorDetails?: string }> - информация об ошибке
   */
  async checkForCurrencyRestriction(gameTitle: string): Promise<{ hasError: boolean; errorDetails?: string }> {
    this.logStep(`Checking for currency restriction for game: ${gameTitle}`);
    
    try {
      const iframe = this.page.locator('#fullscreen-container iframe');
      
      // Проверяем, что iframe существует
      if (await iframe.count() === 0) {
        this.logStep('No iframe found, currency restriction check skipped');
        return { hasError: false };
      }

      const iframeContent = iframe.contentFrame();
      if (!iframeContent) {
        this.logStep('Iframe content not accessible, currency restriction check skipped');
        return { hasError: false };
      }

      // Ждем загрузки содержимого iframe
      await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });

      // Проверяем на наличие валютных ограничений
      const currencyIndicators = [
        'Currency restriction',
        'We cannot offer games in detected currency',
        'Please contact customer support',
        'incorrect-currency-for-geo-location',
        'error.incorrectCurrencyGeoLocation'
      ];
      
      const currencySelectors = [
        '#title',
        '#text',
        '#container',
        'div[data-translation-key*="currency"]',
        'div[data-translation-key*="Currency"]'
      ];

      // Проверяем по тексту
      const textContent = await iframeContent.locator('body').textContent().catch(() => '');
      let errorFound = false;
      let errorDetails = '';

      for (const indicator of currencyIndicators) {
        if (textContent && textContent.includes(indicator)) {
          errorFound = true;
          errorDetails += `${indicator}; `;
        }
      }
      
      // Проверяем по селекторам для получения детальной информации
      if (errorFound) {
        for (const selector of currencySelectors) {
          const elements = await iframeContent.locator(selector).all();
          for (const element of elements) {
            const elementText = await element.textContent().catch(() => '');
            if (elementText && (
              elementText.includes('Currency restriction') ||
              elementText.includes('We cannot offer games in detected currency') ||
              elementText.includes('Please contact customer support')
            )) {
              errorDetails += `[${selector}]: ${elementText.trim()}; `;
            }
          }
        }
      }
      
      if (errorFound) {
        this.logError(`Currency restriction detected for game "${gameTitle}": ${errorDetails}`);
        return { hasError: true, errorDetails: errorDetails.trim() };
      }
      
      this.logStep(`No currency restriction detected for game: ${gameTitle}`);
      return { hasError: false };

    } catch (error) {
      this.logError(`Error checking currency restriction for game "${gameTitle}": ${error}`);
      return { hasError: false };
    }
  }

  /**
   * Проверка на ошибки стабильности игры
   * @param gameTitle - название игры
   * @returns Promise<{ hasError: boolean; errorDetails?: string }> - информация об ошибке
   */
  async checkForStabilityErrors(gameTitle: string): Promise<{ hasError: boolean; errorDetails?: string }> {
    this.logStep(`Checking for stability errors for game: ${gameTitle}`);
    
    try {
      const iframe = this.page.locator('#fullscreen-container iframe');
      
      // Проверяем, что iframe существует
      if (await iframe.count() === 0) {
        this.logStep('No iframe found, stability error check skipped');
        return { hasError: false };
      }

      const iframeContent = iframe.contentFrame();
      if (!iframeContent) {
        this.logStep('Iframe content not accessible, stability error check skipped');
        return { hasError: false };
      }

      // Ждем загрузки содержимого iframe
      await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });

      // Проверяем на наличие ошибок стабильности
      const stabilityIndicators = [
        'Game elements disappeared',
        'Game is not stable',
        'Game canvas disappeared',
        'Game iframe disappeared',
        'Game URL changed',
        'Game redirected to home page',
        'Game stability issue',
        'Game loading failed',
        'Game initialization failed'
      ];
      
      const stabilitySelectors = [
        'body',
        'div[class*="error"]',
        'div[class*="warning"]',
        'div[class*="stability"]',
        'div[id*="error"]',
        'div[id*="warning"]'
      ];

      // Проверяем по тексту
      const textContent = await iframeContent.locator('body').textContent().catch(() => '');
      let errorFound = false;
      let errorDetails = '';

      for (const indicator of stabilityIndicators) {
        if (textContent && textContent.includes(indicator)) {
          errorFound = true;
          errorDetails += `${indicator}; `;
        }
      }
      
      // Проверяем по селекторам для получения детальной информации
      if (errorFound) {
        for (const selector of stabilitySelectors) {
          const elements = await iframeContent.locator(selector).all();
          for (const element of elements) {
            const elementText = await element.textContent().catch(() => '');
            if (elementText && (
              elementText.includes('Game elements disappeared') ||
              elementText.includes('Game is not stable') ||
              elementText.includes('Game canvas disappeared') ||
              elementText.includes('Game iframe disappeared')
            )) {
              errorDetails += `[${selector}]: ${elementText.trim()}; `;
            }
          }
        }
      }
      
      if (errorFound) {
        this.logError(`Game stability error detected for game "${gameTitle}": ${errorDetails}`);
        return { hasError: true, errorDetails: errorDetails.trim() };
      }
      
      this.logStep(`No game stability errors detected for game: ${gameTitle}`);
      return { hasError: false };

    } catch (error) {
      this.logError(`Error checking game stability for game "${gameTitle}": ${error}`);
      return { hasError: false };
    }
  }
}
