/**
 * Base Game Service - Базовый класс для всех игровых сервисов
 * Содержит общую функциональность и устраняет дублирование
 */

import { Page, Locator } from '@playwright/test';
import { BaseService } from './base-service';
import { ILogger } from '../interfaces/logger.interface';
import { GameSelectors } from '../selectors/GameSelectors';
import { GameConstants } from '../constants/GameConstants';

export abstract class BaseGameService extends BaseService {
  protected readonly selectors = GameSelectors;
  protected readonly constants = GameConstants;
  
  constructor(page: Page, serviceName: string, loggerInstance?: ILogger) {
    super(page, serviceName, loggerInstance);
  }
  
  // ============ ОСНОВНЫЕ СЕЛЕКТОРЫ ============
  
  protected get gameCards(): Locator {
    return this.page.locator(this.selectors.GAME_CARDS);
  }
  
  protected get gameIframe(): Locator {
    return this.page.locator(this.selectors.GAME_IFRAME);
  }
  
  protected get playButton(): Locator {
    return this.gameCards.locator(this.selectors.PLAY_BUTTON);
  }
  
  protected get demoButton(): Locator {
    return this.gameCards.locator(this.selectors.DEMO_BUTTON);
  }
  
  protected get favoriteButton(): Locator {
    return this.gameCards.locator(this.selectors.FAVORITE_BUTTON);
  }
  
  // ============ ОБЩИЕ МЕТОДЫ ============
  
  protected async waitForGamesToLoad(): Promise<void> {
    this.logStep('Waiting for games to load');
    try {
      await this.gameCards.first().waitFor({ 
        state: 'visible', 
        timeout: this.constants.TIMEOUTS.GAME_LOAD 
      });
      this.logSuccess('Games loaded successfully');
    } catch (error) {
      this.logError('Games did not load in time', error);
      throw error;
    }
  }
  
  protected getCurrentUrl(): string {
    return this.page.url();
  }
  
  protected isOnGamePage(): boolean {
    return this.getCurrentUrl().includes(this.constants.URL_PATTERNS.GAME_PLAY);
  }
  
  protected isOnHomePage(): boolean {
    const url = this.getCurrentUrl();
    return url.includes('/') && !url.includes('/play/');
  }
  
  protected async waitForTimeout(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }
  
  // ============ УТИЛИТЫ ============
  
  protected createGameSlug(gameTitle: string): string {
    return this.constants.createGameSlug(gameTitle);
  }
  
  protected async safeGetText(locator: Locator): Promise<string> {
    try {
      return await locator.textContent() || '';
    } catch {
      return '';
    }
  }
  
  protected async safeIsVisible(locator: Locator): Promise<boolean> {
    try {
      return await locator.isVisible();
    } catch {
      return false;
    }
  }
  
  protected async safeGetAttribute(locator: Locator, attribute: string): Promise<string | null> {
    try {
      return await locator.getAttribute(attribute);
    } catch {
      return null;
    }
  }
  
  // ============ МЕТОДЫ РАБОТЫ С IFRAME ============
  
  protected async isIframeVisible(): Promise<boolean> {
    return await this.safeIsVisible(this.gameIframe);
  }
  
  protected async waitForIframeToLoad(): Promise<void> {
    this.logStep('Waiting for iframe to load');
    try {
      await this.gameIframe.waitFor({ 
        state: 'visible', 
        timeout: this.constants.TIMEOUTS.IFRAME_WAIT 
      });
      await this.gameIframe.waitFor({ 
        state: 'attached', 
        timeout: this.constants.TIMEOUTS.IFRAME_WAIT 
      });
      this.logSuccess('Iframe loaded successfully');
    } catch (error) {
      this.logError('Iframe did not load in time', error);
      throw error;
    }
  }
  
  protected async getIframeContent(): Promise<any> {
    try {
      return await this.gameIframe.contentFrame();
    } catch (error) {
      this.logError('Failed to get iframe content', error);
      return null;
    }
  }
  
  protected async getIframeSrc(): Promise<string> {
    try {
      return await this.gameIframe.getAttribute('src') || '';
    } catch (error) {
      this.logError('Failed to get iframe src', error);
      return '';
    }
  }
  
  // ============ МЕТОДЫ РАБОТЫ С CANVAS ============
  
  protected async checkCanvasInIframe(): Promise<boolean> {
    const iframeContent = await this.getIframeContent();
    if (!iframeContent) return false;
    
    try {
      const canvas = iframeContent.locator(this.selectors.CANVAS);
      return await canvas.isVisible();
    } catch {
      return false;
    }
  }
  
  protected async checkCanvasWithMultipleSelectors(): Promise<boolean> {
    const iframeContent = await this.getIframeContent();
    if (!iframeContent) return false;
    
    for (const selector of this.constants.CANVAS_SELECTORS) {
      try {
        const canvas = iframeContent.locator(selector).first();
        const isVisible = await canvas.isVisible({ timeout: 500 });
        if (isVisible) return true;
      } catch {
        continue;
      }
    }
    
    return false;
  }
  
  protected async checkGameIndicators(): Promise<boolean> {
    const iframeContent = await this.getIframeContent();
    if (!iframeContent) return false;
    
    for (const selector of this.constants.GAME_INDICATORS) {
      try {
        const elements = await iframeContent.locator(selector).all();
        if (elements.length > 0) {
          const isVisible = await elements[0].isVisible().catch(() => false);
          if (isVisible) return true;
        }
      } catch {
        continue;
      }
    }
    
    return false;
  }
  
  // ============ МЕТОДЫ РАБОТЫ С ОШИБКАМИ ============
  
  protected async checkForErrorsInIframe(): Promise<{ hasError: boolean; errorText: string }> {
    const iframeContent = await this.getIframeContent();
    if (!iframeContent) {
      return { hasError: false, errorText: '' };
    }
    
    for (const selector of this.selectors.ERROR_SELECTORS) {
      try {
        const errorElement = iframeContent.locator(selector);
        if (await errorElement.isVisible()) {
          const errorText = await this.safeGetText(errorElement);
          return { hasError: true, errorText };
        }
      } catch {
        continue;
      }
    }
    
    return { hasError: false, errorText: '' };
  }
  
  protected async checkForSpecificError(errorType: string): Promise<boolean> {
    const iframeContent = await this.getIframeContent();
    if (!iframeContent) return false;
    
    const indicators = this.constants.getErrorIndicators(errorType);
    if (!indicators.length) return false;
    
    try {
      const bodyText = await this.safeGetText(iframeContent.locator('body'));
      return indicators.some(indicator => 
        bodyText.toLowerCase().includes(indicator.toLowerCase())
      );
    } catch {
      return false;
    }
  }
  
  // ============ МЕТОДЫ ВАЛИДАЦИИ ============
  
  protected async validateUrlPattern(expectedPattern: string): Promise<boolean> {
    const currentUrl = this.getCurrentUrl();
    return currentUrl.includes(expectedPattern);
  }
  
  protected async validateGameElements(): Promise<boolean> {
    const iframeValid = await this.isIframeVisible();
    const canvasValid = await this.checkCanvasWithMultipleSelectors();
    const noErrors = !(await this.checkForErrorsInIframe()).hasError;
    
    return iframeValid && (canvasValid || await this.checkGameIndicators()) && noErrors;
  }
}
