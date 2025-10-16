/**
 * Game Stability Service - Сервис для проверки стабильности игр
 */

import { Page } from '@playwright/test';
import { BaseService } from '../../core/base.service';
import { Routes } from '@config/routes';

export class GameStabilityService extends BaseService {
  constructor(page: Page) {
    super(page, 'GameStabilityService');
  }

  /**
   * Проверить стабильность игры - что iframe остается открытым в течение указанного времени
   */
  async checkGameStability(gameTitle: string, durationSeconds: number = 15): Promise<boolean> {
    this.logStep(`Checking game stability for ${durationSeconds} seconds: ${gameTitle}`);
    
    const startTime = Date.now();
    const endTime = startTime + (durationSeconds * 1000);
    
    const homeUrl = Routes.HOME;
    
    try {
      while (Date.now() < endTime) {
        // Проверяем, что мы все еще на странице игры
        const currentUrl = this.page.url();
        if (currentUrl === homeUrl) {
          this.logError(`Game redirected to home page after ${Math.round((Date.now() - startTime) / 1000)} seconds`);
          return false;
        }
        
        // Проверяем, что URL содержит /play/real/ (признак открытой игры)
        if (!currentUrl.includes('/play/real/')) {
          this.logError(`Game URL changed after ${Math.round((Date.now() - startTime) / 1000)} seconds: ${currentUrl}`);
          return false;
        }
        
        // Проверяем, что iframe все еще видим (с коротким таймаутом)
        const iframe = this.page.locator('#fullscreen-container iframe');
        const isIframeVisible = await iframe.isVisible({ timeout: 1000 }).catch(() => false);
        if (!isIframeVisible) {
          this.logError(`Game iframe disappeared after ${Math.round((Date.now() - startTime) / 1000)} seconds`);
          return false;
        }
        
        // Проверяем, что canvas внутри iframe все еще видим (с коротким таймаутом)
        const iframeContent = iframe.contentFrame();
        if (iframeContent) {
          // Проверяем canvas с учетом специфической структуры DOM
          const canvasSelectors = [
            'canvas',
            'canvas[width]',
            'canvas[height]',
            'canvas:not([width="0"])',
            'canvas:not([height="0"])',
            '#__canvas_wrapper__ canvas',
            'div[id*="canvas"] canvas',
            'div[class*="canvas"] canvas',
            '#__react_wrapper__ canvas',
            '#app-content canvas'
          ];
          
          let canvasVisible = false;
          for (const selector of canvasSelectors) {
            try {
              const canvas = iframeContent.locator(selector).first();
              const isVisible = await canvas.isVisible({ timeout: 500 }).catch(() => false);
              if (isVisible) {
                canvasVisible = true;
                break;
              }
            } catch (error) {
              continue;
            }
          }
          
          if (!canvasVisible) {
            this.logError(`Game canvas disappeared after ${Math.round((Date.now() - startTime) / 1000)} seconds`);
            return false;
          }
        }
        
        // Ждем 1 секунду перед следующей проверкой
        await this.page.waitForTimeout(1000);
      }
      
      this.logSuccess(`Game remained stable for ${durationSeconds} seconds: ${gameTitle}`);
      return true;
      
    } catch (error) {
      this.logError(`Error during stability check: ${error}`);
      return false;
    }
  }

  /**
   * Мониторинг стабильности игры в течение указанного времени
   * @param gameTitle - название игры
   * @param gameSlug - URL slug игры (опционально, будет создан автоматически)
   * @param durationSeconds - продолжительность мониторинга в секундах
   * @param checkIntervalSeconds - интервал проверок в секундах
   * @returns Promise<boolean> - true если игра стабильна, false если нет
   */
  async monitorGameStability(
    gameTitle: string, 
    gameSlug?: string, 
    durationSeconds: number = 15, 
    checkIntervalSeconds: number = 5
  ): Promise<{ isStable: boolean; failureReason?: string }> {
    this.logStep(`Starting stability monitoring for ${gameTitle} (${durationSeconds}s)`);
    
    const homeUrl = Routes.HOME;
    const totalChecks = Math.ceil(durationSeconds / checkIntervalSeconds);
    let isStable = true;
    let failureReason = '';
    
    try {
      // Мониторим в течение указанного времени
      for (let i = 0; i < totalChecks; i++) {
        await this.page.waitForTimeout(checkIntervalSeconds * 1000);
        
        const currentUrl = this.page.url();
        const iframe = this.page.locator('#fullscreen-container iframe');
        const elapsedTime = (i + 1) * checkIntervalSeconds;
        
        // Проверяем URL
        if (currentUrl === homeUrl) {
          isStable = false;
          failureReason = `Redirected to home page after ${elapsedTime} seconds`;
          break;
        }
        
        // Проверяем, что URL содержит /play/real/ (признак открытой игры)
        if (!currentUrl.includes('/play/real/')) {
          isStable = false;
          failureReason = `URL changed to ${currentUrl} after ${elapsedTime} seconds (expected /play/real/ URL)`;
          break;
        }
        
        // Проверяем iframe
        const isIframeVisible = await iframe.isVisible().catch(() => false);
        if (!isIframeVisible) {
          isStable = false;
          failureReason = `Iframe disappeared after ${elapsedTime} seconds`;
          break;
        }
        
        // Проверяем canvas внутри iframe (признак загруженной игры)
        const iframeContent = iframe.contentFrame();
        if (iframeContent) {
          // Проверяем различные селекторы для canvas
          const canvasSelectors = [
            'canvas',
            'canvas[width]',
            'canvas[height]',
            'canvas:not([width="0"])',
            'canvas:not([height="0"])'
          ];
          
          let canvasFound = false;
          let canvasElement = null;
          
          for (const selector of canvasSelectors) {
            const canvas = iframeContent.locator(selector).first();
            const isVisible = await canvas.isVisible({ timeout: 1000 }).catch(() => false);
            if (isVisible) {
              canvasFound = true;
              canvasElement = canvas;
              break;
            }
          }
          
          if (!canvasFound) {
            // Если canvas не найден, попробуем подождать еще немного
            await this.page.waitForTimeout(1000);
            
            for (const selector of canvasSelectors) {
              const canvas = iframeContent.locator(selector).first();
              const isVisible = await canvas.isVisible({ timeout: 1000 }).catch(() => false);
              if (isVisible) {
                canvasFound = true;
                canvasElement = canvas;
                break;
              }
            }
            
            if (!canvasFound) {
              // Если canvas не найден, проверим альтернативные индикаторы игры
              const gameIndicators = [
                'div[class*="game"]',
                'div[class*="canvas"]',
                'div[class*="container"]',
                'div[class*="wrapper"]',
                'div[id*="game"]',
                'div[id*="canvas"]'
              ];
              
              let gameElementFound = false;
              for (const selector of gameIndicators) {
                const elements = await iframeContent.locator(selector).all();
                if (elements.length > 0) {
                  gameElementFound = true;
                  break;
                }
              }
              
              if (!gameElementFound) {
                isStable = false;
                failureReason = `Game elements disappeared after ${elapsedTime} seconds`;
                break;
              }
            }
          }
          
          // Если canvas найден, проверяем его размеры
          if (canvasElement) {
            const canvasSize = await canvasElement.evaluate((el: HTMLCanvasElement) => ({
              width: el.width,
              height: el.height
            })).catch(() => ({ width: 0, height: 0 }));
            
            if (canvasSize.width === 0 || canvasSize.height === 0) {
              // Если размеры 0, попробуем подождать еще немного
              await this.page.waitForTimeout(1000);
              const canvasSizeRetry = await canvasElement.evaluate((el: HTMLCanvasElement) => ({
                width: el.width,
                height: el.height
              })).catch(() => ({ width: 0, height: 0 }));
              
              if (canvasSizeRetry.width === 0 || canvasSizeRetry.height === 0) {
                isStable = false;
                failureReason = `Canvas has no dimensions after ${elapsedTime} seconds ` +
                  `(${canvasSizeRetry.width}x${canvasSizeRetry.height})`;
                break;
              }
            }
          }
        }
        
        this.logStep(`${gameTitle} stable after ${elapsedTime} seconds`);
      }
      
      if (isStable) {
        this.logSuccess(`${gameTitle} stability check completed successfully (${durationSeconds}s)`);
      } else {
        this.logError(`${gameTitle} stability check failed: ${failureReason}`);
      }
      
      return { isStable, failureReason };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logError(`Error during stability monitoring for ${gameTitle}: ${errorMessage}`);
      return { isStable: false, failureReason: `Monitoring error: ${errorMessage}` };
    }
  }

  /**
   * Быстрая проверка стабильности игры (5 секунд)
   * @param gameTitle - название игры
   * @param gameSlug - URL slug игры (опционально)
   */
  async quickStabilityCheck(
    gameTitle: string, 
    gameSlug?: string
  ): Promise<{ isStable: boolean; failureReason?: string }> {
    return this.monitorGameStability(gameTitle, gameSlug, 5, 2.5);
  }

  /**
   * Расширенная проверка стабильности игры (15 секунд)
   * @param gameTitle - название игры
   * @param gameSlug - URL slug игры (опционально)
   */
  async extendedStabilityCheck(
    gameTitle: string, 
    gameSlug?: string
  ): Promise<{ isStable: boolean; failureReason?: string }> {
    return this.monitorGameStability(gameTitle, gameSlug, 15, 7.5);
  }
}
